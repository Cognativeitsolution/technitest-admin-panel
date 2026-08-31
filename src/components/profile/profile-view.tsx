"use client";

import { useState } from "react";

import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { PersonalInformationForm } from "@/components/profile/personal-information-form";
import { SocialMediaDisplay } from "@/components/profile/social-media-display";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { useProfile } from "@/hooks/profile/use-profile";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState<"personal" | "password">(
    "personal",
  );
  const { detail } = useProfile();

  return (
    <div className="w-full max-w-4xl space-y-10">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-[30px] font-bold tracking-tight text-[#111111]">
          Profile
        </h1>
        <span className="hidden h-8 w-px bg-[#d1d5db] sm:block" aria-hidden />
        <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === "personal" ? (
        <>
          <PersonalInformationForm />
          {detail && <SocialMediaDisplay profile={detail} className="mt-8 p-6 border border-[#e5e7eb] rounded-lg" />}
        </>
      ) : (
        <ChangePasswordForm />
      )}
    </div>
  );
}
