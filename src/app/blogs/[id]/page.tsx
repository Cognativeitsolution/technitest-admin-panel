import { BlogEditorView } from "@/components/cms/blog-editor-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogEditorPage({ params }: PageProps) {
  const { id } = await params;
  return <BlogEditorView blogId={id} />;
}
