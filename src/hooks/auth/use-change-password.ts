"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { authService } from "@/services/auth.service";
import type { ChangePasswordPayload } from "@/types/auth.types";

export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const changePassword = async (payload: ChangePasswordPayload) => {
    setLoading(true);
    setFieldErrors({});
    try {
      await authService.changePassword(payload);
      toast.success("Password updated successfully");
      return true;
    } catch (error) {
      const apiError = ApiError.fromAxiosError(error);
      if (Object.keys(apiError.fieldErrors).length > 0) {
        setFieldErrors(apiError.fieldErrors);
      } else {
        toast.error(apiError.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, fieldErrors };
}