import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users } from '@/db/schema/users';
import { sql } from 'drizzle-orm';

export async function GET() {
    const checks: Record<string, { status: 'ok' | 'error'; message?: string }> =
        {};

    try {
        const { env } = await getCloudflareContext();

        // D1 check
        try {
            const db = getDb(env.DB);
            await db
                .select({ val: sql`1` })
                .from(users)
                .limit(1);
            checks.d1 = { status: 'ok' };
        } catch (e) {
            checks.d1 = { status: 'error', message: String(e) };
        }

        // R2 check
        try {
            await env.MY_BUCKET.list({ limit: 1 });
            checks.r2 = { status: 'ok' };
        } catch (e) {
            checks.r2 = { status: 'error', message: String(e) };
        }
    } catch {
        checks.d1 = {
            status: 'error',
            message: 'Failed to get Cloudflare context',
        };
        checks.r2 = {
            status: 'error',
            message: 'Failed to get Cloudflare context',
        };
    }

    const allOk = Object.values(checks).every((c) => c.status === 'ok');
    return NextResponse.json(
        { status: allOk ? 'ok' : 'degraded', checks, timestamp: Date.now() },
        { status: allOk ? 200 : 503 },
    );
}
