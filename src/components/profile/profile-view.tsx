"use client";

import { useState } from "react";

import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { PersonalInformationForm } from "@/components/profile/personal-information-form";
import { ProfileTabs } from "@/components/profile/profile-tabs";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState<"personal" | "password">(
    "personal"
  );

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-9">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-[30px] font-bold tracking-tight text-[#111111]">
          Profile
        </h1>
        <span className="hidden h-8 w-px bg-[#d1d5db] sm:block" aria-hidden />
        <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === "personal" ? (
        <PersonalInformationForm />
      ) : (
        <ChangePasswordForm />
      )}
    </div>
  );
}
