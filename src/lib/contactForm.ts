import { z } from 'zod';

/**
 * Схема публичной формы обратной связи (модалка «Contact us»).
 *
 * Схема живёт в отдельном модуле, а не в файле серверного экшна: файлы
 * `'use server'` могут экспортировать только async-функции, а эта схема
 * нужна и клиенту (react-hook-form), и серверу. Сервер обязан прогонять
 * данные через неё повторно — клиентской валидации недостаточно: поле
 * можно подделать любой консолью.
 *
 * Тексты ошибок — EN: форма публичная, а публичный UI по §6.1
 * дизайн-системы на английском.
 */

/** Имя скрытого honeypot-поля. Нейтральное, без смысла для автозаполнения. */
export const CONTACT_HONEYPOT_FIELD = 'website_url';

export const contactFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Please enter your name (at least 2 characters)')
        .max(100, 'Name is too long (max 100 characters)'),
    email: z.email('Please enter a valid email address'),
    message: z
        .string()
        .trim()
        .min(10, 'Tell us a bit more — at least 10 characters')
        .max(5000, 'Message is too long (max 5000 characters)'),
    /**
     * Honeypot: валидация намеренно пустая — поле должно принимать любое
     * значение, иначе бот получит видимую ошибку и поймёт, что пойман.
     * Реальная проверка — на сервере: непустой honeypot = молчаливый успех
     * без отправки (см. `sendContactMessage`). Без `.default()`: он делал
     * входной и выходной типы схемы разными, и zodResolver не совпадал
     * с `useForm<ContactFormData>`. Ключ — вычисляемый из
     * CONTACT_HONEYPOT_FIELD, чтобы имя нельзя было рассинхронизировать.
     */
    [CONTACT_HONEYPOT_FIELD]: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/** Лимит отправки: не больше 3 обращений с одного IP за час (D1). */
export const CONTACT_RATE_LIMIT = { max: 3, windowSeconds: 3600 } as const;
