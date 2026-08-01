export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <main>{username} — portfolio</main>;
}
