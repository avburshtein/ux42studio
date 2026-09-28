'use server';

/**
 * Удаление учётной записи и всех связанных данных (GDPR Art. 17, право на
 * забвение). Нужна и юридически (обязанность дать способ реализовать
 * право), и практически — иначе политика обещает удаление «по запросу»,
 * а запросить нечем.
 *
 * ⚠️ ПОРЯДОК ОПЕРАЦИЙ КРИТИЧЕН. На `users.id` ссылаются три таблицы БЕЗ
 * `onDelete: cascade`, поэтому `DELETE FROM users` в лоб падает с ошибкой
 * внешнего ключа:
 *   • files.uploader_id      NOT NULL
 *   • invites.created_by_user_id NOT NULL
 *   • invites.used_by_user_id      nullable
 * Каскад от `users` есть только у `profiles.user_id`; от профиля каскадят
 * `social_links` и `projects`, а от проекта — все секции кейса.
 *
 * Объекты в R2 каскадом SQL не удаляются — их нужно снести из бакета
 * отдельно, иначе в бакете останутся осиротевшие файлы (и, что важнее,
 * персональные данные: аватары, обложки, фото из кейсов).
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { getDb } from '@/db';
import { users, invites } from '@/db/schema/users';
import { profiles } from '@/db/schema/profiles';
import { files } from '@/db/schema/files';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// `ok` не обязателен, чтобы ветки ошибки возвращали только { error } —
// так сигнатура читается «пусто = успех, error = причина».
type PurgeResult = { ok?: boolean; error?: string };

/**
 * Полное удаление пользователя: файлы из R2 → строки `files` →
 * приглашения → сама запись `users` (каскадом уносит профиль и кейсы).
 * Общая часть для самостоятельного удаления и удаления админом.
 */
async function purgeUser(
    db: ReturnType<typeof getDb>,
    bucket: R2Bucket,
    userId: string,
): Promise<PurgeResult> {
    // 1. Собираем ключи R2 ДО удаления строк — после удаления их уже не узнать.
    const userFiles = await db
        .select({ id: files.id, r2Key: files.r2Key })
        .from(files)
        .where(eq(files.uploaderId, userId));

    // 2. Объекты в бакете. Ошибки не пробрасываем: удаление аккаунта должно
    //    довестись до конца даже если один объект не удалился — иначе
    //    пользователь останется «наполовину удалённым» и уйдёт без результата.
    for (const f of userFiles) {
        try {
            await bucket.delete(f.r2Key);
        } catch {
            console.error('[purgeUser] не удалось удалить R2-объект', f.r2Key);
        }
    }

    // 3. Приглашения: created_by_user_id NOT NULL — строку приходится удалять,
    //    used_by_user_id nullable — обнуляем, сохраняя историю приглашения.
    await db.delete(invites).where(eq(invites.createdByUserId, userId));
    await db
        .update(invites)
        .set({ usedByUserId: null })
        .where(eq(invites.usedByUserId, userId));

    // 4. Профиль. Именно профиль, а не пользователя: каскад profiles → projects
    //    → секции кейса (personas, comparisons, reviews, assets) уносит все
    //    ссылки на файлы этого пользователя. Проверено на реальной схеме D1:
    //    project_personas.avatar_file_id имеет on_delete NO ACTION, поэтому
    //    удалять files ДО профиля нельзя — падает FOREIGN KEY.
    await db.delete(profiles).where(eq(profiles.userId, userId));

    // 5. Файлы — теперь на них никто не ссылается. Строка files может быть
    //    целью чужого каскада, поэтому идём строго после профиля.
    await db.delete(files).where(eq(files.uploaderId, userId));

    // 6. Пользователь. К этому моменту на users.id не осталось ссылок:
    //    profiles удалён, files удалён, invites вычищены.
    await db.delete(users).where(eq(users.id, userId));

    return { ok: true };
}

/**
 * Самостоятельное удаление аккаунка дизайнера.
 * Требует подтверждения вводом email — защита от случайного клика по
 * необратимой операции. Пароль не спрашиваем: он генерируется системой и
 * мог быть утерян, а подтверждение почтой достаточно для осознанности.
 */
export async function deleteMyAccount(confirmEmail: string): Promise<PurgeResult> {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) return { error: 'Not authenticated' };

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const me = await db.query.users.findFirst({
        where: { id: userId },
        columns: { id: true, email: true },
    });
    if (!me) return { error: 'User not found' };

    if (confirmEmail.trim().toLowerCase() !== me.email.toLowerCase()) {
        return { error: 'Email does not match this account' };
    }

    await purgeUser(db, env.MY_BUCKET, userId);

    // Сессия мертва вместе с пользователем — сбрасываем куку, иначе
    // следующий запрос уедет по старому токену.
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');

    revalidatePath('/', 'layout');
    return { ok: true };
}

/**
 * Удаление аккаунта администратором (суперадминка). В отличие от
 * самостоятельного удаления, подтверждения не требует — администратор
 * действует от имени платформы.
 */
export async function deleteUserByAdmin(userId: string): Promise<PurgeResult> {
    const headersList = await headers();
    if (headersList.get('x-user-role') !== 'admin') {
        return { error: 'Admin only' };
    }

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const target = await db.query.users.findFirst({
        where: { id: userId },
        columns: { id: true, role: true },
    });
    if (!target) return { error: 'User not found' };

    // Последнего администратора удалять нельзя: иначе платформа остаётся
    // без доступа и восстановить её можно будет только через БД.
    if (target.role === 'admin') {
        const admins = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.role, 'admin'));
        if (admins.length <= 1) {
            return { ok: false, error: 'Cannot delete the last admin account' };
        }
    }

    await purgeUser(db, env.MY_BUCKET, userId);
    revalidatePath('/super-admin/users');
    revalidatePath('/super-admin');
    return { ok: true };
}
