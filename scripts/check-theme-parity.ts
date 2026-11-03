/**
 * Проверка бесшовности переключения движка темы.
 *
 * M3 и Chroma42 должны отдавать ОДИН И ТОТ ЖЕ набор CSS-переменных
 * `--md-sys-color-*` в каждом блоке (`:root` и `[data-theme=dark]`).
 * Если наборы разойдутся — часть компонентов останется без цвета
 * при переключении движка.
 *
 * Запуск: npm run theme:parity
 */
import { generateThemeCss, PRESET_SEEDS } from '../src/lib/theme';
import { generateChromaThemeCss } from '../src/lib/chroma42';

function tokensOf(css: string, selector: string): Set<string> {
    const out = new Set<string>();
    const start = css.indexOf(selector + ' {');
    if (start === -1) return out;
    const body = css.slice(start + selector.length + 2, css.indexOf('}', start));
    const re = /(--[\w-]+):\s*(#[0-9a-fA-F]{3,8})/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(body))) out.add(m[1]);
    return out;
}

const SEEDS = [...PRESET_SEEDS.map((p) => p.value), '#808080', '#777777'];
const BLOCKS = [':root', '[data-theme=dark]'];

let problems = 0;
for (const seed of SEEDS) {
    const m3css = generateThemeCss(seed);
    const c42css = generateChromaThemeCss(seed).css;
    for (const block of BLOCKS) {
        const m3 = tokensOf(m3css, block);
        const c42 = tokensOf(c42css, block);
        const missing = [...m3].filter((t) => !c42.has(t));
        const extra = [...c42].filter((t) => !m3.has(t));
        if (missing.length || extra.length) {
            problems++;
            console.log(
                `seed ${seed} [${block}]: M3 ${m3.size} / C42 ${c42.size}`,
            );
            if (missing.length) console.log('  ОТСУТСТВУЮТ:', missing.join(', '));
            if (extra.length) console.log('  лишние:', extra.join(', '));
        }
    }
}
console.log(
    problems
        ? `\nПРОБЛЕМ: ${problems}`
        : 'Наборы токенов совпадают в каждом блоке ✅',
);

// Ч/б режим: почти нейтральный сид → тема без цвета.
const bw = generateChromaThemeCss('#808080');
const bwLight = tokensOf(bw.css, ':root');
const bwDark = tokensOf(bw.css, '[data-theme=dark]');
console.log('Ч/б режим:', bw.bw ? 'распознан ✅' : 'НЕ распознан ❌');
console.log(
    '  токены в обоих блоках:',
    bwLight.size === bwDark.size && bwLight.size > 0 ? 'ok ✅' : 'ПРОБЛЕМА ❌',
);

if (problems || !bw.bw) {
    process.exitCode = 1;
}
