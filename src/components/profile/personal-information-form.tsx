"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Loader2, UserRound } from "lucide-react";

import { useProfile } from "@/hooks/profile/use-profile";

function ProfileField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
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

const fieldInputClassName =
  "h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-3.5 text-sm font-medium text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#3b82f6] focus:ring-0";

const readOnlyInputClassName =
  "h-11 w-full cursor-default rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827]";

export function PersonalInformationForm() {
  const { info, detail, loading, mutating, error, updateProfile } = useProfile();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryName, setCountryName] = useState("");
  const [cityName, setCityName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [prevDataKey, setPrevDataKey] = useState("");

  const dataKey = `${info?.id ?? ""}:${detail?.id ?? ""}`;
  if (dataKey !== prevDataKey) {
    setPrevDataKey(dataKey);
    if (info) {
      setFullName(info.username ?? "");
      setEmail(info.email ?? "");
      setCountryName(info.country?.name ?? "");
      setPreviewUrl(info.image_url ?? "");
    }
    if (detail) {
      setPhone(detail.phone ?? "");
      setCityName(detail.city ?? "");
      setPostalCode(detail.postal_code ?? "");
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (previewUrl && previewUrl !== info?.image_url) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(file ? URL.createObjectURL(file) : (info?.image_url ?? ""));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = {
      phone: phone.trim() || undefined,
      postal_code: postalCode.trim() || undefined,
      country_id: info?.country?.id ?? detail?.country_id ?? undefined,
      city_id: detail?.city_id ?? undefined,
    };
    const success = await updateProfile(payload, image ?? null);
    if (success) {
      setImage(null);
      setPreviewUrl(info?.image_url ?? "");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-[#e8ecf2] bg-white py-20">
        <Loader2 className="size-6 animate-spin text-[#2563eb]" />
        <span className="ml-2 text-sm text-[#6b7280]">Loading profile...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative size-27.5 shrink-0">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={fullName || "Profile"}
              width={110}
              height={110}
              className="size-27.5 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-27.5 items-center justify-center rounded-full bg-[#eef5ff] text-[#2563eb]">
              <UserRound className="size-10" />
            </div>
          )}
          <label
            aria-label="Change profile photo"
            className="absolute right-0.5 bottom-0.5 flex size-8 cursor-pointer items-center justify-center rounded-full border-[3px] border-white bg-[#1a1a1a] text-white shadow-sm transition hover:bg-[#111827]"
          >
            <Camera className="size-3.5" />
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div>
          <h2 className="text-[22px] font-bold text-[#1e40af]">
            {fullName || "Admin"}
          </h2>
          <p className="mt-1.5 text-[13px] text-[#9ca3af]">
            Supported Formats: PNG, JPG, JPEG. Max File Size: 2 MB.
          </p>
          {image ? (
            <p className="mt-1.5 text-[13px] font-medium text-[#16a34a]">
              New image selected — will upload on save.
            </p>
          ) : null}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#ef4444]">
          {error}
        </div>
      )}

      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        <ProfileField label="Full Name">
          <input
            value={fullName}
            readOnly
            className={readOnlyInputClassName}
          />
        </ProfileField>
        <ProfileField label="Email Address">
          <input value={email} readOnly className={readOnlyInputClassName} />
        </ProfileField>
        <ProfileField label="Phone No">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className={fieldInputClassName}
          />
        </ProfileField>
        <ProfileField label="Country Or Region">
          <input
            value={countryName}
            readOnly
            placeholder="Country Or Region"
            className={readOnlyInputClassName}
          />
        </ProfileField>
        <ProfileField label="City">
          <input
            value={cityName}
            readOnly
            placeholder="City"
            className={readOnlyInputClassName}
          />
        </ProfileField>
        <ProfileField label="Postal Code">
          <input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Postal Code"
            className={fieldInputClassName}
          />
        </ProfileField>
      </div>

      <button
        type="submit"
        disabled={mutating}
        className="inline-flex h-12 min-w-42 items-center justify-center gap-2 rounded-full bg-[#e89b1e] px-8 text-[15px] font-semibold text-white transition hover:bg-[#d18b15] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutating ? <Loader2 className="size-4 animate-spin" /> : null}
        {mutating ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}