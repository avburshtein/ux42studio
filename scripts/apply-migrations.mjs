import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_NAME = 'ux42-portfolio-db';
const DRIZZLE_DIR = path.resolve(__dirname, '..', 'drizzle');
const SEED_FILE = path.join(DRIZZLE_DIR, 'seed.sql');
const DEV_VARS_FILE = path.resolve(__dirname, '..', '.dev.vars');

const SALT_SIZE = 16;
const ITERATIONS = 100000;
const KEY_LEN = 32;

// ─── Аргументы командной строки ────────────────────────────────────────────
const args = process.argv.slice(2);
const isRemote = args.includes('--remote');
const isLocal = args.includes('--local') || !isRemote; // --local по умолчанию
const migrationsOnly = args.includes('--migrations-only');
const seedOnly = args.includes('--seed-only');
const runMigrations = !seedOnly;
const runSeed = !migrationsOnly;

const ENV_FLAG = isRemote ? '--remote' : '--local';
const ENV_LABEL = isRemote ? '☁️  remote' : '💻 local';

/**
 * Хеширует пароль через PBKDF2 (SHA-256), идентично src/lib/crypto.ts
 * Формат: salt_hex:hash_hex
 */
function hashPasswordSync(password) {
    const salt = crypto.randomBytes(SALT_SIZE);
    const hash = crypto.pbkdf2Sync(
        password,
        salt,
        ITERATIONS,
        KEY_LEN,
        'sha256',
    );
    return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

/**
 * Читает .dev.vars и возвращает объект с переменными
 */
function readDevVars() {
    if (!fs.existsSync(DEV_VARS_FILE)) {
        console.error('❌ .dev.vars file not found');
        process.exit(1);
    }
    const vars = {};
    const content = fs.readFileSync(DEV_VARS_FILE, 'utf-8');
    for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        let value = trimmed.slice(eqIdx + 1).trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        vars[key] = value;
    }
    return vars;
}

/**
 * Получает admin-credentials в зависимости от окружения:
 * - local: из .dev.vars
 * - remote: из process.env (секреты wrangler / dashboard)
 *   с fallback на .dev.vars (с предупреждением)
 */
function getAdminCredentials() {
    if (isRemote) {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (email && password) {
            return { email, password };
        }
        // Fallback на .dev.vars для remote (с предупреждением)
        console.warn(
            '⚠️  ADMIN_EMAIL/ADMIN_PASSWORD not found in environment.',
        );
        console.warn(
            '   Falling back to .dev.vars (not recommended for production).',
        );
        const devVars = readDevVars();
        return {
            email: devVars.ADMIN_EMAIL,
            password: devVars.ADMIN_PASSWORD,
        };
    }
    // local: всегда из .dev.vars
    const devVars = readDevVars();
    return {
        email: devVars.ADMIN_EMAIL,
        password: devVars.ADMIN_PASSWORD,
    };
}

/**
 * Подставляет плейсхолдеры в seed.sql и возвращает итоговый SQL
 */
function prepareSeedSql() {
    const { email: adminEmail, password: adminPassword } =
        getAdminCredentials();

    if (!adminEmail || !adminPassword) {
        console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set.');
        if (isRemote) {
            console.error(
                '   For remote: use `wrangler secret put ADMIN_EMAIL` etc.',
            );
        } else {
            console.error('   For local: set them in .dev.vars');
        }
        process.exit(1);
    }

    const adminId = crypto.randomUUID();
    const passwordHash = hashPasswordSync(adminPassword);

    console.log(`   Admin ID: ${adminId}`);
    console.log(`   Admin Email: ${adminEmail}`);

    let sql = fs.readFileSync(SEED_FILE, 'utf-8');
    sql = sql.replaceAll('{{ADMIN_ID}}', adminId);
    sql = sql.replaceAll('{{ADMIN_EMAIL}}', adminEmail);
    sql = sql.replaceAll('{{ADMIN_PASSWORD_HASH}}', passwordHash);

    return sql;
}

function getMigrationDirs() {
    return fs
        .readdirSync(DRIZZLE_DIR, { withFileTypes: true })
        .filter(
            (dirent) => dirent.isDirectory() && /^\d{14}_/.test(dirent.name),
        )
        .map((dirent) => dirent.name)
        .sort();
}

function runWrangler(filePath, label) {
    const cmd = `npx wrangler d1 execute ${DB_NAME} ${ENV_FLAG} --file="${filePath}"`;
    console.log(`\n📦 ${label}: ${path.basename(filePath)}`);
    console.log(`   ${cmd}`);
    try {
        const output = execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' });
        console.log(output.trim());
        return true;
    } catch (err) {
        console.error(`❌ Failed: ${err.message}`);
        if (err.stdout) console.error(err.stdout.toString());
        if (err.stderr) console.error(err.stderr.toString());
        return false;
    }
}

function main() {
    console.log(`🚀 Applying D1 migrations and seed to ${ENV_LABEL}...\n`);

    // ── Миграции ──────────────────────────────────────────────────────────
    if (runMigrations) {
        const migrationDirs = getMigrationDirs();

        if (migrationDirs.length === 0) {
            console.log('⚠️  No migration directories found.');
        } else {
            console.log(`Found ${migrationDirs.length} migration(s):`);
            migrationDirs.forEach((dir) => console.log(`   - ${dir}`));

            for (const dir of migrationDirs) {
                const sqlFile = path.join(DRIZZLE_DIR, dir, 'migration.sql');
                if (!fs.existsSync(sqlFile)) {
                    console.log(`⚠️  Skipping ${dir}: no migration.sql found`);
                    continue;
                }
                if (!runWrangler(sqlFile, 'Migration')) {
                    console.error(`\n🛑 Stopping due to error in ${dir}`);
                    process.exit(1);
                }
            }
        }
    }

    // ── Seed ──────────────────────────────────────────────────────────────
    if (runSeed) {
        if (fs.existsSync(SEED_FILE)) {
            console.log('\n🌱 Preparing seed with admin credentials...');
            const seedSql = prepareSeedSql();
            const tmpFile = path.join(DRIZZLE_DIR, '.seed-tmp.sql');
            fs.writeFileSync(tmpFile, seedSql, 'utf-8');

            const ok = runWrangler(tmpFile, 'Seed');
            fs.unlinkSync(tmpFile);

            if (!ok) {
                console.error('\n🛑 Stopping due to seed error');
                process.exit(1);
            }
        } else {
            console.log('⚠️  No seed.sql found, skipping seed.');
        }
    }

    console.log(
        `\n✅ All migrations and seed applied successfully to ${ENV_LABEL}!`,
    );
}

main();
