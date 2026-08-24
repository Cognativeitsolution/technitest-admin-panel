"use client";

import { useCallback, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { certificateService } from "@/services/certificate.service";
import type { VerifyCertificateResult } from "@/types/certificate.types";

export function useVerifyCertificate() {
  const [result, setResult] = useState<VerifyCertificateResult | null>(null);
  const [verifyingNumber, setVerifyingNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyCertificate = useCallback(async (certificateNumber: string) => {
    setVerifyingNumber(certificateNumber);
    try {
      const response = await certificateService.verifyCertificate(
        certificateNumber,
      );
      setResult(response);
      setError(null);
      return response;
    } catch (err) {
      setError(ApiError.fromAxiosError(err).message);
      return null;
    } finally {
      setVerifyingNumber(null);
    }
  }, []);

  const resetVerification = useCallback(() => {
    setResult(null);
    setError(null);
    setVerifyingNumber(null);
  }, []);

  return { result, verifyingNumber, error, verifyCertificate, resetVerification };
}
