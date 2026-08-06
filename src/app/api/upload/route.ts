import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { files } from '@/db/schema/files';
import { verifyJwt } from '@/lib/jwt';

const ALLOWED_MIME_TYPES = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
];

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
    try {
        // 1. Проверить авторизацию (кука auth-token → JWT → userId)
        const cookieHeader = req.headers.get('cookie') || '';
        const tokenMatch = cookieHeader.match(/(?:^|;\s*)auth-token=([^;]*)/);
        const token = tokenMatch ? tokenMatch[1] : null;

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 },
            );
        }

        const { env } = await getCloudflareContext();
        const jwtSecret = env.JWT_SECRET || process.env.JWT_SECRET;
        if (!jwtSecret) {
            return NextResponse.json(
                { message: 'JWT_SECRET is not configured' },
                { status: 500 },
            );
        }

        const payload = await verifyJwt(token, jwtSecret);
        if (!payload) {
            return NextResponse.json(
                { message: 'Invalid or expired token' },
                { status: 401 },
            );
        }

        const userId = payload.userId as string;

        // 2. Принять multipart/form-data с файлом
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { message: 'No file provided' },
                { status: 400 },
            );
        }

        // 3. Валидировать MIME-тип и размер
        const contentType = file.type;
        if (!ALLOWED_MIME_TYPES.includes(contentType)) {
            return NextResponse.json(
                {
                    message: `Invalid file type: ${contentType}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
                },
                { status: 400 },
            );
        }

        if (file.size > MAX_SIZE_BYTES) {
            return NextResponse.json(
                {
                    message: `File too large: ${file.size} bytes. Max: ${MAX_SIZE_BYTES} bytes`,
                },
                { status: 400 },
            );
        }

        // 4. Сгенерировать r2Key
        const fileName = file.name || 'unnamed';
        const r2Key = `uploads/${userId}/${crypto.randomUUID()}-${fileName}`;

        // 5. Загрузить в R2
        const fileBuffer = await file.arrayBuffer();
        await env.MY_BUCKET.put(r2Key, fileBuffer, {
            httpMetadata: { contentType },
        });

        // 6. Попытаться получить размеры изображения (если доступно)
        let width: number | null = null;
        let height: number | null = null;

        if (contentType !== 'image/svg+xml') {
            try {
                // Используем встроенный Image из Web API (доступен в Cloudflare Workers)
                // Для SVG пропускаем, т.к. размеры нерелевантны
                const dimensions = await getImageDimensions(
                    fileBuffer,
                    contentType,
                );
                if (dimensions) {
                    width = dimensions.width;
                    height = dimensions.height;
                }
            } catch {
                // Игнорируем ошибки получения размеров
            }
        }

        // 7. Записать метаданные в files
        const db = getDb(env.DB);
        const fileId = crypto.randomUUID();

        await db.insert(files).values({
            id: fileId,
            uploaderId: userId,
            r2Key,
            fileName,
            mimeType: contentType,
            sizeBytes: file.size,
            width,
            height,
        });

        // 8. Вернуть результат
        return NextResponse.json({
            fileId,
            r2Key,
            url: `/r2/${r2Key}`,
        });
    } catch (err) {
        console.error('Upload error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

/**
 * Извлекает размеры изображения из бинарных данных.
 * Поддерживает PNG, JPEG, WebP.
 */
async function getImageDimensions(
    buffer: ArrayBuffer,
    mimeType: string,
): Promise<{ width: number; height: number } | null> {
    const bytes = new Uint8Array(buffer);

    if (mimeType === 'image/png') {
        // PNG: ширина на байтах 16-19, высота на 20-23 (big-endian)
        if (bytes.length < 24) return null;
        const view = new DataView(buffer);
        return {
            width: view.getUint32(16),
            height: view.getUint32(20),
        };
    }

    if (mimeType === 'image/jpeg') {
        // JPEG: ищем маркер SOF0 (0xFF 0xC0) или SOF2 (0xFF 0xC2)
        let i = 2;
        while (i < bytes.length - 9) {
            if (bytes[i] !== 0xff) return null;
            const marker = bytes[i + 1];
            if (marker === 0xc0 || marker === 0xc2) {
                const view = new DataView(buffer);
                return {
                    height: view.getUint16(i + 5),
                    width: view.getUint16(i + 7),
                };
            }
            // Пропускаем сегмент: длина (2 байта big-endian) + 2 байта заголовка
            const segLen = ((bytes[i + 2] << 8) | bytes[i + 3]) + 2;
            i += segLen;
        }
        return null;
    }

    if (mimeType === 'image/webp') {
        // WebP: RIFF контейнер
        if (bytes.length < 30) return null;
        // Проверяем сигнатуру "RIFF" и "WEBP"
        const riff = String.fromCharCode(...bytes.slice(0, 4));
        const webp = String.fromCharCode(...bytes.slice(8, 12));
        if (riff !== 'RIFF' || webp !== 'WEBP') return null;

        const chunk = String.fromCharCode(...bytes.slice(12, 16));
        if (chunk === 'VP8 ' && bytes.length >= 30) {
            // Lossy: размеры в байтах 26-29
            const view = new DataView(buffer);
            const w = view.getUint16(26, true);
            const h = view.getUint16(28, true);
            return { width: w & 0x3fff, height: h & 0x3fff };
        }
        if (chunk === 'VP8L' && bytes.length >= 25) {
            // Lossless: размеры закодированы в 4 байтах начиная с 21
            const b0 = bytes[21];
            const b1 = bytes[22];
            const b2 = bytes[23];
            const b3 = bytes[24];
            const w = 1 + (((b1 & 0x3f) << 8) | b0);
            const h =
                1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
            return { width: w, height: h };
        }
        if (chunk === 'VP8X' && bytes.length >= 30) {
            // Extended: размеры в байтах 24-29
            const view = new DataView(buffer);
            const w = view.getUint32(24, true);
            const h = view.getUint32(28, true);
            return {
                width: (w & 0x00ffffff) + 1,
                height: ((h >> 24) | ((h & 0x00ffffff) << 8)) + 1,
            };
        }
        return null;
    }

    return null;
}
