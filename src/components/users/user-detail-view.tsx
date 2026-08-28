"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Coins,
  FileText,
  Users,
} from "lucide-react";

import { UserCertificatesTable } from "@/components/users/user-certificates-table";
import { UserMetricCard } from "@/components/users/user-metric-card";
import { UserProfileInfo } from "@/components/users/user-profile-info";
import type { CertificateRecord, UserRecord } from "@/data/users";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { userService } from "@/services/user.service";

type UserDetailViewProps = {
  userId: string;
};

export function UserDetailView({ userId }: UserDetailViewProps) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      userService.getUserById(userId),
      userService.getUserCertificates(userId)
    ])
      .then(([apiUser, certsData]) => {
        if (cancelled) return;

        // Log the certificates data for the user to see the keys
        console.log("Certificates API Response:", certsData);

        // Map ApiUser to UserRecord for compatibility with existing UI
        const mappedUser: UserRecord = {
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
        };
        setUser(mappedUser);

        // Set certificates state (we'll map it properly once we know the keys)
        // Currently setting as empty or mapping if it looks like an array
        const certArray = Array.isArray(certsData?.data) ? certsData.data : (Array.isArray(certsData) ? certsData : []);
        setCertificates(certArray as any[]);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error(error);
        toast.error("Failed to fetch user details");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return <div className="p-8 text-center">Loading user details...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">User not found</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-[22px] font-bold tracking-tight text-[#111827] transition hover:text-[#3b82f6]"
        >
          <ArrowLeft className="size-5" />
          User Detail
        </Link>
        <span className="hidden h-6 w-px bg-[#d1d5db] sm:block" />
        <span className="rounded-full bg-[#111827] px-3.5 py-1.5 text-sm font-semibold text-white">
          {user.name}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UserMetricCard
          label="Quizzes Attempt"
          value={String(user.quizzesTaken)}
          icon={FileText}
          iconWrapClassName="bg-[#fef3c7]"
          iconClassName="text-[#d97706]"
        />
        <UserMetricCard
          label="Coins Earned"
          value={String(user.coinsEarned)}
          icon={Coins}
          iconWrapClassName="bg-[#ffedd5]"
          iconClassName="text-[#ea580c]"
        />
        <UserMetricCard
          label="Certificates Earned"
          value={String(user.certificates)}
          icon={Award}
          iconWrapClassName="bg-[#dcfce7]"
          iconClassName="text-[#16a34a]"
        />
        <UserMetricCard
          label="Successful Referrals"
          value={String(user.total_successful_referral)}
          icon={Users}
          iconWrapClassName="bg-[#dbeafe]"
          iconClassName="text-[#2563eb]"
        />
      </div>

      <UserProfileInfo user={user} readonly />
      <UserCertificatesTable certificates={certificates} />

      {/* <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#f0a500] px-8 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          Save Changes
        </button>
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#e5e7eb] px-8 text-sm font-semibold text-[#374151] transition hover:bg-[#d1d5db]"
        >
          Delete Account
        </button>
      </div> */}
    </div>
  );
}
