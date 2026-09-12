import Link from 'next/link';

// C5 (решение (42)): 404 по токенам — section-container по центру, крупная
// цифра display-sm, одна строка объяснения, пилюля primary на главную.
// h1 — семантика (один заголовок страницы).
export default function NotFound() {
    return (
        <main className='flex min-h-screen items-center justify-center bg-background'>
            <div className='section-container flex flex-col items-center gap-6 py-24 text-center'>
                <h1 className='font-display text-display-sm font-medium text-on-surface'>
                    404
                </h1>
                <p className='max-w-md text-body-md text-on-surface-variant'>
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href='/'
                    className='inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-button font-medium text-on-primary transition-opacity duration-150 ease-out hover:opacity-90'
                >
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
