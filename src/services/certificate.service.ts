import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type {
  CertificateTemplate,
  CertificateTemplatePayload,
  UserCertificateDetail,
  UserCertificateItem,
  VerifyCertificateResult,
} from "@/types/certificate.types";

export type CertificateListQuery = {
  page?: number;
  per_page?: number;
  status?: string;
  category?: string;
  level?: string;
  date_from?: string;
  date_to?: string;
};

export type UpsertTemplateInput = CertificateTemplatePayload & {
  logo?: File | null;
  signatureImage?: File | null;
};

function buildTemplateFormData({
  logo,
  signatureImage,
  ...payload
}: UpsertTemplateInput) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  if (logo) {
    formData.append("logo", logo);
  }
  if (signatureImage) {
    formData.append("signature_image", signatureImage);
  }
  return formData;
}

export const certificateService = {
  getTemplate: async () => {
    const { data } = await apiClient.get<ApiEnvelope<CertificateTemplate>>(
      "/api/v1/certificate-template/",
    );
    return data.response.data;
  },

  upsertTemplate: async (input: UpsertTemplateInput) => {
    await apiClient.put(
      "/api/v1/certificate-template/",
      buildTemplateFormData(input),
    );
  },

  getAdminCertificates: async (params?: CertificateListQuery) => {
    const { data } =
      await apiClient.get<ApiEnvelope<PaginatedData<UserCertificateItem>>>(
        "/api/v1/user-certificates/admin/certificate-list",
        { params },
      );
    return data.response.data;
  },

  getUserCertificates: async (params?: CertificateListQuery) => {
    const { data } =
      await apiClient.get<ApiEnvelope<PaginatedData<UserCertificateItem>>>(
        "/api/v1/user-certificates/user/certificate-list",
        { params },
      );
    return data.response.data;
  },

  getCertificate: async (quizAttemptId: number) => {
    const { data } = await apiClient.get<
      ApiEnvelope<UserCertificateDetail>
    >(`/api/v1/user-certificates/certificates/${quizAttemptId}`);
    return data.response.data;
  },

  verifyCertificate: async (certificateNumber: string) => {
    const { data } = await apiClient.get<ApiEnvelope<VerifyCertificateResult>>(
      `/api/v1/user-certificates/verify/${encodeURIComponent(certificateNumber)}`,
    );
    return data.response.data;
  },
};
