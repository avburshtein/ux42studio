function base64UrlEncode(buf: Uint8Array) {
    const str = Buffer.from(buf).toString('base64');
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlEncodeStr(str: string) {
    return base64UrlEncode(Buffer.from(str, 'utf8'));
}

export async function signJwt(payload: Record<string, any>, secret: string) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const enc = new TextEncoder();
    const toSign = `${base64UrlEncodeStr(JSON.stringify(header))}.${base64UrlEncodeStr(JSON.stringify(body))}`;
    const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
    const now = Math.floor(Date.now() / 1000);
    const body = { ...payload, iat: now, exp: now + TTL_SECONDS };
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(toSign));
    return `${toSign}.${base64UrlEncode(new Uint8Array(sig))}`;
}

export async function verifyJwt(token: string, secret: string) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const [headerB64, payloadB64, sigB64] = parts;
        const enc = new TextEncoder();
        const toSign = `${headerB64}.${payloadB64}`;
        const key = await crypto.subtle.importKey(
            'raw',
            enc.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify'],
        );
        const sig = Uint8Array.from(
            Buffer.from(sigB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64'),
        );
        const ok = await crypto.subtle.verify(
            'HMAC',
            key,
            sig,
            enc.encode(toSign),
        );
        if (!ok) return null;
        const payloadStr = Buffer.from(
            payloadB64.replace(/-/g, '+').replace(/_/g, '/'),
            'base64',
        ).toString('utf8');
        const payload = JSON.parse(payloadStr);
        if (
            typeof payload.exp === 'number' &&
            Math.floor(Date.now() / 1000) > payload.exp
        )
            return null;
        return payload;
    } catch (err) {
        return null;
    }
}
