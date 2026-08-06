function base64UrlEncode(buf: Uint8Array): string {
    let str = '';
    for (let i = 0; i < buf.length; i++) {
        str += String.fromCharCode(buf[i]);
    }
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlEncodeStr(str: string): string {
    return base64UrlEncode(new TextEncoder().encode(str));
}

function base64UrlDecode(str: string): Uint8Array {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

export async function signJwt(payload: Record<string, any>, secret: string): Promise<string> {
    const header = { alg: 'HS256', typ: 'JWT' };
    const enc = new TextEncoder();
    
    const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
    const now = Math.floor(Date.now() / 1000);
    const body = { ...payload, iat: now, exp: now + TTL_SECONDS };

    const toSign = `${base64UrlEncodeStr(JSON.stringify(header))}.${base64UrlEncodeStr(JSON.stringify(body))}`;
    
    const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(toSign));
    return `${toSign}.${base64UrlEncode(new Uint8Array(sig))}`;
}

export async function verifyJwt(token: string, secret: string): Promise<Record<string, any> | null> {
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
        
        const sig = base64UrlDecode(sigB64);
        
        // Кастим sig.buffer как ArrayBuffer для удовлетворения контракта BufferSource в TS 5.x
        const ok = await crypto.subtle.verify(
            'HMAC',
            key,
            sig.buffer as ArrayBuffer,
            enc.encode(toSign),
        );
        if (!ok) return null;

        const payloadStr = new TextDecoder().decode(base64UrlDecode(payloadB64));
        const payload = JSON.parse(payloadStr);
        
        if (
            typeof payload.exp === 'number' &&
            Math.floor(Date.now() / 1000) > payload.exp
        ) {
            return null;
        }
        
        return payload;
    } catch {
        return null;
    }
}