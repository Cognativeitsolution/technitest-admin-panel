import { redirect } from "next/navigation";

type TradeRedirectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TradeRedirectPage({
  params,
}: TradeRedirectPageProps) {
  const { id } = await params;
  redirect(`/categories/${id}`);
}
