import { RoleUsersView } from "@/components/roles/role-users-view";

type RoleUsersPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RoleUsersPage({ params }: RoleUsersPageProps) {
  const { id } = await params;

  return <RoleUsersView roleId={id} />;
}
