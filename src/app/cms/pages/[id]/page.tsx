import { notFound } from "next/navigation";

import { PageEditorView } from "@/components/cms/page-editor-view";
import { cmsPages } from "@/data/cms";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CmsPageEditorPage({ params }: PageProps) {
  const { id } = await params;
  const page = cmsPages.find((item) => item.id === id);

  if (!page) {
    notFound();
  }

  if (page.slug === "/homepage" || page.title === "Homepage") {
    const { redirect } = await import("next/navigation");
    redirect("/cms/homepage");
  }

  return <PageEditorView pageId={id} />;
}
