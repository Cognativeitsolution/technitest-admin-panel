"use client";

import Image from "next/image";
import { CalendarDays, Camera, ChevronDown } from "lucide-react";

import type { UserRecord } from "@/data/users";
import { cn } from "@/lib/utils";

type ProfileFieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

function ProfileField({ label, required, children }: ProfileFieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[#374151]">
        {label}
        {required ? <span className="ml-0.5 text-[#ef4444]">*</span> : null}
      </span>
      {children}
    </label>
  );
}

const inputClassName =
  "h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] outline-none transition focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20";

const readOnlyClassName =
  "h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] cursor-default";

type UserProfileInfoProps = {
  user: UserRecord;
  readonly?: boolean;
};

export function UserProfileInfo({ user, readonly = false }: UserProfileInfoProps) {
  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
      <h2 className="text-lg font-bold text-[#111827]">Profile Info</h2>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative size-[88px] shrink-0">
          <Image
            src={user.avatar}
            alt={user.name}
            width={88}
            height={88}
            className="size-[88px] rounded-full object-cover"
          />
          {readonly ? null : (
            <button
              type="button"
              aria-label="Change profile photo"
              className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-[#111827] text-white shadow-sm"
            >
              <Camera className="size-3.5" />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-[#2563eb]">{user.name}</p>
          <p className="text-sm text-[#6b7280]">
            Supported Formats: PNG, JPG, JPEG. Max File Size: 2 MB.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Left column */}
        <ProfileField label="Full Name" required>
          {readonly ? (
            <input
              type="text"
              value={user.name}
              readOnly
              className={readOnlyClassName}
            />
          ) : (
            <input
              type="text"
              defaultValue={user.name}
              className={inputClassName}
            />
          )}
        </ProfileField>

        {/* Right column */}
        <ProfileField label="Email Address" required>
          {readonly ? (
            <input
              type="email"
              value={user.email}
              readOnly
              className={readOnlyClassName}
            />
          ) : (
            <input
              type="email"
              defaultValue={user.email}
              className={inputClassName}
            />
          )}
        </ProfileField>

        {/* Left column */}
        <ProfileField label="Phone">
          {readonly ? (
            <input
              type="text"
              value={user.phone}
              readOnly
              className={readOnlyClassName}
            />
          ) : (
            <input
              type="text"
              defaultValue={user.phone}
              className={inputClassName}
            />
          )}
        </ProfileField>

        {/* Right column */}
        <ProfileField label="Country" required>
          {readonly ? (
            <input
              type="text"
              value={user.country}
              readOnly
              className={readOnlyClassName}
            />
          ) : (
            <input
              type="text"
              defaultValue={user.country}
              className={inputClassName}
            />
          )}
        </ProfileField>

        {/* Left column */}
        <ProfileField label="State/Province" required>
          {readonly ? (
            <input
              type="text"
              value={user.state}
              readOnly
              className={readOnlyClassName}
            />
          ) : (
            <input
              type="text"
              defaultValue={user.state}
              className={inputClassName}
            />
          )}
        </ProfileField>

        {/* Right column */}
        <ProfileField label="City" required>
          {readonly ? (
            <input
              type="text"
              value={user.city}
              readOnly
              className={readOnlyClassName}
            />
          ) : (
            <input
              type="text"
              defaultValue={user.city}
              className={inputClassName}
            />
          )}
        </ProfileField>

        {/* Left column */}
        <ProfileField label="Identification No">
          {readonly ? (
            <input
              type="text"
              value={user.identificationNo}
              readOnly
              className={readOnlyClassName}
            />
          ) : (
            <input
              type="text"
              defaultValue={user.identificationNo}
              className={inputClassName}
            />
          )}
        </ProfileField>

        {/* Right column */}
        <ProfileField label="Highest Education">
          {readonly ? (
            <div className="relative">
              <input
                type="text"
                value={user.highestEducation}
                readOnly
                className={cn(readOnlyClassName, "pr-10")}
              />
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          ) : (
            <div className="relative">
              <select
                defaultValue={user.highestEducation}
                className={cn(inputClassName, "appearance-none pr-10")}
              >
                <option>Intermediate</option>
                <option>Bachelor</option>
                <option>Master</option>
                <option>PhD</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          )}
        </ProfileField>

        {/* Left column */}
        <ProfileField label="Level">
          {readonly ? (
            <div className="relative">
              <input
                type="text"
                value={user.level}
                readOnly
                className={cn(readOnlyClassName, "pr-10")}
              />
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          ) : (
            <div className="relative">
              <select
                defaultValue={user.level}
                className={cn(inputClassName, "appearance-none pr-10")}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          )}
        </ProfileField>

        {/* Right column */}
        <ProfileField label="Date Of Birth">
          {readonly ? (
            <div className="relative">
              <input
                type="text"
                value={user.dateOfBirth}
                readOnly
                className={cn(readOnlyClassName, "pr-10")}
              />
              <CalendarDays className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                defaultValue={user.dateOfBirth}
                className={cn(inputClassName, "pr-10")}
              />
              <CalendarDays className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          )}
        </ProfileField>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div>
          <p className="mb-1.5 text-sm font-medium text-[#374151]">
            Email Verification
          </p>
          <div
            className={cn(
              "flex h-11 items-center justify-center rounded-xl text-sm font-semibold text-white",
              user.emailVerified ? "bg-[#22c55e]" : "bg-[#ef4444]"
            )}
          >
            {user.emailVerified ? "Verified" : "Unverified"}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-[#374151]">
            Mobile Verification
          </p>
          <div
            className={cn(
              "flex h-11 items-center justify-center rounded-xl text-sm font-semibold text-white",
              user.mobileVerified ? "bg-[#22c55e]" : "bg-[#ef4444]"
            )}
          >
            {user.mobileVerified ? "Verified" : "Unverified"}
          </div>
        </div>
      </div>
    </section>
  );
}
