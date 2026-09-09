import { RoleUserDetailView } from "@/components/roles/role-user-detail-view";

type Props = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function RoleUserDetailPage({ params }: Props) {
  const { slug, id } = await params;
  return <RoleUserDetailView roleSlug={slug} userId={id} />;
}
