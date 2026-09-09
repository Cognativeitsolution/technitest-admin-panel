import { RoleUserEditView } from "@/components/roles/role-user-edit-view";

type Props = {
  params: Promise<{ slug: string; id: string }>;
};

export default async function RoleUserEditPage({ params }: Props) {
  const { slug, id } = await params;
  return <RoleUserEditView roleSlug={slug} userId={id} />;
}
