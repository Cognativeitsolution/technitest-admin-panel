import { PageEditorView } from "@/components/cms/page-editor-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CmsPageEditorPage({ params }: PageProps) {
  const { id } = await params;
  return <PageEditorView pageId={id} />;
}
