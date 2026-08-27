import { CmsView } from "@/components/cms/cms-view";

type PageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function CmsPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  return <CmsView initialTab={tab} />;
}
