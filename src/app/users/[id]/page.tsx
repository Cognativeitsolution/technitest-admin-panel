import { notFound } from "next/navigation";

import { UserDetailView } from "@/components/users/user-detail-view";
import { getUserById, userCertificates } from "@/data/users";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const user = getUserById(id);

  if (!user) {
    notFound();
  }

  return <UserDetailView user={user} certificates={userCertificates} />;
}
