/**
 * Обходной путь для Windows: `fs.cpSync()` и `fs.rmSync()` не работают, если
 * путь содержит не-ASCII символы (кириллица в имени папки, например
 * `D:\Хранилище\Projects\...`).
 *
 * Проверено на Node v22.23.3 и v24.13.0. Для каждой операции прогонялся набор
 * тестов (mkdir / write / read / readdir / stat / copyFile / rename / unlink /
 * cpSync / rmSync) в ASCII-пути и в пути с кириллицей:
 *
 *   - работают везде: mkdirSync, writeFileSync, readFileSync, readdirSync,
 *     statSync/lstatSync, copyFileSync, renameSync, unlinkSync;
 *   - **ломаются**: `cpSync(src, dest, {recursive: true})` завершается без
 *     ошибки, но не копирует ни одного файла, а `rmSync()` не удаляет ни файла,
 *     ни каталога (тоже без ошибки).
 *
 * То есть страдают только рекурсивные операции: нативный код обходит дерево
 * по ASCII-версии пути и молча ничего не находит.
 *
 * Последствия для OpenNext:
 *   - `initOutputDir()` (@opennextjs/aws/dist/build/helper.js) копирует
 *     скомпилированный `open-next.config.*.mjs` из временной папки в
 *     `.open-next/.build` через `cpSync` — сборка падала с ENOENT;
 *   - `createAssets()` через `cpSync` молча терял бы `.next/static` и `public`
 *     (ассеты просто не попали бы в воркер);
 *   - `initOutputDir()` через `rmSync` не очищал `.open-next`, а
 *     `compileEnvFiles()` дописывает блоки в `next-env.mjs` через
 *     `appendFileSync` — накапливались дубли `export const production`, и бандл
 *     переставал собираться («The symbol "test" has already been declared»).
 *
 * Модуль подключается ДО запуска OpenNext — см. `build-cloudflare.mjs`
 * (или вручную: `node -r ./scripts/cp-sync-polyfill.cjs ...`).
 *
 * Патчатся и `fs.cpSync` / `fs.rmSync`, и именованные импорты из `node:fs`
 * (через `module.syncBuiltinESMExports()` — OpenNext импортирует `{ cpSync }`
 * именно так в `copyTracedFiles.js`).
 *
 * ASCII-пути передаются нативной реализации: патч вмешивается только там, где
 * нативный код реально ломается.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { syncBuiltinESMExports } = require('node:module');

const PATCHED = Symbol.for('ux42studio.cpSyncPolyfill');

/** Путь безопасен для нативных рекурсивных операций? */
function isAsciiSafe(value) {
    // eslint-disable-next-line no-control-regex
    return !/[^\x00-\x7F]/.test(value);
}

/**
 * Рекурсивная замена fs.cpSync: mkdir + copyFileSync вместо системного вызова.
 * Поддерживает подмножество опций, которое использует OpenNext:
 * `recursive`, `force`, `dereference`, `filter`, `errorOnExist`.
 */
function cpSyncCompat(src, dest, options = {}) {
    const {
        filter,
        force = true,
        dereference = false,
        errorOnExist = false,
    } = options;

    const stat = dereference ? fs.statSync(src) : fs.lstatSync(src);

    if (typeof filter === 'function' && !filter(src, dest)) {
        return;
    }

    if (stat.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const entry of fs.readdirSync(src)) {
            cpSyncCompat(path.join(src, entry), path.join(dest, entry), options);
        }
        return;
    }

    if (stat.isSymbolicLink()) {
        const target = fs.readlinkSync(src);
        try {
            fs.unlinkSync(dest);
        } catch {
            /* destination does not exist */
        }
        let isDir = true;
        try {
            isDir = fs.statSync(path.resolve(path.dirname(src), target)).isDirectory();
        } catch {
            isDir = false;
        }
        try {
            fs.symlinkSync(target, dest, isDir ? 'junction' : 'file');
            return;
        } catch {
            // Нет прав на создание ссылок — копируем содержимое цели.
            const resolved = path.resolve(path.dirname(src), target);
            if (fs.statSync(resolved).isDirectory()) {
                cpSyncCompat(resolved, dest, { ...options, dereference: true });
                return;
            }
        }
    }

    if (fs.existsSync(dest) && !force) {
        if (errorOnExist) {
            throw new Error(`EEXIST: file already exists: ${dest}`);
        }
        return;
    }

    fs.copyFileSync(src, dest);
}

/**
 * Рекурсивная замена fs.rmSync: unlinkSync / rmdirSync + обход readdirSync.
 * Нативный rmSync по не-ASCII путям не удаляет ничего и не падает —
 * ровно та же поломка, что и у cpSync.
 */
function rmSyncCompat(target, options = {}) {
    const {
        recursive = false,
        force = false,
        // Свои значения по умолчанию вместо нативных `maxRetries: 0`.
        // OpenNext чистит выходную папку `.open-next`, которую на Windows
        // на секунду может придержать антивирус, поисковый индексатор или
        // файловый вотчер — падает EBUSY. Нативный rmSync такие случаи
        // переживает за счёт повторов с паузой, а здесь повторов не было
        // вовсе: цикл при maxRetries = 0 выполнялся ровно один раз.
        maxRetries = 3,
        retryDelay = 100,
    } = options;

    let stat;
    try {
        stat = fs.lstatSync(target);
    } catch (err) {
        // ENOENT: force — молчаливый успех, иначе пробрасываем как нативный rm.
        if (err.code === 'ENOENT' && force) return;
        throw err;
    }

    if (stat.isDirectory() && !stat.isSymbolicLink()) {
        if (!recursive) {
            const err = new Error(
                `EISDIR: illegal operation on a directory, rmSync '${target}'`,
            );
            err.code = 'EISDIR';
            err.syscall = 'rmdir';
            throw err;
        }

        // EBUSY на пустом каталоге под Windows: процесс (или его cwd)
        // держит сам узел. Вариант: переименовать каталог в сторону и
        // удалить уже по новому имени — переименование занятого каталога
        // на NTFS обычно работает, а rmdir занятого — нет.
        // Важно: переименование делаем ДО любых рекурсивных обходов —
        // путь target после rename может указывать уже не туда.
        {
            const tmpName = `${target}.rm-${process.pid}-${Date.now()}`;
            let renamed = false;
            try {
                fs.renameSync(target, tmpName);
                renamed = true;
            } catch {
                // Переименовать не вышло (непустой? чужая блокировка?) —
                // работаем по исходному пути обычным путём.
            }
            if (renamed) {
                const entries = fs.readdirSync(tmpName);
                for (const entry of entries) {
                    rmSyncCompat(path.join(tmpName, entry), options);
                }
                // NTFS-нюанс: узел может оказаться «файлом-джанкшном» —
                // lstat говорит «каталог», но readdir вернул пустоту, а rmdir
                // упорно отвечает EBUSY/unlink. Проверяем содержимое по
                // факту: если узел читается как пустой — чистим unlink-веткой
                // с повторами и выходим, не трогая rmdir.
                let drained = false;
                for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
                    const rest = fs.readdirSync(tmpName);
                    if (rest.length === 0) {
                        drained = true;
                        break;
                    }
                    if (attempt < maxRetries && retryDelay > 0) {
                        sleepSync(retryDelay);
                    }
                }
                if (drained) {
                    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
                        try {
                            fs.rmdirSync(tmpName);
                            return;
                        } catch (err) {
                            if (err.code === 'ENOENT') return;
                            if (
                                err.code === 'EBUSY' ||
                                err.code === 'ENOTEMPTY' ||
                                err.code === 'EPERM'
                            ) {
                                break; // ниже — unlink-ветка
                            }
                            if (attempt < maxRetries && retryDelay > 0) {
                                sleepSync(retryDelay);
                            } else if (attempt >= maxRetries) {
                                break;
                            }
                        }
                    }
                    // rmdir не берёт пустой узел (живой дескриптор) —
                    // пробуем unlink с повторами: в NTFS это иногда снимает
                    // «файловую» блокировку узла.
                    for (
                        let attempt = 0;
                        attempt <= maxRetries;
                        attempt += 1
                    ) {
                        try {
                            fs.unlinkSync(tmpName);
                            return;
                        } catch (err) {
                            if (err.code === 'ENOENT') return;
                            if (attempt < maxRetries && retryDelay > 0) {
                                sleepSync(retryDelay);
                            }
                        }
                    }
                } else if (maxRetries > 0 && retryDelay > 0) {
                    sleepSync(retryDelay);
                }
                // Даже если узел так и не ушёл — он уже пустой и лежит
                // в стороне; OpenNext дальше пересоздаст структуру.
                // Падать с EBUSY и ронять всю сборку из-за мусора — хуже.
                return;
            }
        }

        for (const entry of fs.readdirSync(target)) {
            rmSyncCompat(path.join(target, entry), options);
        }

        // Каталог может быть занят другим процессом (например, антивирусом) —
        // повторяем, как это делает нативный rmSync на Windows. Пауза между
        // попытками обязательна: мгновенный повтор ловит тот же EBUSY.
        // NTFS-нюанс: пустой каталог с живым дескриптором (антивирус/вотчер
        // дочитывает файлы) не удаляется через rmdir — возвращает EBUSY или
        // ENOTEMPTY, хотя readdir показывает пустоту. В этом случае просто
        // пробуем дальше: rmdir всегда последним, без досрочного успеха.
        let lastError;
        for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
            try {
                fs.rmdirSync(target);
                return;
            } catch (err) {
                if (err.code === 'ENOENT') return;
                lastError = err;
                if (attempt < maxRetries && retryDelay > 0) {
                    sleepSync(retryDelay);
                }
            }
        }
        // Пробуем rmdir напоследок: если каталог реально пуст, но rmdir
        // всё ещё упирается в живой дескриптор — это не повод ронять сборку.
        // OpenNext пересоздаст структуру сам. Финальный rmdir делаем только
        // если в каталоге действительно пусто. Непустой → пробрасываем ошибку.
        try {
            if (fs.readdirSync(target).length > 0) throw lastError;
        } catch (err) {
            // readdir упал с ENOENT — каталога уже нет, это успех.
            if (err && err.code === 'ENOENT') return;
            if (err === lastError) throw lastError;
            return;
        }
        // Пусто: последняя попытка rmdir, ошибку EBUSY/ENOTEMPTY глушим.
        try {
            fs.rmdirSync(target);
        } catch (err) {
            if (err.code !== 'EBUSY' && err.code !== 'ENOTEMPTY') throw err;
        }
    }

    fs.unlinkSync(target);
}

/** Синхронная пауза — чтобы не тянуть в polyfill async-обёртку. */
function sleepSync(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

if (!fs[PATCHED]) {
    const nativeCpSync = fs.cpSync.bind(fs);
    const nativeRmSync = fs.rmSync.bind(fs);

    fs.cpSync = function cpSyncWithNonAsciiSupport(src, dest, options) {
        if (isAsciiSafe(String(src)) && isAsciiSafe(String(dest))) {
            return nativeCpSync(src, dest, options);
        }
        return cpSyncCompat(src, dest, options);
    };

    fs.rmSync = function rmSyncWithNonAsciiSupport(target, options) {
        const opts = typeof options === 'string' ? { force: true } : options;
        if (isAsciiSafe(String(target))) {
            return nativeRmSync(target, options);
        }
        return rmSyncCompat(target, opts);
    };

    // Именованные импорты `import { cpSync } from 'node:fs'` берут снимок
    // экспортов; без syncBuiltinESMExports() они остались бы нативными.
    syncBuiltinESMExports();

    fs[PATCHED] = true;
}

module.exports = { cpSyncCompat, rmSyncCompat };
