/**
 * Обёртка над `opennextjs-cloudflare` для деплоя с Windows.
 *
 * Решает две проблемы, из-за которых `npm run deploy` не работал:
 *
 * 1. **`fs.cpSync` не копирует файлы по путям с не-ASCII символами**
 *    (кириллица в имени папки, например `D:\Хранилище\Projects\...`).
 *    Сборка падала с `ENOENT` на `.open-next/.build/open-next.config.edge.mjs`,
 *    а ассеты (`.next/static`, `public`) молча терялись. Лечится патчем
 *    `fs.cpSync` — см. `cp-sync-polyfill.cjs`.
 *
 * 2. **Локальные env-файлы попадают в бандл воркера.**
 *    `@opennextjs/cloudflare` вызывает `extractProjectEnvVars()`
 *    (`dist/cli/utils/extract-project-env-vars.js`), который читает `.env`,
 *    `.env.{mode}`, `.env.local` и `.env.{mode}.local` и пишет их значения в
 *    `.open-next/cloudflare/next-env.mjs` — оттуда они попадают в задеплоенный
 *    воркер. В `.env.local` лежат `CLOUDFLARE_D1_TOKEN` и `JWT_SECRET`, то
 *    есть секреты, которые не должны туда попасть никогда.
 *    Поэтому перед сборкой файлы временно убираются, а после сборки
 *    возвращаются на место (в том числе по `process.on('exit')` — если CLI
 *    завершится через `process.exit`, `finally` не отработает).
 *
 *    Секреты в воркере задаются через `wrangler secret put` (см. Docs/DEPLOY.md),
 *    несекретные — через `[vars]` в `wrangler.toml`.
 *
 * Дополнительно: `compileEnvFiles()` в OpenNext 1.17.1 делает `appendFileSync`
 * в `next-env.mjs` без предварительной очистки, поэтому повторные сборки
 * накапливают дубли `export const production` и бандл перестаёт собираться
 * («The symbol "test" has already been declared»). Здесь файл удаляется
 * перед каждой сборкой.
 *
 * Использование:
 *     node scripts/build-cloudflare.mjs build     # сборка
 *     node scripts/build-cloudflare.mjs deploy    # публикация
 *     node scripts/build-cloudflare.mjs preview
 *     node scripts/build-cloudflare.mjs build --with-env   # НЕ для прода
 *
 * `--with-env` оставляет env-файлы на месте — только для локальной отладки.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

const projectRoot = process.cwd();
const args = process.argv.slice(2);
const withEnv = args.includes('--with-env');
const cliArgs = args.filter((arg) => arg !== '--with-env');

const CLI_PATH = path.join(
    projectRoot,
    'node_modules',
    '@opennextjs',
    'cloudflare',
    'dist',
    'cli',
    'index.js',
);

// Читаются extractProjectEnvVars() и уходят в бандл воркера.
const ENV_FILES = [
    '.env',
    '.env.local',
    '.env.production',
    '.env.production.local',
];

/** Куда OpenNext пишет распакованные переменные (дописывает, без очистки). */
const NEXT_ENV_OUTPUT = path.join(
    projectRoot,
    '.open-next',
    'cloudflare',
    'next-env.mjs',
);

const stashed = [];

/** Возвращает env-файлы на место. Идемпотентна — вызывается и в finally, и в process.on('exit'). */
function restoreEnvFiles() {
    while (stashed.length > 0) {
        const [original, backup] = stashed.pop();
        if (fs.existsSync(backup)) {
            fs.renameSync(backup, original);
        }
    }
}

const isBuild = cliArgs[0] === 'build';

// Прячем env-файлы ТОЛЬКО на фазе build. На фазе deploy прятать нельзя:
// из `.env.local` wrangler берёт CLOUDFLARE_ACCOUNT_ID, и без него
// публикация уходит в личный аккаунт вместо аккаунта с воркером
// ("Could not route to /client/v4/accounts/<личный>/workers/services/ux42next,
// code 7003"). Секреты на deploy не попадают в бандл — бандл уже собран
// фазой build, где env-файлы спрятаны.
if (!withEnv && isBuild) {
    for (const name of ENV_FILES) {
        const original = path.join(projectRoot, name);
        if (fs.existsSync(original)) {
            const backup = `${original}.deploy-stash`;
            fs.renameSync(original, backup);
            stashed.push([original, backup]);
        }
    }
    if (stashed.length > 0) {
        console.log(
            `[ux42] Скрыты на время сборки (секреты не попадут в бандл): ${stashed
                .map(([original]) => path.basename(original))
                .join(', ')}`,
        );
    }
}

// 1. Патч fs.cpSync для путей с кириллицей — до импорта CLI.
require('./cp-sync-polyfill.cjs');

// 2. Чистка next-env.mjs: OpenNext дописывает в него блоки при каждой сборке.
//    Только для `build` — фазе `deploy` этот файл нужен готовым (его импортирует
//    .open-next/cloudflare/init.js), и генерируется он именно при сборке.
if (isBuild) {
    fs.rmSync(NEXT_ENV_OUTPUT, { force: true });
}

// 2a. Предочистка .open-next: OpenNext начинает build с rmSync всего
//    выходного каталога, который на Windows стабильно падает с EBUSY —
//    каталог держит сам процесс (cwd) или индексатор/антивирус, и пустой
//    узел не удаляется даже после рекурсивной очистки содержимого.
//    Чистим здесь заранее нативным rmSync с повторами: в этот момент
//    OpenNext ещё не стартовал, и каталог, как правило, свободен.
//    Если не вышло — не роняем: OpenNext попробует сам (у него свой
//    полифилл и ретраи), а при его падении соберём вывод из лога.
if (isBuild) {
    const openNextDir = path.join(projectRoot, '.open-next');
    for (let attempt = 0; attempt < 4; attempt += 1) {
        try {
            fs.rmSync(openNextDir, { recursive: true, force: true });
            break;
        } catch (err) {
            if (err.code === 'ENOENT') break;
            if (attempt === 3) {
                console.warn(
                    `[ux42] не удалось пред-очистить .open-next (${err.code}), продолжает OpenNext`,
                );
            } else {
                Atomics.wait(
                    new Int32Array(new SharedArrayBuffer(4)),
                    0,
                    0,
                    500,
                );
            }
        }
    }
}

process.on('exit', restoreEnvFiles);

try {
    // CLI читает process.argv.slice(2) — подставляем путь к реальному entry.
    process.argv = [process.argv[0], CLI_PATH, ...cliArgs];
    await import(pathToFileURL(CLI_PATH).href);
} finally {
    restoreEnvFiles();
}
