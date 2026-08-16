import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Прокси-роут для отдачи файлов из R2.
 *
 * В локальной разработке (`next dev`) R2 эмулируется локально, поэтому
 * публичный домен `assets.ux42.studio` недоступен — файлы нужно отдавать
 * напрямую из `env.MY_BUCKET`. Этот роут работает одинаково в dev и prod,
 * устраняя зависимость от кастомного домена.
 *
 * URL: /r2/uploads/{userId}/{uuid}-{fileName}
 */
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ key: string[] }> },
) {
    const { key } = await params;
    const r2Key = key.join('/');

    if (!r2Key) {
        return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const { env } = await getCloudflareContext();

    const object = await env.MY_BUCKET.get(r2Key);
    if (!object) {
        return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const headers = new Headers();
    headers.set(
        'Content-Type',
        object.httpMetadata?.contentType ?? 'application/octet-stream',
    );
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    if (object.httpMetadata?.cacheControl) {
        headers.set('Cache-Control', object.httpMetadata.cacheControl);
    }
    if (object.httpMetadata?.contentEncoding) {
        headers.set('Content-Encoding', object.httpMetadata.contentEncoding);
    }

    return new NextResponse(object.body, { headers });
}
