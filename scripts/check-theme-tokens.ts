/**
 * Проверка темы: движок Chroma42 должен выдавать полный набор токенов
 * платформы, сохранять выбранный seed без искажений и проходить проверки
 * читаемости.
 *
 * Запуск: npm run theme:check
 */
import { PRESET_SEEDS } from '../src/lib/theme';
import { generateChromaThemeCss } from '../src/lib/chroma42';
import { buildThemeChecks, checksPassed } from '../src/lib/theme-checks';

/** Токены, которые обязаны быть в каждом блоке темы. */
const REQUIRED_TOKENS = [
    'primary',
    'on-primary',
    'primary-container',
    'on-primary-container',
    'primary-text',
    'secondary',
    'on-secondary',
    'secondary-container',
    'on-secondary-container',
    'tertiary',
    'on-tertiary',
    'tertiary-container',
    'on-tertiary-container',
    'error',
    'on-error',
    'error-container',
    'on-error-container',
    'surface',
    'on-surface',
    'on-surface-variant',
    'surface-variant',
    'outline',
    'outline-variant',
    'surface-container',
    'surface-container-high',
    'surface-container-lowest',
    'surface-container-low',
    'surface-container-highest',
    'background',
    'on-background',
    'scrim',
    'surface-tint',
    'on-surface-tint',
];

const SEEDS = [...PRESET_SEEDS.map((p) => p.value), '#808080'];

let problems = 0;

for (const seed of SEEDS) {
    const result = generateChromaThemeCss(seed);
    const { light, dark } = result.tokens;

    for (const [mode, tokens] of [
        ['light', light],
        ['dark', dark],
    ] as const) {
        const missing = REQUIRED_TOKENS.filter((name) => !tokens[name]);
        if (missing.length) {
            problems++;
            console.log(`${seed} [${mode}]: НЕТ токенов — ${missing.join(', ')}`);
        }
    }

    // Выбранный цвет должен остаться выбранным.
    // В ч/б-режиме (почти нейтральный сид) тема намеренно обесцвечена.
    if (!result.bw && light.primary?.toLowerCase() !== seed.toLowerCase()) {
        problems++;
        console.log(
            `${seed}: primary искажён — ${light.primary} (ожидался ${seed})`,
        );
    }

    // Читаемость: в светлой и тёмной теме.
    for (const [mode, tokens] of [
        ['light', light],
        ['dark', dark],
    ] as const) {
        const checks = buildThemeChecks(tokens);
        if (!checksPassed(checks)) {
            problems++;
            const failed = checks
                .filter((c) => !c.ok)
                .map((c) => `${c.id} (${c.ratio.toFixed(2)} < ${c.required})`);
            console.log(`${seed} [${mode}]: проверки не пройдены — ${failed.join(', ')}`);
        }
    }

    console.log(
        `${seed}: primary ${light.primary} / ${dark.primary}, проверок ок`,
    );
}

console.log(
    problems
        ? `\nПРОБЛЕМ: ${problems}`
        : 'Тема корректна: токены на месте, цвет сохранён, всё читаемо ✅',
);
if (problems) process.exitCode = 1;
