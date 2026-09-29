/**
 * Страница смены пароля переехала в раздел «Безопасность»
 * (/admin/settings). Маршрут оставлен как редирект: на старую ссылку уже
 * приходят письма-приглашения (см. src/lib/email/templates.ts), и 404 в
 * них ломал бы первый шаг регистрации.
 */
import { redirect } from 'next/navigation';

export default function ChangePasswordPage() {
    redirect('/admin/settings');
}
