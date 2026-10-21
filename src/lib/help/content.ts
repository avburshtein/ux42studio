// Справочник платформы — единый источник статей раздела /help.
//
// Формат — TS-модули (решение: начать без БД, миграцию в базу оставить на
// потом; данные при переезде переиспользуются). Всё type-safe: новая статья =
// новый объект в HELP_ARTICLES, компилятор проверит обязательные поля.
//
// Правила добавления статьи (см. также Docs/HELP.md):
//  1. Добавьте объект в HELP_ARTICLES (slug уникален, kebab-case).
//  2. Приложите статью к существующей категории (category === category.id) —
//     индекс /help и поиск строятся из этого реестра автоматически.
//  3. Текст секций — markdown-lite (RichText): переносы строк, списки
//     «- пункт», **жирный**, *курсив*. Рендер без dangerouslySetInnerHTML.
//  4. Обновите lastUpdated у правимой статьи.

export const HELP_LAST_UPDATED = 'October 20, 2026';

/** Блок таблицы внутри статьи (как PrivacyTable в legal, но проще). */
export interface HelpTable {
    headers: string[];
    rows: string[][];
}

/** Логический блок статьи. Секция рендерится как H2 + содержимое. */
export interface HelpSection {
    heading: string;
    /** Абзацы markdown-lite */
    paragraphs?: string[];
    /** Нумерованные шаги «как сделать» */
    steps?: string[];
    /** Маркированный список (переносы строк внутри элемента допустимы) */
    bullets?: string[];
    /** Таблица факт-шпаргалка */
    table?: HelpTable;
}

export interface HelpCategory {
    id: string;
    title: string;
    description: string;
}

export interface HelpArticle {
    /** URL: /help/{slug}, уникальный kebab-case */
    slug: string;
    category: string;
    title: string;
    /** 1-2 предложения — карточка в индексе и подпись в статье */
    summary: string;
    /** Строки для поиска (имена фич, кнопок, адресов — EN/RU вперемешку) */
    keywords: string[];
    lastUpdated: string;
    sections: HelpSection[];
}

export const HELP_CATEGORIES: HelpCategory[] = [
    {
        id: 'getting-started',
        title: 'Getting started',
        description:
            'How access works, how to register with an invitation code and sign in for the first time.',
    },
    {
        id: 'account',
        title: 'Account & security',
        description:
            'Password change and recovery, sessions and how long you stay signed in.',
    },
    {
        id: 'portfolio',
        title: 'Your portfolio page',
        description:
            'Profile settings, the public page address, hiding the site and what visitors see.',
    },
    {
        id: 'cases',
        title: 'Creating case studies',
        description:
            'New case, editor sections, text formatting, galleries and image cropping, publishing.',
    },
    {
        id: 'studio-admin',
        title: 'For the studio team',
        description:
            'Invites, accounts and projects management for super-administrators.',
    },
    {
        id: 'contact-privacy',
        title: 'Contact & privacy',
        description:
            'How to reach the studio and how your data is handled.',
    },
];

export const HELP_ARTICLES: HelpArticle[] = [
    {
        slug: 'how-invites-work',
        category: 'getting-started',
        title: 'How invites work',
        summary:
            'The platform is invite-only: the studio sends a personal invitation email with an 8-character code.',
        keywords: ['invite', 'инвайт', 'код', 'invitation', 'email', 'доступ'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'Access is by invitation only',
                paragraphs: [
                    'There is no open sign-up. A designer can create an account only after the studio sends them an **invitation email** to their personal address.',
                    'The invitation contains a unique **8-character code** (for example `K7PM-Q2XA`). The code is what grants access — the link itself simply pre-fills the code for you.',
                ],
            },
            {
                heading: 'What an invitation email contains',
                bullets: [
                    'A direct link to the registration page with the code already filled in.',
                    'The 8-character code in case you prefer to open **ux42.studio/register** manually and paste it.',
                    'Short registration steps that mirror the ones on the site.',
                ],
            },
            {
                heading: 'How long a code is valid',
                paragraphs: [
                    'Codes are single-use: once the invitation is used to create an account, it cannot be registered again. If you did not receive the email, check your spam folder first — Gmail and Outlook sometimes hold messages from unknown domains — and then ask the studio to send a new invitation to the same address.',
                ],
            },
            {
                heading: 'Email address and your account',
                paragraphs: [
                    'The email you register with is the one that must match the invitation, and it becomes your login. It cannot be changed later in the profile settings — if your working email changes, contact the studio and the address will be updated on our side.',
                ],
            },
        ],
    },
    {
        slug: 'registering-your-account',
        category: 'getting-started',
        title: 'Registering your account',
        summary:
            'Open the invitation link, confirm the code and email — the password is generated for you and shown once.',
        keywords: ['register', 'регистрация', 'пароль', 'password', 'signup', 'автогенерация'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'Three steps',
                steps: [
                    'Open the link from the invitation email, or go to **ux42.studio/register** and enter the 8-character code manually.',
                    'Enter the email address the invitation was sent to, and click **Register**.',
                    'A secure password will be generated automatically and shown **once**. Copy it and keep it somewhere safe — the page will not show it again.',
                ],
            },
            {
                heading: 'Things to know',
                bullets: [
                    'The code is case-insensitive: `k7pm-q2xa` and `K7PM-Q2XA` are the same code.',
                    'The email must be exactly the one the invitation was sent to, otherwise registration will be rejected.',
                    'You do not invent a password — the platform generates one for you. You can change it later in **Admin → Security** (see *Changing your password*).',
                ],
            },
            {
                heading: 'After registration',
                paragraphs: [
                    'You are signed in automatically and land in the admin area. The next steps are: fill in your profile (see *Profile settings*) and create your first case study (see *Creating a new case*).',
                ],
            },
        ],
    },
    {
        slug: 'signing-in-and-sessions',
        category: 'getting-started',
        title: 'Signing in and sessions',
        summary: 'Sign in with your email and password; the session stays active for 7 days.',
        keywords: ['login', 'вход', 'session', 'сессия', 'sign out', 'выйти'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'Sign in',
                paragraphs: [
                    'Go to **ux42.studio/login** and sign in with the email you registered and your password. If you forgot the password, use the **Forgot password?** link — see *Password recovery*.',
                ],
            },
            {
                heading: 'How long the session lasts',
                paragraphs: [
                    'A signed-in session is valid for **7 days** on this browser, then you are asked to sign in again. A new sign-in replaces the previous session — only one active session per account is kept.',
                ],
            },
            {
                heading: 'Signing out',
                paragraphs: [
                    'Use the **Выйти / Sign out** button in the top bar of the admin area. Signing out ends the session in this browser only.',
                ],
            },
        ],
    },
    {
        slug: 'changing-your-password',
        category: 'account',
        title: 'Changing your password',
        summary:
            'The password you received at registration can be replaced with your own in the Security settings.',
        keywords: ['пароль', 'password', 'security', 'безопасность', 'смена'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'Where to change it',
                steps: [
                    'Sign in and open **Admin → Profile**.',
                    'Scroll to the **Security** section.',
                    'Enter your **current password**, then the **new password** twice to confirm.',
                    'Save — the new password works immediately, the old one is invalidated.',
                ],
            },
            {
                heading: 'Password requirements',
                bullets: [
                    'Minimum 8 characters.',
                    'At least one letter and one digit.',
                    'No spaces at the start or end.',
                ],
            },
            {
                heading: 'Why the password was generated for you',
                paragraphs: [
                    'At registration the platform creates a strong random password so that no weak or reused password ever enters the database. You can replace it with your own at any time using the steps above — the generated one is no longer required after that.',
                ],
            },
        ],
    },
    {
        slug: 'password-recovery',
        category: 'account',
        title: 'Password recovery',
        summary:
            'If you forgot your password, request a reset link — a one-time link valid for 1 hour will be sent to your email.',
        keywords: ['забыл', 'забыла', 'reset', 'восстановление', 'forgot password', 'recovery'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'Requesting a reset',
                steps: [
                    'Open **ux42.studio/login** and click **Forgot password?** (or go straight to **/forgot-password**).',
                    'Enter the email your account is registered with and submit the form.',
                    'Within a couple of minutes you will receive an email with a **one-time reset link**.',
                    'Open the link, set a new password and confirm it — you will be signed in automatically.',
                ],
            },
            {
                heading: 'The reset link',
                bullets: [
                    'Valid for **1 hour** from the moment of the request.',
                    'Single-use: after a successful reset the link dies, even if you never clicked it to the end.',
                    'Requesting a new link invalidates the previous one.',
                ],
            },
            {
                heading: 'If the email does not arrive',
                paragraphs: [
                    'Check the spam folder first — messages from a domain you never wrote to are often filtered. If nothing arrives within 10 minutes, request a reset again; every request replaces the old link, so the newest email is the only one that works.',
                ],
            },
        ],
    },
    {
        slug: 'profile-settings',
        category: 'portfolio',
        title: 'Profile settings',
        summary:
            'Your name, page address, tagline, city, website and bio — everything visitors see on your public page.',
        keywords: ['профиль', 'profile', 'имя', 'slug', 'адрес страницы', 'bio', 'ссылки'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'Where to edit',
                steps: [
                    'Sign in and open **Admin → Profile**.',
                    'Fill in the **Personal information** card: name, page address, tagline, city, website and bio.',
                    'Manage your social links in the **Links** card.',
                    'Click **Save** — public pages update immediately.',
                ],
            },
            {
                heading: 'Page address (slug)',
                paragraphs: [
                    'The page address defines your public URL: `ux42.studio/u/your-address`. It is lowercase Latin letters, digits and hyphens; the platform checks availability as you type.',
                    'Changing the address later breaks old links, so pick it carefully the first time. Your email and password live in separate sections and are not touched here.',
                ],
            },
            {
                heading: 'What each field does',
                table: {
                    headers: ['Field', 'Where it appears'],
                    rows: [
                        ['Name', 'Header of your public page and page title'],
                        ['Tagline', 'Large heading under your name'],
                        ['City', 'Next to your name on the public page'],
                        ['Website', 'Link block on the public page'],
                        ['Bio', 'Paragraph on the public page'],
                        ['Links', 'Social icons/links block on the public page'],
                    ],
                },
            },
        ],
    },
    {
        slug: 'hiding-your-site',
        category: 'portfolio',
        title: 'Hiding your site',
        summary:
            'A single switch hides your public page: visitors get 404, you keep full access and all your content.',
        keywords: ['скрыть', 'hide', 'isPublic', '404', 'видимость', 'приватность', 'draft'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'How to hide the page',
                steps: [
                    'Open **Admin → Profile**.',
                    'In the **Site visibility** section switch **Public page** off.',
                    'Save — the change applies instantly, no cache delay.',
                ],
            },
            {
                heading: 'What happens when hidden',
                table: {
                    headers: ['Where', 'What happens'],
                    rows: [
                        [
                            '/u/your-address',
                            '404 for everyone except you — you see a coral banner saying the page is hidden',
                        ],
                        ['Homepage', 'Your cases and links disappear; the Work block shows an empty state'],
                        ['/platform', 'The live example and its menu item disappear'],
                        ['sitemap.xml', 'Your profile is excluded automatically'],
                        ['/admin', 'Everything works as before — cases and settings are untouched'],
                    ],
                },
            },
            {
                heading: 'Nothing is deleted',
                paragraphs: [
                    'Hiding is a visibility switch, not deletion. All cases, galleries and settings stay in place; turning the switch back on restores the public page exactly as it was.',
                ],
            },
        ],
    },
    {
        slug: 'creating-a-new-case',
        category: 'cases',
        title: 'Creating a new case',
        summary:
            'Cases are created from the admin area and go through a multi-step editor before publication.',
        keywords: ['кейс', 'case', 'создание', 'черновик', 'draft', 'визард', 'wizard'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'Creating the case',
                steps: [
                    'Open **Admin → Cases** and click **New case**.',
                    'Fill in the basics: title, URL slug, cover image.',
                    'Save — the case is created as a **draft** and opens in the step editor.',
                ],
            },
            {
                heading: 'Drafts are private',
                paragraphs: [
                    'A draft case does not appear on your public page, on the homepage, or in the sitemap. Only you can see it — visitors and other designers cannot.',
                ],
            },
            {
                heading: 'Step editor',
                paragraphs: [
                    'The editor is organized into steps (General → Design → Gallery → Problem → Research → Results → Review → Showcase → Review & Publish). Each step saves independently — you can fill one section at a time and return later; nothing is lost between sessions.',
                ],
            },
        ],
    },
    {
        slug: 'case-editor-sections',
        category: 'cases',
        title: 'Case editor sections',
        summary:
            'What each editor block controls on the public case page, from hero to showcase.',
        keywords: [
            'секции',
            'sections',
            'hero',
            'design',
            'gallery',
            'problem',
            'research',
            'results',
            'review',
            'showcase',
            'meta',
        ],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'What each block does',
                table: {
                    headers: ['Editor step', 'What appears on the page'],
                    rows: [
                        ['General (Meta)', 'Case title, teaser, cover, and metadata: role, year, client. Feeds the hero block and the case card.'],
                        ['Design', 'The design system: color roles and swatches, typography, visual language.'],
                        ['Gallery', 'Image grids: moodboard, wireframes, showcase. Grid presets control slot arrangement.'],
                        ['Problem', 'The “challenge” block: goal, target users, problem statement.'],
                        ['Research', 'Research artifacts: methodology, personas, flows, findings.'],
                        ['Results', 'Outcomes: metric cards and before/after comparisons.'],
                        ['Review', 'Testing process, client testimonial, key takeaway.'],
                        ['Showcase', 'The final presentation gallery and closing blocks.'],
                    ],
                },
            },
            {
                heading: 'Everything is optional',
                paragraphs: [
                    'You do not have to fill every section. Empty blocks simply do not render on the public page — you can build a case with only hero, problem and results if that suits the project.',
                ],
            },
        ],
    },
    {
        slug: 'text-formatting',
        category: 'cases',
        title: 'Text formatting in case fields',
        summary:
            'Case text fields support a light markdown: line breaks, lists with green markers, bold and italic.',
        keywords: ['markdown', 'rich text', 'форматирование', 'список', 'жирный', 'курсив', 'перенос'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'What you can use',
                table: {
                    headers: ['You type', 'You get'],
                    rows: [
                        ['A single new line', 'A line break within the paragraph.'],
                        ['A blank line', 'A new paragraph.'],
                        ['`- item` or `* item` at the start of a line', 'A list item with a green marker.'],
                        ['`**text**`', 'Bold text.'],
                        ['`*text*`', 'Italic text.'],
                    ],
                },
            },
            {
                heading: 'Where it applies',
                paragraphs: [
                    'All multi-line case text fields (section descriptions, before/after texts, and similar) use this formatting in both the editor and the public page. Single-line fields render as plain text.',
                ],
            },
            {
                heading: 'Safety',
                paragraphs: [
                    'Formatting is rendered as React elements — no raw HTML is inserted, so nothing you paste can inject markup or scripts into the page.',
                ],
            },
        ],
    },
    {
        slug: 'galleries-and-image-cropping',
        category: 'cases',
        title: 'Galleries & image cropping',
        summary:
            'Choose a grid preset, upload images, and crop each image to fit its slot exactly.',
        keywords: [
            'gallery',
            'галерея',
            'grid',
            'preset',
            'crop',
            'кроп',
            'обрезка',
            'masonry',
            'мудборд',
            'moodboard',
            'изображение',
        ],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'Grid presets',
                paragraphs: [
                    'A gallery starts by choosing a **preset** — the arrangement of slots on the page: accent grid, panorama with thumbnails, masonry and others. The preset defines slot sizes; the same uploaded image will be framed differently per slot.',
                ],
            },
            {
                heading: 'Uploading and cropping',
                steps: [
                    'Upload images to the gallery slots.',
                    'For each image, open the crop dialog. The cropper shows the exact aspect of the slot, so you can move and zoom the image to decide what part stays visible.',
                    'Save the crop — it is stored per image per slot, so re-arranging the preset keeps your framing.',
                ],
            },
            {
                heading: 'Moving the image inside the slot',
                paragraphs: [
                    'In the moodboard, images can be repositioned after upload: hover the slot and click the **move** icon, drag the image to place the visible fragment, and release — the position is stored as a focal point and applied on the public page in every slot size.',
                ],
            },
            {
                heading: 'Why crop per slot',
                paragraphs: [
                    'Uploading “one size for everything” forces the same framing everywhere, which cuts images unpredictably in different slots. Cropping per slot means every image shows exactly what you want in every position of the grid — including moodboard slides.',
                ],
            },
        ],
    },
    {
        slug: 'publishing-a-case',
        category: 'cases',
        title: 'Publishing and unpublishing a case',
        summary:
            'Publish when the case is ready; unpublish returns it to a draft at any time.',
        keywords: ['publish', 'публикация', 'unpublish', 'draft', 'черновик', 'статус'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'Publishing',
                steps: [
                    'Open the case in the editor and check the preview.',
                    'Use the **Publish** control (in the editor or the cases list).',
                    'The case becomes public: it appears on your page in the cases list and at **/u/{slug}/{case-slug}**, and the home page picks it up.',
                ],
            },
            {
                heading: 'Unpublishing',
                paragraphs: [
                    'The same control lets you take the case back to draft at any time. It disappears from public view immediately, while all content is kept — publishing again restores it exactly as it was.',
                ],
            },
            {
                heading: 'Statuses at a glance',
                table: {
                    headers: ['Status', 'Visible to visitors?', 'Visible to you?'],
                    rows: [
                        ['Draft', 'No', 'Yes — in the editor and your public page with a “draft” notice.'],
                        ['Published', 'Yes', 'Yes'],
                    ],
                },
            },
        ],
    },
    {
        slug: 'managing-invites',
        category: 'studio-admin',
        title: 'Managing invites',
        summary:
            'Create invitation codes, send them by email, and see which ones are used.',
        keywords: ['super-admin', 'invite', 'инвайт', 'коды', 'приглашения', 'admin'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'Who can do this',
                paragraphs: [
                    'The super-admin area is for the studio team only — regular designers do not see it.',
                ],
            },
            {
                heading: 'Creating and sending an invite',
                steps: [
                    'Open **Super-admin → Invites**.',
                    'Create a new invite: the platform generates the 8-character code.',
                    'Enter the recipient email — the invitation email is sent through the platform with the registration link and code included.',
                    'The recipient registers per *Registering your account*; the code stops working after use.',
                ],
            },
            {
                heading: 'Tracking',
                paragraphs: [
                    'The invites list shows the state of every invitation: which codes are still unused and which are taken. If an email did not arrive, a new invite can be generated for the same address.',
                ],
            },
        ],
    },
    {
        slug: 'managing-users-and-projects',
        category: 'studio-admin',
        title: 'Managing users and projects',
        summary:
            'Super-admin sees all accounts and all cases across designers, including drafts.',
        keywords: ['super-admin', 'users', 'пользователи', 'projects', 'кейсы', 'модерация'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'Users',
                paragraphs: [
                    '**Super-admin → Users** lists every account: who is registered, when, and with what public slug. This is where account-level issues are resolved (for example, updating an email address a designer cannot change themselves).',
                ],
            },
            {
                heading: 'Projects',
                paragraphs: [
                    '**Super-admin → Projects** shows cases of all designers, drafts included. This is the moderation view: if a published case needs to be taken down, it can be unpublished here without touching the designer’s account.',
                ],
            },
            {
                heading: 'Privacy responsibility',
                paragraphs: [
                    'Personal data published by designers is their responsibility, with studio oversight — see the Privacy Policy sections on portfolio content and the content complaint channel before acting on any request.',
                ],
            },
        ],
    },
    {
        slug: 'contacting-the-studio',
        category: 'contact-privacy',
        title: 'Contacting the studio',
        summary:
            'Use the on-site contact form or email hello@ux42.studio directly.',
        keywords: ['contact', 'contact form', 'форма', 'hello@', 'email', 'обратная связь', 'support'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'Contact form',
                paragraphs: [
                    'The **Send an email** button on the studio site opens a small form: name, email and message. Messages are delivered to the studio mailbox and answered from the studio email; the reply goes to the address you typed, so double-check it.',
                ],
            },
            {
                heading: 'Direct email',
                paragraphs: [
                    'General questions: **hello@ux42.studio**. Privacy and data requests: **privacy@ux42.studio** (see the Privacy Policy for details).',
                ],
            },
            {
                heading: 'Platform users',
                paragraphs: [
                    'If you are a registered designer with a question about the platform, the same channels work — mention your page address (**/u/{slug}**) so the team can look at the right account.',
                ],
            },
        ],
    },
    {
        slug: 'privacy-and-your-data',
        category: 'contact-privacy',
        title: 'Privacy and your data',
        summary:
            'The short version of what is collected and why; the full policy is at /privacy.',
        keywords: ['privacy', 'GDPR', 'данные', 'cookies', 'analytics', 'приватность'],
        lastUpdated: HELP_LAST_UPDATED,
        sections: [
            {
                heading: 'The essentials',
                bullets: [
                    'Accounts and authentication data are processed to provide the service you signed up for (GDPR Art. 6.1.b).',
                    'Invitation emails are sent only to addresses the studio decided to invite.',
                    'Published portfolio content is the designer’s responsibility, with studio oversight.',
                    'Analytics is cookieless; no advertising or profiling cookies are used.',
                ],
            },
            {
                heading: 'Where the details live',
                paragraphs: [
                    'The full, legally structured policy — controllers, legal bases, retention periods, recipients (including the email provider) and your rights — is published at **/privacy**. The terms of use are at **/terms**.',
                ],
            },
            {
                heading: 'Requests',
                paragraphs: [
                    'Any data-subject request (access, deletion, complaints) goes to **privacy@ux42.studio** and is handled by the studio as described in the policy.',
                ],
            },
        ],
    },
];

// ---------------------------------------------------------------------------
// Helpers — единая точка доступа к реестру для страниц /help и sitemap.
// ---------------------------------------------------------------------------

/** Категория по id (или undefined для неизвестного id). */
export function getHelpCategory(id: string): HelpCategory | undefined {
    return HELP_CATEGORIES.find((c) => c.id === id);
}

/** Статья по slug (или undefined — страница отдаст 404). */
export function getHelpArticle(slug: string): HelpArticle | undefined {
    return HELP_ARTICLES.find((a) => a.slug === slug);
}

/** Статьи категории в порядке реестра. */
export function getHelpArticlesByCategory(categoryId: string): HelpArticle[] {
    return HELP_ARTICLES.filter((a) => a.category === categoryId);
}

/** Категории со статьями — для индекса /help. */
export function getHelpIndex(): { category: HelpCategory; articles: HelpArticle[] }[] {
    return HELP_CATEGORIES.map((category) => ({
        category,
        articles: getHelpArticlesByCategory(category.id),
    })).filter((group) => group.articles.length > 0);
}
