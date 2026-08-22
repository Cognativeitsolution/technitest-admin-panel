"use client";

import { useCallback, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { certificateService } from "@/services/certificate.service";
import type { UserCertificateDetail } from "@/types/certificate.types";

export function useCertificateDetail() {
  const [detail, setDetail] = useState<UserCertificateDetail | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCertificate = useCallback(async (quizAttemptId: number) => {
    setLoadingId(quizAttemptId);
    try {
      const result = await certificateService.getCertificate(quizAttemptId);
      setDetail(result);
      setError(null);
      return result;
    } catch (err) {
      setError(ApiError.fromAxiosError(err).message);
      return null;
    } finally {
      setLoadingId(null);
    }
  }, []);

  const clearDetail = useCallback(() => {
    setDetail(null);
    setError(null);
  }, []);

  return { detail, loadingId, error, loadCertificate, clearDetail };
}
