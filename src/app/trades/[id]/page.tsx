import { notFound } from "next/navigation";

import { CategoriesManagementView } from "@/components/categories/categories-management-view";

type TradeSubcategoriesPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TradeSubcategoriesPage({
  params,
}: TradeSubcategoriesPageProps) {
  const { id } = await params;
  const tradeId = Number(id);

  if (!Number.isInteger(tradeId) || tradeId <= 0) {
    notFound();
  }

  return <CategoriesManagementView tradeId={tradeId} />;
}
