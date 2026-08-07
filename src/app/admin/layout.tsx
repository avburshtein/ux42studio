export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className='min-h-screen p-8 mx-auto max-w-7xl'>{children}</div>;
}
