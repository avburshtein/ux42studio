/**
 * Шаблон письма с приглашением (инвайтом) на регистрацию.
 *
 * Письмо — единственный канал, через который новый пользователь узнаёт
 * о платформе, поэтому текст написан максимально просто: короткие фразы,
 * нумерованные шаги, одна большая кнопка и блок «что делать, если не
 * получилось».
 *
 * Ограничение почтовых клиентов: только табличная вёрстка и inline-стили.
 * Правило «без инлайнов» из Docs/CLAUDE.md относится к UI приложения —
 * в HTML-письмах CSS-классы не поддерживаются, а часть клиентов вырезает
 * <style>-блоки.
 */

import { CONTACT_EMAIL } from '@/lib/contact';

export type InviteEmailData = {
    /** Адрес, на который создано приглашение. */
    toEmail: string;
    /** 8-символьный код инвайта. */
    code: string;
    /** Прямая ссылка на регистрацию с кодом (?invite=CODE). */
    registerUrl: string;
    /** Unix-время (секунды) окончания действия кода, если задан. */
    expiresAt?: number;
};

export type BuiltEmail = {
    subject: string;
    html: string;
    text: string;
};

// Палитра письма = токены темы из src/app/globals.css (M3, light).
// В письме CSS-переменные не работают, поэтому значения продублированы
// константами; соответствие токенам указано в комментарии.
const BRAND = '#00543b'; // --md-sys-color-primary
const BRAND_SOFT = '#e6f4ed'; // --md-sys-color-primary-container (светлый)
const INK = '#1a1c1a'; // --md-sys-color-on-surface
const MUTED = '#4f5754'; // --md-sys-color-on-surface-variant
const LINE = '#dbe2de'; // --md-sys-color-outline-variant
const SOFT = '#f4f7f5'; // --md-sys-color-surface-container

/** Экранирование пользовательских данных перед вставкой в HTML. */
function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * «12 ноября 2026» — без «г.».
 *
 * Формат собирается вручную, а не через toLocaleDateString: локаль ru-RU
 * возвращает «12 ноября 2026 г.» и склеивалось «г..». Плюс формат
 * гарантирован (в Workers локаль рантайма тоже ru, но на это полагаться
 * не стоит).
 */
const MONTHS_GEN = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
];

function formatDate(unixSeconds: number): string {
    const date = new Date(unixSeconds * 1000);
    return `${date.getDate()} ${MONTHS_GEN[date.getMonth()]} ${date.getFullYear()}`;
}

/** Строка нумерованного шага: круглый бейдж + заголовок + пояснение. */
function stepCell(n: number, title: string, text: string): string {
    return `
                        <tr>
                            <td width="36" valign="top" style="padding:0 12px 18px 0;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td width="28" height="28" align="center" bgcolor="${BRAND_SOFT}" style="width:28px;height:28px;border-radius:14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:${BRAND};">
                                            ${n}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td valign="top" style="padding:0 0 18px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:${INK};">
                                <strong>${title}</strong><br />
                                ${text}
                            </td>
                        </tr>`;
}

/** Письмо-приглашение: код + инструкция «как зарегистрироваться». */
export function buildInviteEmail(data: InviteEmailData): BuiltEmail {
    const rawEmail = data.toEmail.trim();
    const rawCode = data.code.trim();
    const toEmail = escapeHtml(rawEmail);
    const code = escapeHtml(rawCode);
    const codeLower = escapeHtml(rawCode.toLowerCase());
    const url = escapeHtml(data.registerUrl);

    const validity = data.expiresAt
        ? `Код действует до ${escapeHtml(formatDate(data.expiresAt))}.`
        : 'Срок действия кода не ограничен.';

    const steps = [
        stepCell(
            1,
            'Откройте страницу регистрации.',
            'Нажмите большую зелёную кнопку выше. Если кнопка не работает — скопируйте ссылку из блока «Ссылка» внизу письма и вставьте её в адресную строку браузера. Код подставится автоматически, вводить его вручную в адресную строку не нужно.',
        ),
        stepCell(
            2,
            `Введите этот email: ${toEmail}`,
            'Именно тот адрес, на который пришло письмо. Можно ввести и другой адрес — код всё равно сработает, но системные письма (напоминания, восстановление доступа) будут приходить на тот адрес, который вы укажете при регистрации.',
        ),
        stepCell(
            3,
            `Проверьте код приглашения: ${code}`,
            `Он подставлен автоматически. Если поле оказалось пустым — скопируйте код из блока «Ваш код приглашения» и вставьте вручную. Регистр не важен: можно ввести <code>${codeLower}</code>.`,
        ),
        stepCell(
            4,
            'Нажмите «Зарегистрироваться».',
            'Пароль придумает система — он покажется один раз, сразу после регистрации, и сразу скопируется в буфер обмена. Сохраните его: он понадобится для входа с других устройств.',
        ),
        stepCell(
            5,
            'Пользуйтесь панелью и смените пароль.',
            'После регистрации вы сразу окажетесь в панели управления. Первым делом откройте «Настройки профиля» → «Безопасность» и задайте пароль, который легко запомнить.',
        ),
    ].join('');

    const html = `<!doctype html>
<html lang="ru">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light" />
        <title>Приглашение на регистрацию в UX42 Studio</title>
    </head>
    <body style="margin:0;padding:0;background:${SOFT};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${SOFT};">
            <tr>
                <td align="center" style="padding:24px 12px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid ${LINE};border-radius:20px;">
                        <tr>
                            <td style="padding:28px 32px 0 32px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:${BRAND};letter-spacing:.5px;">
                                            UX42 Studio
                                        </td>
                                        <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};">
                                            Приглашение на доступ
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:20px 32px 0 32px;">
                                <h1 style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:34px;color:${INK};">
                                    Вам открыли доступ к платформе
                                </h1>
                                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:${MUTED};">
                                    Это письмо-приглашение. Чтобы начать работу, нужно
                                    зарегистрироваться — 5 простых шагов, меньше минуты.
                                    Ничего устанавливать не нужно: всё происходит в браузере.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:28px 32px 0 32px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td align="center" bgcolor="${BRAND}" style="border-radius:14px;">
                                            <a href="${url}" style="display:block;padding:18px 24px;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:bold;color:#ffffff;text-decoration:none;">
                                                Открыть страницу регистрации
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="margin:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:${MUTED};text-align:center;">
                                    Код подставится автоматически.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:28px 32px 0 32px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${SOFT};border:1px dashed ${BRAND};border-radius:14px;">
                                    <tr>
                                        <td align="center" style="padding:20px 16px 18px 16px;">
                                            <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">
                                                Ваш код приглашения
                                            </div>
                                            <div style="padding:10px 0 8px 0;font-family:'Courier New',Courier,monospace;font-size:32px;font-weight:bold;letter-spacing:6px;color:${BRAND};">
                                                ${code}
                                            </div>
                                            <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:${MUTED};">
                                                ${validity}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:32px 32px 0 32px;">
                                <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${MUTED};padding-bottom:16px;">
                                    Как зарегистрироваться
                                </div>
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    ${steps}
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:4px 32px 0 32px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid ${LINE};">
                                    <tr>
                                        <td style="padding:24px 0 0 0;">
                                            <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${MUTED};padding-bottom:12px;">
                                                Ссылка (если кнопка не работает)
                                            </div>
                                            <div style="padding:12px 14px;background:${SOFT};border:1px solid ${LINE};border-radius:10px;font-family:'Courier New',Courier,monospace;font-size:13px;line-height:20px;color:${INK};word-break:break-all;">
                                                ${url}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:24px 0 0 0;">
                                            <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${MUTED};padding-bottom:12px;">
                                                Если что-то пошло не так
                                            </div>
                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${MUTED};">
                                                <tr>
                                                    <td width="14" valign="top" style="padding:0 0 6px 0;">—</td>
                                                    <td valign="top" style="padding:0 0 6px 0;">
                                                        Код не подходит: проверьте, что ввели его целиком, без пробелов и без точки в конце.
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="14" valign="top" style="padding:0 0 6px 0;">—</td>
                                                    <td valign="top" style="padding:0 0 6px 0;">
                                                        Код истёк: напишите администратору, он создаст новый инвайт.
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="14" valign="top" style="padding:0 0 6px 0;">—</td>
                                                    <td valign="top" style="padding:0 0 6px 0;">
                                                        Письма нет во «Входящих»: загляните в «Спам» / «Нежелательные» и проверьте, что адрес в поле «Кому» — ${toEmail}.
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="14" valign="top" style="padding:0;">—</td>
                                                    <td valign="top" style="padding:0;">
                                                        Нужна помощь: ${CONTACT_EMAIL.privacy} — отвечаем по-русски и по-английски.
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:28px 32px 28px 32px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid ${LINE};">
                                    <tr>
                                        <td style="padding:20px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:${MUTED};">
                                            Вы получили это письмо, потому что администратор платформы
                                            создал приглашение на адрес ${toEmail}. Если вы не ожидали
                                            это письмо — просто проигнорируйте его: аккаунт создан не
                                            будет, никаких действий не требуется.
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>`;

    const text = `UX42 Studio — приглашение на доступ к платформе

Это письмо-приглашение. Чтобы начать работу, нужно зарегистрироваться — 5 простых шагов, меньше минуты. Ничего устанавливать не нужно: всё происходит в браузере.

КАК ЗАРЕГЕСТРИРОВАТЬСЯ

1. Откройте страницу регистрации: ${data.registerUrl}
   Код подставится автоматически. Если ссылка не открывается — скопируйте её и вставьте в адресную строку браузера.
2. Введите этот email: ${rawEmail}
3. Проверьте код приглашения: ${rawCode}
   Он подставлен автоматически. Регистр не важен: можно ввести строчными.
4. Нажмите «Зарегистрироваться». Пароль придумает система — он покажется один раз, сразу после регистрации, и сразу скопируется в буфер обмена. Сохраните его: он понадобится для входа с других устройств.
5. Пользуйтесь панелью и смените пароль: «Настройки профиля» → «Безопасность».

ВАШ КОД ПРИГЛАШЕНИЯ: ${rawCode}
${validity}

ССЫЛКА (если кнопка выше не работает)
${data.registerUrl}

ЕСЛИ ЧТО-ТО ПОШЛО НЕ ТАК
— код не подходит: проверьте, что ввели его целиком, без пробелов;
— код истёк: попросите администратора создать новый инвайт;
— письма нет во «Входящих»: проверьте папку «Спам» / «Нежелательные», а также адрес ${rawEmail};
— нужна помощь: напишите на ${CONTACT_EMAIL.privacy}.

Вы получили это письмо, потому что администратор платформы создал приглашение на адрес ${rawEmail}. Если вы не ожидали это письмо — просто проигнорируйте его: аккаунт создан не будет.`;

    return {
        subject: 'Ваш доступ к UX42 Studio — регистрация по приглашению',
        html,
        text,
    };
}

/**
 * Письмо после успешной регистрации: подтверждение аккаунта и короткий
 * план «что делать дальше».
 *
 * Пароль сюда намеренно НЕ включается: он показывается на экране один раз
 * и должен остаться там, где его увидел человек.
 */
export function buildRegisteredEmail(data: {
    toEmail: string;
    profileUrl: string;
    passwordUrl: string;
}): BuiltEmail {
    const toEmail = escapeHtml(data.toEmail.trim());
    const profileUrl = escapeHtml(data.profileUrl);
    const passwordUrl = escapeHtml(data.passwordUrl);
    const rawEmail = data.toEmail.trim();

    const html = `<!doctype html>
<html lang="ru">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light" />
        <title>Аккаунт создан — UX42 Studio</title>
    </head>
    <body style="margin:0;padding:0;background:${SOFT};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${SOFT};">
            <tr>
                <td align="center" style="padding:24px 12px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid ${LINE};border-radius:20px;">
                        <tr>
                            <td style="padding:28px 32px 0 32px;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:${BRAND};letter-spacing:.5px;">
                                UX42 Studio
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:20px 32px 0 32px;">
                                <h1 style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:34px;color:${INK};">
                                    Аккаунт создан — добро пожаловать
                                </h1>
                                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:${MUTED};">
                                    Регистрация на адрес ${toEmail} прошла успешно, вы уже
                                    вошли в систему. Осталось три шага — и можно
                                    приступать к работе.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:28px 32px 0 32px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    ${stepCell(
                                        1,
                                        'Смените пароль на удобный.',
                                        `Сгенерированный пароль был показан на экране один раз и в это письмо намеренно не попал — так безопаснее. Замените его своим: <a href="${passwordUrl}" style="color:${BRAND};">Настройки → Безопасность</a>.`,
                                    )}
                                    ${stepCell(
                                        2,
                                        'Заполните профиль.',
                                        'Имя, заголовок, фото и короткое описание — это то, что видят посетители вашей страницы. Откройте «Настройки» → «Аккаунт» и заполните блок «Личная информация».',
                                    )}
                                    ${stepCell(
                                        3,
                                        'Соберите первый кейс.',
                                        '«Ред. проекты» → «Новый проект»: обложка, суть задачи, процесс, результаты и галерея. Ссылку на публичную страницу кейса можно скопировать из карточки проекта.',
                                    )}
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px 32px 0 32px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td align="center" bgcolor="${BRAND}" style="border-radius:14px;">
                                            <a href="${profileUrl}" style="display:block;padding:18px 24px;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:bold;color:#ffffff;text-decoration:none;">
                                                Перейти в панель управления
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:24px 32px 28px 32px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:${MUTED};">
                                Это письмо отправлено, потому что аккаунт создан на адрес
                                ${toEmail}. Вопросы и поддержка: ${CONTACT_EMAIL.privacy}.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>`;

    const text = `UX42 Studio — аккаунт создан

Регистрация на адрес ${rawEmail} прошла успешно, вы уже вошли в систему. Осталось три шага — и можно приступать к работе.

1. Смените пароль на удобный. Сгенерированный пароль был показан на экране один раз и в это письмо намеренно не попал — так безопаснее. Замените его своим: ${data.passwordUrl} (Настройки → Безопасность).
2. Заполните «Настройки» → «Аккаунт»: имя, заголовок и описание — это то, что видят посетители вашей страницы.
3. Соберите первый кейс: «Ред. проекты» → «Новый проект» — обложка, суть задачи, процесс, результаты и галерея.

Перейти в панель управления: ${data.profileUrl}

Вопросы и поддержка: ${CONTACT_EMAIL.privacy}.`;

    return {
        subject: 'Аккаунт создан — добро пожаловать в UX42 Studio',
        html,
        text,
    };
}


// ---------------------------------------------------------------------------
// Обращение из публичной формы обратной связи («Contact us»)
// ---------------------------------------------------------------------------

export type ContactEmailData = {
    /** Имя посетителя (поле формы). */
    name: string;
    /** Обратный адрес посетителя — становится Reply-To письма. */
    email: string;
    /** Текст обращения. */
    message: string;
    /** Откуда отправлено: «Home», «For designers», «Designer page: slug». */
    source?: string;
};

/**
 * Уведомление студии о сообщении из формы обратной связи.
 *
 * Письмо уходит студии (hello@ или адрес дизайнера), а Reply-To настроен
 * на посетителя — можно ответить кнопкой «Ответить», не пересобирая адрес.
 * Текст сообщения экранируется и переносится построчно: в письме нельзя
 * доверять разметке пользователя.
 */
export function buildContactEmail(data: ContactEmailData): BuiltEmail {
    const name = escapeHtml(data.name.trim());
    const email = escapeHtml(data.email.trim());
    const message = escapeHtml(data.message.trim())
        .replace(/\r\n/g, '\n')
        .replace(/\n/g, '<br />');
    const source = escapeHtml((data.source ?? '').trim());

    const metaRow = (label: string, value: string): string => `
                        <tr>
                            <td width="140" valign="top" style="padding:6px 12px 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${MUTED};">${label}</td>
                            <td valign="top" style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${INK};">${value}</td>
                        </tr>`;

    const html = `<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background:${SOFT};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${SOFT};">
            <tr>
                <td align="center" style="padding:24px 12px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid ${LINE};border-radius:20px;">
                        <tr>
                            <td style="padding:28px 32px 0 32px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:${BRAND};letter-spacing:.5px;">
                                            UX42 Studio
                                        </td>
                                        <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};">
                                            Обращение с сайта
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:20px 32px 0 32px;">
                                <h1 style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:32px;color:${INK};">
                                    Новое сообщение из формы обратной связи
                                </h1>
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid ${LINE};">
                                    ${metaRow('Имя', name)}
                                    ${metaRow('Ответить на', email)}
                                    ${metaRow('Страница', source || '—')}
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:16px 32px 0 32px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${SOFT};border:1px dashed ${BRAND};border-radius:14px;">
                                    <tr>
                                        <td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${INK};">
                                            ${message}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:20px 32px 28px 32px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:${MUTED};">
                                Reply-To настроен на адрес отправителя — можно отвечать прямо на это письмо.
                                Форма обратной связи сайта ux42.studio; вопросы по данным: ${CONTACT_EMAIL.privacy}.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>`;

    const text = `UX42 Studio — новое обращение с сайта

Имя: ${data.name.trim()}
Ответить на: ${data.email.trim()}
Страница: ${(data.source ?? '').trim() || '—'}

Сообщение:
${data.message.trim()}

Reply-To настроен на адрес отправителя — можно отвечать прямо на это письмо.`;

    return {
        subject: `Новое обращение с сайта — ${data.name.trim().slice(0, 60)}`,
        html,
        text,
    };
}
