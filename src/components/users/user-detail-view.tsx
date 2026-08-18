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

type UserDetailViewProps = {
  user: UserRecord;
  certificates: CertificateRecord[];
};

export function UserDetailView({ user, certificates }: UserDetailViewProps) {
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
          value={String(user.certificates).padStart(2, "0")}
          icon={Award}
          iconWrapClassName="bg-[#dcfce7]"
          iconClassName="text-[#16a34a]"
        />
        <UserMetricCard
          label="Successful Referrals"
          value={String(user.successfulReferrals)}
          icon={Users}
          iconWrapClassName="bg-[#dbeafe]"
          iconClassName="text-[#2563eb]"
        />
      </div>

      <UserProfileInfo user={user} readonly />
      <UserCertificatesTable certificates={certificates} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
      </div>
    </div>
  );
}
