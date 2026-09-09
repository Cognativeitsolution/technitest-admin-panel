"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { UserProfileInfo } from "@/components/users/user-profile-info";
import { userService } from "@/services/user.service";
import type { UserRecord } from "@/data/users";

type Props = {
  roleSlug: string;
  userId: string;
};

export function RoleUserDetailView({ roleSlug, userId }: Props) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      userService.getUserById(userId),
    ])
      .then(([apiUser]) => {
        if (cancelled) return;

        setUser({
          id: String(apiUser.id),
          name: apiUser.username,
          username: apiUser.username,
          email: apiUser.email,
          phone: apiUser.phone || "",
          country: apiUser.country?.name || "",
          quizzesTaken: apiUser.total_quizzes_attempted ?? "-",
          certificates: apiUser.total_certificates_issued ?? "-",
          avatar: apiUser.avatar_url || "",
          state: "",
          city: "",
          identificationNo: "",
          highestEducation: "",
          level: "",
          dateOfBirth: "",
          coinsEarned: apiUser.total_earned_coin ?? "-",
          total_successful_referral: apiUser.total_successful_referral ?? "-",
          emailVerified: apiUser.is_email_verified,
          mobileVerified: false,
        });
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to fetch user details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  if (loading) {
    return <div className="p-8 text-center">Loading user details...</div>;
  }
  if (!user) {
    return <div className="p-8 text-center">User not found</div>;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/roles/${roleSlug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6b7280] transition hover:text-[#111827]"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <span className="h-5 w-px bg-[#d1d5db]" />
        <span className="text-[22px] font-bold tracking-tight text-[#111827]">
          User Detail
        </span>
        <span className="hidden h-6 w-px bg-[#d1d5db] sm:block" />
        <span className="rounded-full bg-[#111827] px-3.5 py-1.5 text-sm font-semibold text-white">
          {user.name}
        </span>
      </div>

      <UserProfileInfo user={user} readonly hideExtraFields />
    </div>
  );
}
