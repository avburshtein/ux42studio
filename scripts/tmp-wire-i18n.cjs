// Временный скрипт вживления i18n в компоненты этапа 2 (D-012).
// Идемпотентен: файлы с уже вставленным useAdminLang пропускаются.
// Запуск: cmd //c "node scripts\tmp-wire-i18n.cjs"
const fs = require('fs');

const results = [];

function wire(file, opts) {
    let s;
    try {
        s = fs.readFileSync(file, 'utf8');
    } catch (e) {
        results.push(`SKIP(readonly) ${file}: ${e.message.slice(0, 50)}`);
        return;
    }
    if (s.includes('useAdminLang')) {
        results.push(`SKIP(already) ${file}`);
        return;
    }
    // 1. import после 'use client';
    if (opts.noClient) {
        s = `import { useAdminLang } from '@/components/admin/AdminLang';\n\n${s}`;
    } else {
        s = s.replace(
            "'use client';",
            "'use client';\n\nimport { useAdminLang } from '@/components/admin/AdminLang';",
        );
    }
    // 2. hook в компоненты (якорь: конец сигнатуры export default/function X(...) {)
    let hookCount = 0;
    for (const sig of opts.hooks || []) {
        const re = new RegExp(
            `(function ${sig}\\([^)]*[\\s\\S]*?\\)\\s*\\{)`,
        );
        if (re.test(s)) {
            s = s.replace(
                re,
                `$1\n    const { t } = useAdminLang();`,
            );
            hookCount += 1;
        }
    }
    if (!opts.hooks || opts.hooks.length === 0) {
        // простая сигнатура в одну строку
        const re = /(export default function \w+\([^)]*\) \{)/;
        if (re.test(s)) {
            s = s.replace(re, `$1\n    const { t } = useAdminLang();`);
            hookCount += 1;
        }
    }
    // 3. замены строк
    let miss = [];
    for (const [from, to] of opts.reps) {
        if (!s.includes(from)) {
            miss.push(from.slice(0, 60));
            continue;
        }
        s = s.split(from).join(to);
    }
    fs.writeFileSync(file, s);
    results.push(
        `OK ${file} hooks=${hookCount} missed=${miss.length}${
            miss.length ? ' :: ' + miss.join(' | ') : ''
        }`,
    );
}

const HOOK_WIZARD = ['useRouter();'];
void HOOK_WIZARD;

// === Шаги визарда: общий набор ===
const wizardReps = (extra = []) => [
    ['Заголовок секции (необязательно)', "{t('wizard.sectionTitleOpt')}"],
    [
        'Формат: перенос строки — новый абзац, [текст](ссылка)\n                        — ссылка, **жирный**, *курсив*, - элемент списка.',
        "{t('wizard.fmtHint')}",
    ],
    [
        'Переносы сохраняются; «- » — список с зелёным\n                            маркером; [текст](ссылка) — ссылка; **жирный**,\n                            *курсив*.',
        "{t('wizard.listHint')}",
    ],
    [
        'Формат: [текст](ссылка) — ссылка, **жирный**,\n                            *курсив*, переносы — новые абзацы.',
        "{t('wizard.fmtHintShort')}",
    ],
    ...extra,
];

const EDIT = 'src/app/admin/projects/[id]/edit';

wire(`${EDIT}/problem/page.tsx`, {
    reps: [
        [
            'Форматирование: переносы строк сохраняются, строка с «- » —\n                элемент списка с зелёным маркером, **жирный**, *курсив*.',
            "{t('wizard.problemFmtHint')}",
        ],
        ...wizardReps(),
    ],
    hookAfter: 'const router = useRouter();',
});

wire(`${EDIT}/research/page.tsx`, { reps: wizardReps() });

fs.writeFileSync('tmp-wire-result.txt', results.join('\n') + '\n');
console.log('WIRE-DONE');
