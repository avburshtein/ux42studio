import { Suspense } from 'react';
import RegisterPageContent from '@/components/auth/RegisterPageContent';

// useSearchParams внутри RegisterPageContent требует Suspense-границу
// при статическом рендере (Next.js) — иначе сборка падает.
export default function RegisterPage() {
    return (
        <Suspense fallback={null}>
            <RegisterPageContent />
        </Suspense>
    );
}
