import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const { pathname } = request.nextUrl;

    // Нет куки → редирект на /login
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return NextResponse.json(
            { error: 'JWT_SECRET is not configured' },
            { status: 500 },
        );
    }

    const payload = await verifyJwt(token, jwtSecret);
    if (!payload) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    const { userId, role } = payload as {
        userId: string;
        email: string;
        role: string;
    };

    // Проверка доступа к /super-admin/* — только admin
    if (pathname.startsWith('/super-admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Проверка доступа к /admin/* — user или admin
    if (pathname.startsWith('/admin') && role !== 'user' && role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Пробросить userId и role в заголовки
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userId);
    requestHeaders.set('x-user-role', role);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ['/admin/:path*', '/super-admin/:path*'],
};
