import AdminShell from '@/components/admin/AdminShell';
import type { Metadata } from 'next';

// C4 (решение (42)): приватная зона — noindex/nofollow (robots.txt уже
// закрывает /admin; meta — второй рубеж).
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

/**
 * Layout админки — теперь статический серверный компонент (только metadata
 * + рендер клиентской оболочки). Раньше здесь были headers() + два запроса
 * в D1 на каждый запрос любой админ-страницы: это делало всю ветку /admin/*
 * динамической (SSR на каждый просмотр, CPU воркера впустую), даже страницы,
 * которые сами по себе клиентские и могли бы быть пререндерены.
 *
 * Проверка сессии переехала в клиентскую AdminShell (GET /api/session):
 * неавторизованных на /login отправляет middleware на edge — он и раньше
 * был первым рубежом; AdminShell дублирует его на случай истёкшего токена.
 */
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminShell>{children}</AdminShell>;
}

