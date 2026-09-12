// Конверт PNG-ассетов панелей Approach/Studio в WebP (sharp).
// Запуск: node scripts/convert-to-webp.cjs
// Исходники — public/approach-1.png (1,46 МБ) и public/studio-2.png (2,37 МБ);
// рендер-ширины: Approach до ~640 (панель 600×640) → 1280 (2×), Studio 516 → 1100.
// Спека (49) 2026-09-12: approach-1.webp 77 КБ, studio-2.webp 102 КБ (~20×).
let sharp;
try { sharp = require('sharp'); } catch (e) { console.error('NO_SHARP:', e.message); process.exit(1); }
console.log('SHARP OK');
(async () => {
  for (const [src, dst, w] of [
    ['public/approach-1.png', 'public/approach-1.webp', 1280],
    ['public/studio-2.png', 'public/studio-2.webp', 1100],
  ]) {
    const m = await sharp(src).metadata();
    console.log(src, m.width + 'x' + m.height);
    const info = await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(dst);
    console.log('->', dst, info.width + 'x' + info.height, info.size, 'bytes');
  }
  console.log('DONE');
  process.exit(0); // sharp-воркеры под этой оболочкой не дают процессу завершиться с 0
})().catch((e) => { console.error(e); process.exit(1); });