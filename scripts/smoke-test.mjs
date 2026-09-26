#!/usr/bin/env node
/**
 * Smoke-тест сайта ux42studio.
 *
 * Зачем: автоматически проверяет, что после изменения кода сайт
 * по-прежнему работает. Без него поломку замечают только посетители.
 *
 * Запуск (сервер должен быть уже поднят):
 *   node scripts/smoke-test.mjs                          # http://localhost:3000
 *   node scripts/smoke-test.mjs https://ux42.studio      # проверить прод
 *
 * Полная проверка (со страницами дизайнера и кейса):
 *   PROFILE_SLUG=aleksandra-burshtein \
 *   PROJECT_SLUG=clinical-workflow-automation \
 *   node scripts/smoke-test.mjs
 *
 * Итоговый код: 0 — всё в порядке, 1 — есть поломки (удобно для CI).
 * Зависимостей нет — только встроенный fetch из Node 18+.
 */

const BASE_URL = (process.argv[2] || process.env.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const PROFILE_SLUG = process.env.PROFILE_SLUG || '';
const PROJECT_SLUG = process.env.PROJECT_SLUG || '';
const IS_HTTPS = BASE_URL.startsWith('https://');
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 20000);

const results = [];
let currentGroup = '';

function group(title) {
    currentGroup = title;
    console.log(`\n${title}`);
}

async function check(name, fn) {
    try {
        const result = await fn();
        // Деталь показываем только если это осмысленная строка. Иначе в отчёт
        // попадёт «[object Response]» — так было с expectOk, возвращающим
        // объект Response вместо текста.
        const detail = typeof result === 'string' && result.trim() ? result : '';
        results.push({ group: currentGroup, name, ok: true, detail });
        console.log(`  ✅ ${name}${detail ? ` — ${detail}` : ''}`);
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ group: currentGroup, name, ok: false, detail: msg });
        console.log(`  ❌ ${name}`);
        console.log(`       ${msg}`);
    }
}

/** Предупреждение: не поломка, но стоит знать глазами. */
function warn(name, detail) {
    results.push({ group: currentGroup, name, ok: true, detail, warning: true });
    console.log(`  ⚠️  ${name} — ${detail}`);
}

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

async function fetchPath(path, options = {}) {
    // Таймаут обязателен: fetch сам по себе ждёт бесконечно, и при «зависшем»
    // сервере скрипт подвешивал бы терминал навсегда.
    return fetch(BASE_URL + path, {
        redirect: 'manual',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        ...options,
    });
}

async function expectOk(path) {
    const res = await fetchPath(path);
    assert(res.status === 200, `ожидался статус 200, получен ${res.status}`);
    return res;
}

async function expectText(path, needle, label) {
    const res = await expectOk(path);
    const body = await res.text();
    assert(body.includes(needle), `не найдено «${label ?? needle}»`);
    // body намеренно НЕ возвращается: иначе он попадёт в отчёт как
    // «подробность» проверки и засорит вывод целой HTML-страницей.
}


// ── 1. Основные страницы ──
group('1. Основные страницы');

await check('Главная страница открывается', async () => {
    await expectOk('/');
    return '200 OK';
});

await check('Страница входа открывается', () => expectOk('/login'));
await check('Страница регистрации открывается', () => expectOk('/register'));

await check('Язык страницы объявлен как английский', async () => {
    const html = await (await expectOk('/')).text();
    assert(/<html[^>]*\slang=["']en["']/.test(html), 'в теге <html> нет lang="en" (WCAG 3.1.1)');
    return 'lang="en"';
});

await check('Формы входа и регистрации помечены как русские', async () => {
    const html = await (await expectOk('/login')).text();
    assert(/lang=["']ru["']/.test(html), 'нет lang="ru" — скринридер прочитает русский текст английским голосом');
    return 'lang="ru"';
});

if (PROFILE_SLUG) {
    await check(`Страница дизайнера /u/${PROFILE_SLUG}`, () => expectOk(`/u/${PROFILE_SLUG}`));
} else {
    warn('Страница дизайнера', 'не проверена — задайте PROFILE_SLUG=<slug> для полной проверки');
}

if (PROFILE_SLUG && PROJECT_SLUG) {
    await check(`Страница кейса /u/${PROFILE_SLUG}/${PROJECT_SLUG}`, () =>
        expectOk(`/u/${PROFILE_SLUG}/${PROJECT_SLUG}`),
    );
    await check('Короткая версия кейса (для печати/PDF)', () =>
        expectOk(`/u/${PROFILE_SLUG}/${PROJECT_SLUG}/short`),
    );
} else {
    warn('Страница кейса', 'не проверена — задайте PROJECT_SLUG=<slug> для полной проверки');
}

// ── 2. Юридические страницы ──
group('2. Юридические страницы (RGPD / LSSI-CE)');

await check('Privacy Policy открывается', () => expectOk('/privacy'));
await check('В политике есть блок AEPD', () => expectText('/privacy', 'Protección de Datos', 'Agencia Española de Protección de Datos'));
await check('В политике указан email контролёра', () => expectText('/privacy', 'privacy@ux42.studio'));
await check('Legal Notice / Terms открывается', () => expectOk('/terms'));
await check('Есть блок идентификации LSSI Art. 10', () => expectText('/terms', 'LSSI Art. 10'));
await check('В условиях указан домен ux42.studio', () => expectText('/terms', 'ux42.studio'));

// ── 3. Файлы, SEO и PWA ──
group('3. Файлы, SEO и PWA');

for (const [path, label] of [
    ['/robots.txt', 'robots.txt'],
    ['/sitemap.xml', 'sitemap.xml'],
    ['/manifest.webmanifest', 'PWA-манифест'],
    ['/icon.svg', 'иконка сайта'],
    ['/og/og-cover.png', 'обложка для соцсетей'],
    ['/placeholder-project.svg', 'заглушка обложки проекта'],
]) {
    await check(`Файл ${label} отдаётся`, async () => {
        await expectOk(path);
        return `${path} — 200`;
    });
}

await check('robots.txt закрывает админку от поисковиков', async () => {
    const body = await (await expectOk('/robots.txt')).text();
    assert(/disallow:\s*\/admin/i.test(body), 'нет правила Disallow: /admin — приватная зона может попасть в поиск');
    return 'Disallow: /admin';
});

await check('sitemap.xml содержит главную и юридические страницы', async () => {
    const body = await (await expectOk('/sitemap.xml')).text();
    assert(body.includes('<urlset'), 'это не валидный XML карты сайта');
    for (const p of ['/privacy', '/terms']) {
        assert(body.includes(p), `в карте сайта нет ${p}`);
    }
    return 'структура корректна';
});

await check('PWA-манифест содержит имя и цвет темы', async () => {
    const res = await expectOk('/manifest.webmanifest');
    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error('манифест не читается как JSON');
    }
    assert(data.name, 'нет поля name');
    assert(data.theme_color, 'нет поля theme_color');
    return data.name;
});

await check('В футере есть ссылка на Privacy Policy', async () => {
    const body = await (await expectOk('/')).text();
    assert(body.includes('/privacy'), 'нет ссылки на политику в футере (требование RGPD)');
    return 'ссылка есть';
});

// ── 4. Защита ──
group('4. Защита');

for (const header of ['strict-transport-security', 'x-content-type-options', 'referrer-policy', 'x-frame-options']) {
    await check(`Заголовок ${header}`, async () => {
        const res = await expectOk('/');
        const value = res.headers.get(header);
        if (!value) {
            if (header === 'strict-transport-security' && !IS_HTTPS) {
                throw new Error('HSTS настраивается только на https — проверьте прод');
            }
            throw new Error('заголовок отсутствует');
        }
        return value.length > 40 ? value.slice(0, 40) + '…' : value;
    });
}

await check('Версия Next.js не утекает (нет X-Powered-By)', async () => {
    const res = await expectOk('/');
    const value = res.headers.get('x-powered-by');
    assert(!value, `сервер сообщает: ${value}`);
    return 'скрыто';
});

// ── 5. Доступ и приватность ──
group('5. Доступ и приватность');

for (const [path, label] of [['/admin', 'админка'], ['/super-admin', 'суперадминка']]) {
    await check(`Без входа ${label} закрыта`, async () => {
        const res = await fetchPath(path);
        const location = res.headers.get('location') || '';
        const redirected = res.status === 307 || res.status === 302 || res.status === 401;
        assert(
            redirected && location.includes('/login'),
            `ожидался редирект на /login, получено: статус ${res.status}, переход на «${location || '—'}»`,
        );
        return 'редирект на /login';
    });
}

await check('Приватные страницы не просят индексации', async () => {
    const html = await (await expectOk('/login')).text();
    assert(/noindex/i.test(html), 'нет noindex — поисковик может проиндексировать страницу входа');
    return 'noindex';
});

await check('Форма регистрации предупреждает об обработке данных', async () => {
    const html = await (await expectOk('/register')).text();
    assert(/\/privacy/.test(html), 'нет уведомления о privacy рядом с формой (нарушение RGPD Art. 13)');
    return 'уведомление есть';
});

await check('База данных и хранилище отвечают', async () => {

// ── Итог ──
const failed = results.filter((r) => !r.ok);
const warned = results.filter((r) => r.warning);

console.log(`\n${'─'.repeat(58)}`);
console.log(
    `Проверено: ${results.length}   успешно: ${results.length - failed.length}` +
        (warned.length ? `   с предупреждениями: ${warned.length}` : ''),
);
console.log(`Адрес: ${BASE_URL}`);

if (failed.length === 0) {
    console.log('\n✅ Сайт в порядке — можно деплоить.\n');
    process.exit(0);
}

console.log(`\n❌ Найдено проблем: ${failed.length}\n`);

// Подробности каждой проблемы уже напечатаны в месте обнаружения,
// поэтому здесь — только список имён, сгруппированный по разделам.
const byGroup = new Map();
for (const f of failed) {
    if (!byGroup.has(f.group)) byGroup.set(f.group, []);
    byGroup.get(f.group).push(f.name);
}
for (const [g, names] of byGroup) {
    console.log(`  ${g}`);
    for (const n of names) console.log(`    • ${n}`);
}
console.log('');
process.exit(1);

    const res = await fetch(`${BASE_URL}/api/health`, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const data = await res.json().catch(() => ({}));
    assert(
        res.status === 200 && data.status === 'ok',
        `статус ${res.status}, состояние «${data.status || 'неизвестно'}»` +
            (data.checks?.d1?.message ? ` (D1: ${data.checks.d1.message})` : '') +
            (data.checks?.r2?.message ? ` (R2: ${data.checks.r2.message})` : ''),
    );
    return 'D1 и R2 доступны';
});
