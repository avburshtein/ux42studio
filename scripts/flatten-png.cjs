/**
 * Заливка прозрачных областей PNG сплошным цветом.
 *
 * Зачем: OG-обложка — карточка со скруглёнными углами, то есть с
 * прозрачностью по углам (colorType 6, RGBA). Twitter/X, WhatsApp и
 * LinkedIn подставляют под неё белый фон, а Facebook в превью иногда
 * рисует прозрачность чёрным — выглядит как грязные углы. Если альфа
 * убрана из файла, результат предсказуем на всех площадках.
 *
 * Заливаем не белым, а цветом страницы `#F7FAF5`
 * (`--md-sys-color-background`, он же `background_color` в
 * `manifest.ts`) — на светлом фоне сайта скругление читается как
 * задумано.
 *
 * Зависимостей нет: PNG разбирается и собирается вручную
 * (IHDR/IDAT/IEND, zlib из Node). Поддерживаются 8-битные RGB и RGBA
 * без перемежения (interlace = 0). На выходе всегда RGB — альфа-канала
 * нет в принципе, поэтому «прозрачность» уже нельзя отрисовать как угодно.
 *
 * Использование:
 *     node scripts/flatten-png.cjs вход.png выход.png "#F7FAF5"
 */

'use strict';

const fs = require('node:fs');
const zlib = require('node:zlib');

const PNG_SIGNATURE = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

// ─── CRC32 (для чанков PNG) ────────────────────────────────────────────────
const CRC_TABLE = (() => {
    const table = new Int32Array(256);
    for (let n = 0; n < 256; n += 1) {
        let c = n;
        for (let k = 0; k < 8; k += 1) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[n] = c;
    }
    return table;
})();

function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i += 1) {
        c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const out = Buffer.alloc(data.length + 12);
    out.writeUInt32BE(data.length, 0);
    typeBuf.copy(out, 4);
    data.copy(out, 8);
    out.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), data.length + 8);
    return out;
}

// ─── Разбор PNG ────────────────────────────────────────────────────────────
function parsePng(buf) {
    if (!buf.subarray(0, 8).equals(PNG_SIGNATURE)) {
        throw new Error('Не PNG: неверная сигнатура');
    }

    let offset = 8;
    let header = null;
    const ancillary = [];
    const idat = [];

    while (offset < buf.length) {
        const length = buf.readUInt32BE(offset);
        const type = buf.toString('ascii', offset + 4, offset + 8);
        const data = buf.subarray(offset + 8, offset + 8 + length);
        offset += 12 + length;

        if (type === 'IHDR') {
            header = {
                width: data.readUInt32BE(0),
                height: data.readUInt32BE(4),
                bitDepth: data[8],
                colorType: data[9],
                interlace: data[12],
            };
        } else if (type === 'IDAT') {
            idat.push(data);
        } else if (type === 'IEND') {
            break;
        } else {
            ancillary.push({ type, data });
        }
    }

    if (!header) throw new Error('PNG без IHDR');
    if (header.bitDepth !== 8) {
        throw new Error(`Поддерживается только 8 бит/канал, а тут ${header.bitDepth}`);
    }
    if (header.interlace !== 0) {
        throw new Error('Перемеженный PNG (Adam7) не поддерживается');
    }
    if (header.colorType !== 2 && header.colorType !== 6) {
        throw new Error(`Поддерживаются только RGB/RGBA, а тут colorType ${header.colorType}`);
    }

    return {
        ...header,
        ancillary,
        pixels: zlib.inflateSync(Buffer.concat(idat)),
    };
}

function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    return pb <= pc ? b : c;
}

/** Обратные PNG-фильтры строк (типы 0–4) → сырые пиксели. */
function unfilter(pixels, width, height, bytesPerPixel) {
    const stride = width * bytesPerPixel;
    const out = Buffer.alloc(stride * height);

    for (let y = 0; y < height; y += 1) {
        const filterType = pixels[y * (stride + 1)];
        const src = pixels.subarray(
            y * (stride + 1) + 1,
            (y + 1) * (stride + 1),
        );
        const cur = out.subarray(y * stride, (y + 1) * stride);
        const prev =
            y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;

        for (let x = 0; x < stride; x += 1) {
            const raw = src[x];
            const a = x >= bytesPerPixel ? cur[x - bytesPerPixel] : 0;
            const b = prev ? prev[x] : 0;
            const c = prev && x >= bytesPerPixel ? prev[x - bytesPerPixel] : 0;

            let value;
            switch (filterType) {
                case 0:
                    value = raw;
                    break;
                case 1:
                    value = raw + a;
                    break;
                case 2:
                    value = raw + b;
                    break;
                case 3:
                    value = raw + ((a + b) >> 1);
                    break;
                case 4:
                    value = raw + paeth(a, b, c);
                    break;
                default:
                    throw new Error(
                        `Неизвестный PNG-фильтр ${filterType} в строке ${y}`,
                    );
            }
            cur[x] = value & 0xff;
        }
    }

    return out;
}

function expandRgbToRgba(rgb) {
    const out = Buffer.alloc((rgb.length / 3) * 4);
    for (let i = 0, j = 0; j < rgb.length; i += 4, j += 3) {
        out[i] = rgb[j];
        out[i + 1] = rgb[j + 1];
        out[i + 2] = rgb[j + 2];
        out[i + 3] = 255;
    }
    return out;
}

/** Раскладываем RGBA по фону «source-over» и получаем RGB без альфы. */
function compositeOnBackground(rgba, background) {
    const rgb = Buffer.alloc((rgba.length / 4) * 3);

    for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
        const alpha = rgba[i + 3];
        if (alpha === 255) {
            rgb[j] = rgba[i];
            rgb[j + 1] = rgba[i + 1];
            rgb[j + 2] = rgba[i + 2];
            continue;
        }
        for (let k = 0; k < 3; k += 1) {
            const src = rgba[i + k];
            const dst = background[k];
            rgb[j + k] = Math.round(
                (src * alpha + dst * (255 - alpha)) / 255,
            );
        }
    }

    return rgb;
}

/**
 * Фильтр Up перед сжатием: на больших однотонных заливках разности
 * почти нулевые, поэтому zlib сжимает картинку в разы лучше.
 */
function applyUpFilter(rgb, width, height) {
    const stride = width * 3;
    const out = Buffer.alloc((stride + 1) * height);

    for (let y = 0; y < height; y += 1) {
        out[y * (stride + 1)] = 2; // filter type: Up
        const cur = rgb.subarray(y * stride, (y + 1) * stride);
        const prev =
            y > 0 ? rgb.subarray((y - 1) * stride, y * stride) : null;
        for (let x = 0; x < stride; x += 1) {
            out[y * (stride + 1) + 1 + x] =
                (cur[x] - (prev ? prev[x] : 0)) & 0xff;
        }
    }

    return out;
}

function encodePng({ width, height, ancillary, rgb }) {
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 2; // color type: truecolor RGB — альфа-канала нет
    ihdr[10] = 0; // compression: deflate
    ihdr[11] = 0; // filter method
    ihdr[12] = 0; // interlace: none

    const chunks = [makeChunk('IHDR', ihdr)];
    // Служебные чанки (sRGB, gAMA, pHYs, tEXt) сохраняем — иначе
    // браузеры и соцсети могут иначе трактовать цвет.
    for (const { type, data } of ancillary) {
        if (type === 'tRNS') continue; // прозрачность больше не нужна
        chunks.push(makeChunk(type, data));
    }
    chunks.push(
        makeChunk(
            'IDAT',
            zlib.deflateSync(applyUpFilter(rgb, width, height), {
                level: 9,
            }),
        ),
    );
    chunks.push(makeChunk('IEND', Buffer.alloc(0)));

    return Buffer.concat([PNG_SIGNATURE, ...chunks]);
}

function parseColor(value) {
    const hex = String(value).trim().replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
        throw new Error(
            `Цвет должен быть в формате #RRGGBB, получено «${value}»`,
        );
    }
    return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
    ];
}

function main() {
    const [input, output, color = '#F7FAF5'] = process.argv.slice(2);
    if (!input || !output) {
        console.error(
            'Использование: node scripts/flatten-png.cjs вход.png выход.png "#F7FAF5"',
        );
        process.exit(1);
    }

    const source = fs.readFileSync(input);
    const png = parsePng(source);
    const bytesPerPixel = png.colorType === 6 ? 4 : 3;
    const raw = unfilter(png.pixels, png.width, png.height, bytesPerPixel);
    const rgba =
        bytesPerPixel === 4 ? raw : expandRgbToRgba(raw);
    const rgb = compositeOnBackground(rgba, parseColor(color));
    const result = encodePng({ ...png, rgb });

    fs.writeFileSync(output, result);

    console.log(
        `${input} → ${output}: ${png.width}x${png.height}, ` +
            `${Math.round(source.length / 1024)} KB → ` +
            `${Math.round(result.length / 1024)} KB, ` +
            `фон ${color}, альфа-канал убран (colorType 2)`,
    );
}

main();
