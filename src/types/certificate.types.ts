export type CertificateTemplatePayload = {
  heading: string;
  opening_line: string;
  statement: string;
  description: string;
  signature_text: string;
};

export type CertificateTemplate = CertificateTemplatePayload & {
  id?: number;
  logo_url?: string | null;
  signature_image_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type UserCertificateItem = {
  quiz_attempt_id: number | null;
  certificate_number: string;
  user_name: string;
  quiz_title: string;
  category: string;
  level: string;
  status: string;
  issued_at: string | null;
  expires_at?: string | null;
  percentage: number;
  score: number;
  badge_name: string | null;
  badge_image_url: string | null;
};

export type UserCertificateDetail = {
  template: CertificateTemplate | null;
  certificate: UserCertificateItem;
};

export type VerifyCertificateResult = {
  is_valid: boolean;
  message: string;
  template: CertificateTemplate | null;
  certificate: UserCertificateItem | null;
};
