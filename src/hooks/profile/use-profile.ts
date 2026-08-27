"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { profileService } from "@/services/profile.service";
import type {
  ProfileDetail,
  ProfileInfo,
  UpdateProfilePayload,
} from "@/types/profile.types";

export function useProfile() {
  const [info, setInfo] = useState<ProfileInfo | null>(null);
  const [detail, setDetail] = useState<ProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([profileService.getInfo(), profileService.getDetail()])
      .then(([infoData, detailData]) => {
        if (cancelled) return;
        setInfo(infoData);
        setDetail(detailData);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(ApiError.fromAxiosError(err).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload, image?: File | null) => {
      setMutating(true);
      try {
        const updated = await profileService.updateProfile(payload, image);
        if (updated) {
          setDetail(updated);
          setInfo((prev) =>
            prev
              ? {
                  ...prev,
                  email: updated.email ?? prev.email,
                  username: updated.username ?? prev.username,
                }
              : prev,
          );
        }
        toast.success("Profile updated successfully");
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [],
  );

  return { info, detail, loading, mutating, error, updateProfile };
}