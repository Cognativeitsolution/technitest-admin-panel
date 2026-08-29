"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { profileService } from "@/services/profile.service";
import { useAuthStore } from "@/store/auth-store";
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

  const refetchProfile = useCallback(async () => {
    const [infoData, detailData] = await Promise.all([
      profileService.getInfo(),
      profileService.getDetail(),
    ]);
    setInfo(infoData);
    setDetail(detailData);
    setError(null);

    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      useAuthStore.getState().setUser({
        ...currentUser,
        fullName: infoData.username || currentUser.fullName,
        avatar: infoData.image_url ?? currentUser.avatar,
      });
    }

    return { info: infoData, detail: detailData };
  }, []);

  useEffect(() => {
    let cancelled = false;
    refetchProfile()
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
  }, [refetchProfile]);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload, image?: File | null) => {
      setMutating(true);
      try {
        await profileService.updateProfile(payload, image);
        await refetchProfile();
        toast.success("Profile updated successfully");
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [refetchProfile],
  );

  return {
    info,
    detail,
    loading,
    mutating,
    error,
    refetchProfile,
    updateProfile,
  };
}
