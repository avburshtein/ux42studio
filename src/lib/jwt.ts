import { SignJWT, jwtVerify } from 'jose';

export async function signJwt(
    payload: Record<string, unknown>,
    secret: string,
): Promise<string> {
    const secretKey = new TextEncoder().encode(secret);

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secretKey);
}

export async function verifyJwt(
    token: string,
    secret: string,
): Promise<Record<string, unknown> | null> {
    try {
        const secretKey = new TextEncoder().encode(secret);
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch {
        return null;
    }
}
