import type { TestReportCertificateProps } from "@/components/certificates/test-report-certificate";
import type { Certificate } from "@/data/certificates";
import type {
  CertificateTemplate,
  UserCertificateItem,
} from "@/types/certificate.types";

const DESIGN = {
  heading: "TEST REPORT",
  openingLine: "This is to Certify that",
  statement:
    "has successfully appeared in the TECH-NI-TEST Trade Test conducted for the post of",
  description:
    "Install, maintains adjust and repairs electrical wiring systems, distribution boards, circuit breakers, and related equipment in accordance with applicable standards.",
} as const;

const PLACEHOLDER_HEADINGS = new Set([
  "certificate heading",
  "certificate",
  "heading",
  "certificates",
]);

const PLACEHOLDER_OPENING = new Set([
  "opening line",
  "this is to certify that",
  "this is to certify",
]);

const PLACEHOLDER_STATEMENT = new Set([
  "completion statement",
  "has successfully completed the test of",
  "statement",
]);

function resolveTemplateField(
  value: string | null | undefined,
  fallback: string,
  placeholders: Set<string>,
) {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  if (placeholders.has(trimmed.toLowerCase())) return fallback;
  return trimmed;
}

function resolveDescription(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return DESIGN.description;
  const lower = trimmed.toLowerCase();
  if (lower === "description") return DESIGN.description;
  if (/^(description\s*)+$/.test(lower)) return DESIGN.description;
  return trimmed;
}

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
  if (!Number.isFinite(value)) return "A+";
  if (value >= 90) return "A+";
  if (value >= 80) return "A";
  if (value >= 70) return "B";
  if (value >= 60) return "C";
  return "D";
}

function letterGradeFromBadge(badgeName: string | null, percentage: number) {
  if (badgeName) {
    const match = badgeName.match(/\b(A\+|A|B\+|B|C\+|C|D)\b/i);
    if (match) return match[0].toUpperCase();
  }
  return gradeFromPercentage(percentage);
}

function estimateTotalMarks(score: number, percentage: number) {
  if (!percentage || percentage <= 0) return 100;
  return Math.max(Math.round(score / (percentage / 100)), score, 100);
}

export function resolveCertificateTemplateCopy(
  template: Partial<CertificateTemplate> | null | undefined,
) {
  return {
    heading: resolveTemplateField(
      template?.heading,
      DESIGN.heading,
      PLACEHOLDER_HEADINGS,
    ),
    openingLine: resolveTemplateField(
      template?.opening_line,
      DESIGN.openingLine,
      PLACEHOLDER_OPENING,
    ),
    statement: resolveTemplateField(
      template?.statement,
      DESIGN.statement,
      PLACEHOLDER_STATEMENT,
    ),
    description: resolveDescription(template?.description),
  };
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
  const letterGrade = letterGradeFromBadge(
    certificate.badge_name,
    certificate.percentage,
  );
  const obtained = Number.isFinite(certificate.score)
    ? certificate.score
    : certificate.percentage;
  const totalMarks = estimateTotalMarks(
    certificate.score,
    certificate.percentage,
  );

  return {
    reportNumber: certificate.certificate_number || "--",
    candidateName: certificate.user_name || "Candidate",
    candidatePhotoUrl: photoUrl,
    jobTitle: certificate.quiz_title || "Trade Test",
    testDate: formatCertificateDate(certificate.issued_at),
    referenceNo: certificate.category
      ? `TNT-${certificate.category}`
      : certificate.certificate_number,
    remarks: `${letterGrade} Grade`,
    totalMarks,
    marksObtained: obtained,
    grade: letterGrade,
    pointsConsidered: resolveDescription(template?.description),
    heading: resolveTemplateField(
      template?.heading,
      DESIGN.heading,
      PLACEHOLDER_HEADINGS,
    ),
    openingLine: resolveTemplateField(
      template?.opening_line,
      DESIGN.openingLine,
      PLACEHOLDER_OPENING,
    ),
    statement: resolveTemplateField(
      template?.statement,
      DESIGN.statement,
      PLACEHOLDER_STATEMENT,
    ),
    signatureImageUrl: template?.signature_image_url,
    signatureText: template?.signature_text?.trim() || "Signature",
    sealLabel:
      certificate.level?.trim() ||
      certificate.badge_name?.split(/\s+/)[0] ||
      "BEGINNER",
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
    heading: resolveTemplateField(
      certificate.certificateHeading,
      DESIGN.heading,
      PLACEHOLDER_HEADINGS,
    ),
    openingLine: resolveTemplateField(
      certificate.openingLine,
      DESIGN.openingLine,
      PLACEHOLDER_OPENING,
    ),
    statement: resolveTemplateField(
      certificate.completionStatement,
      DESIGN.statement,
      PLACEHOLDER_STATEMENT,
    ),
    sealLabel: certificate.level,
    qrValue: certificate.id,
    ...extras,
  };
}
