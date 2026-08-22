"use client";

import { useState } from "react";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api-error";
import { authStorage } from "@/lib/auth-storage";
import { handleAuthSuccess } from "@/lib/handle-auth-success";
import { parseLoginResponse } from "@/lib/auth-response";
import type { LoginFormData } from "@/schemas/auth.schema";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const login = async (data: LoginFormData) => {
    setLoading(true);
    setFieldErrors({});

    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      const { tokens, user } = parseLoginResponse(response);
      await handleAuthSuccess({ tokens, user });

      toast.success("Welcome back!");
      return true;
    } catch (error) {
      authStorage.clear();
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

  return { login, loading, fieldErrors };
}
