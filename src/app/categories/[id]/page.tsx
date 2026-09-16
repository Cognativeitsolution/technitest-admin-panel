import { notFound } from "next/navigation";

import { CategoriesManagementView } from "@/components/categories/categories-management-view";

type CategorySubcategoriesPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CategorySubcategoriesPage({
  params,
}: CategorySubcategoriesPageProps) {
  const { id } = await params;
  const tradeId = Number(id);

  if (!Number.isInteger(tradeId) || tradeId <= 0) {
    notFound();
  }

  return <CategoriesManagementView tradeId={tradeId} />;
}
