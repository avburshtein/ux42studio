export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='min-h-screen flex items-center justify-center bg-[var(--md-sys-color-surface)]'>
            <main className='w-full max-w-md p-8'>{children}</main>
        </div>
    );
}
