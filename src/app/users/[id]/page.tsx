import { userService } from "@/services/user.service";
import { UserDetailView } from "@/components/users/user-detail-view";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;

  return <UserDetailView userId={id} />;
}
