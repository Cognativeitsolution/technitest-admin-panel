import { notFound } from "next/navigation";

import { EditCertificateView } from "@/components/certificates/edit-certificate-view";
import { getCertificateById } from "@/data/certificates";

type EditCertificatePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCertificatePage({
  params,
}: EditCertificatePageProps) {
  const { id } = await params;
  const certificate = getCertificateById(id);

  if (!certificate) {
    notFound();
  }

  return <EditCertificateView certificate={certificate} />;
}
