"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { certificateService } from "@/services/certificate.service";
import type {
  CertificateTemplate,
  CertificateTemplatePayload,
} from "@/types/certificate.types";

export type SaveTemplateInput = {
  payload: CertificateTemplatePayload;
  logo?: File | null;
  signatureImage?: File | null;
};

export function useCertificateTemplate() {
  const [template, setTemplate] = useState<CertificateTemplate | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const [saving, setSaving] = useState(false);

  const queryKey = `${nonce}`;

  useEffect(() => {
    let cancelled = false;
    certificateService
      .getTemplate()
      .then((result) => {
        if (cancelled) return;
        setTemplate(result);
        setNotConfigured(false);
        setError(null);
        setSettledKey(queryKey);
      })
      .catch((err) => {
        if (cancelled) return;
        const apiError = ApiError.fromAxiosError(err);
        if (apiError.statusCode === 404) {
          setTemplate(null);
          setNotConfigured(true);
          setError(null);
        } else {
          setError(apiError.message);
        }
        setSettledKey(queryKey);
      });
    return () => {
      cancelled = true;
    };
  }, [nonce, queryKey]);

  const saveTemplate = useCallback(
    async ({ payload, logo, signatureImage }: SaveTemplateInput) => {
      setSaving(true);
      try {
        await certificateService.upsertTemplate({
          ...payload,
          logo,
          signatureImage,
        });
        toast.success("Certificate template saved");
        setNonce((prev) => prev + 1);
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return {
    template,
    notConfigured,
    loading: settledKey !== queryKey,
    error,
    saving,
    saveTemplate,
    refresh: useCallback(() => setNonce((prev) => prev + 1), []),
  };
}
