'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { files } from '@/db/schema/files';

/**
 * Подтверждение загрузки файла, загруженного через presigned URL.
 * Используется как альтернатива прямому `env.R2.put()` в upload route.
 */
export async function confirmUpload(data: {
    r2Key: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    width?: number | null;
    height?: number | null;
    uploaderId: string;
}) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const fileId = crypto.randomUUID();

    await db.insert(files).values({
        id: fileId,
        uploaderId: data.uploaderId,
        r2Key: data.r2Key,
        fileName: data.fileName,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
        width: data.width ?? null,
        height: data.height ?? null,
    });

    return { fileId, r2Key: data.r2Key };
}
