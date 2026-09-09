import { RoleUsersView } from "@/components/roles/role-users-view";

type RoleUsersPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RoleUsersPage({ params }: RoleUsersPageProps) {
  const { slug } = await params;
  return <RoleUsersView roleSlug={slug} />;
}
