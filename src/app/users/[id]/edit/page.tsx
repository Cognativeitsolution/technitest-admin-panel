import { UserEditView } from "@/components/users/user-edit-view";

type UserEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserEditPage({ params }: UserEditPageProps) {
  const { id } = await params;

  return <UserEditView userId={id} />;
}
