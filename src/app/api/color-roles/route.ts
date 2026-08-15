import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { colorRoles } from '@/db/schema/color-roles';
import { asc } from 'drizzle-orm';

export async function GET() {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const roles = await db
        .select({
            id: colorRoles.id,
            name: colorRoles.name,
            lightColor: colorRoles.lightColor1,
            darkColor: colorRoles.darkColor1,
            description: colorRoles.name,
        })
        .from(colorRoles)
        .orderBy(asc(colorRoles.name))
        .all();

    return NextResponse.json(roles.map((r) => ({ ...r, description: null })));
}
