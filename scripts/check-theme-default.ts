/**
 * Проверка дефолта движка темы: профиль без явного engine в JSON
 * должен получать Chroma42 (D-019), а явный 'm3' — сохраняться.
 *
 * Запуск: npx tsx scripts/check-theme-default.ts
 */
import {
    DEFAULT_MAIN_PAGE_CONTENT,
    DEFAULT_THEME_ENGINE,
    normalizeMainPageContent,
} from '../src/lib/mainPageContent';

const noEngine = normalizeMainPageContent(
    { theme: { useCustomTheme: true, seedColor: '#0b6e4f' } },
    [],
);
const m3Engine = normalizeMainPageContent(
    { theme: { useCustomTheme: true, seedColor: '#0b6e4f', engine: 'm3' } },
    [],
);
const empty = normalizeMainPageContent(null, []);

console.log('дефолт платформы:', DEFAULT_THEME_ENGINE);
console.log('профиль без engine →', noEngine.theme.engine);
console.log('профиль с engine=m3 →', m3Engine.theme.engine);
console.log('пустой профиль →', empty.theme.engine);

const ok =
    noEngine.theme.engine === 'chroma42' &&
    m3Engine.theme.engine === 'm3' &&
    empty.theme.engine === 'chroma42';
console.log(ok ? 'Дефолты корректны ✅' : 'ДЕФОЛТЫ НЕВЕРНЫ ❌');
if (!ok) process.exitCode = 1;
