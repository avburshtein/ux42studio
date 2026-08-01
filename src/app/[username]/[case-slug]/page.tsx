export default async function CasePage({
  params,
}: {
  params: Promise<{ username: string; "case-slug": string }>;
}) {
  const { "case-slug": caseSlug } = await params;
  return <main>{caseSlug} — case study</main>;
}
