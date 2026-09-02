import type { TestReportCertificateProps } from "@/components/certificates/test-report-certificate";
import type { Certificate } from "@/data/certificates";
import type {
  CertificateTemplate,
  UserCertificateItem,
} from "@/types/certificate.types";

export function formatCertificateDate(value: string | null | undefined) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function gradeFromPercentage(percentage: number | null | undefined) {
  const value = Number(percentage);
  if (!Number.isFinite(value)) return "--";
  if (value >= 90) return "A+";
  if (value >= 80) return "A";
  if (value >= 70) return "B";
  if (value >= 60) return "C";
  return "D";
}

export function toTestReportProps({
  certificate,
  template,
  photoUrl,
}: {
  certificate: UserCertificateItem;
  template?: CertificateTemplate | null;
  photoUrl?: string | null;
}): TestReportCertificateProps {
  const grade =
    certificate.badge_name?.trim() ||
    gradeFromPercentage(certificate.percentage);
  const obtained = Number.isFinite(certificate.score)
    ? certificate.score
    : certificate.percentage;

  return {
    reportNumber: certificate.certificate_number || "--",
    candidateName: certificate.user_name || "Candidate",
    candidatePhotoUrl: photoUrl,
    jobTitle: certificate.quiz_title || "Trade Test",
    testDate: formatCertificateDate(certificate.issued_at),
    referenceNo: certificate.category
      ? `TNT-${certificate.category}`
      : certificate.certificate_number,
    remarks: `${grade} Grade`,
    totalMarks: 100,
    marksObtained: obtained,
    grade,
    pointsConsidered:
      template?.description ||
      "The candidate was assessed on core trade knowledge, practical application, safety standards, and problem-solving ability required for the role.",
    heading: template?.heading || "TEST REPORT",
    openingLine: template?.opening_line || "This is to Certify that",
    statement:
      template?.statement ||
      "has successfully appeared in the TECH-NI-TEST Trade Test conducted for the post of",
    logoUrl: template?.logo_url,
    signatureImageUrl: template?.signature_image_url,
    signatureText: template?.signature_text || "Signature",
    sealLabel: certificate.level || "BEGINNER",
    qrValue: certificate.certificate_number,
  };
}

export function toTestReportPropsFromLegacy(
  certificate: Certificate,
  extras?: Partial<TestReportCertificateProps>,
): TestReportCertificateProps {
  return {
    reportNumber: certificate.id,
    candidateName: certificate.recipientName,
    jobTitle: certificate.title,
    testDate: certificate.issueDate,
    referenceNo: `TNT-${certificate.category}`,
    remarks: `${certificate.level} Grade`,
    totalMarks: 100,
    marksObtained: "--",
    grade: certificate.level === "Advanced" ? "A+" : "A",
    pointsConsidered: certificate.description,
    heading: certificate.certificateHeading,
    openingLine: certificate.openingLine,
    statement: certificate.completionStatement,
    sealLabel: certificate.level,
    qrValue: certificate.id,
    ...extras,
  };
}
