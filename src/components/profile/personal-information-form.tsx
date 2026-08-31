"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, UserRound } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Value } from "react-phone-number-input";

import { SearchableSelect } from "@/components/common/searchable-select";
import { TextField } from "@/components/ui/text-field";
import { CustomPhoneNumber } from "@/components/ui/phone-field";
import { useProfile } from "@/hooks/profile/use-profile";
import { useCountryStateCity } from "@/hooks/locations/use-country-state-city";
import { cn } from "@/lib/utils";
import {
  profileSchema,
  type ProfileFormInput,
  type ProfileFormOutput,
} from "@/schemas/profile.schema";
import type { ProfileDetail, ProfileInfo, UpdateProfilePayload } from "@/types/profile.types";

const inputClassName = "text-[#4b5563] placeholder:text-[#b0b0b0]";
const readOnlyClassName = "cursor-default bg-white text-[#4b5563]";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="col-span-full text-[16px] font-bold text-[#111111]">
      {children}
    </h2>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-[10px] block text-[14px] font-medium text-[#111111]">
      {children}
      {required ? <span className="ml-0.5 text-[#ff0000]">*</span> : null}
    </label>
  );
}

function toFormString(value: string | number | null | undefined): string {
  if (value == null) return "";
  return String(value);
}

function resolveLocationId(
  detailId: number | null | undefined,
  refId: number | null | undefined,
): string {
  const id = detailId ?? refId;
  return id ? String(id) : "";
}

function buildProfileFormValues(
  info: ProfileInfo | null,
  detail: ProfileDetail | null,
): ProfileFormInput {
  return {
    fullName: info?.username ?? detail?.username ?? "",
    email: info?.email ?? detail?.email ?? "",
    phone: detail?.phone ?? "",
    country: resolveLocationId(detail?.country_id, info?.country?.id),
    state: resolveLocationId(detail?.state_id, info?.state?.id),
    city: resolveLocationId(detail?.city_id, info?.city?.id),
    postalCode: toFormString(detail?.postal_code),
    address: detail?.summary ?? "",
  };
}

function toPostalCodePayload(value: string): string | number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const numeric = Number(trimmed);
  return Number.isFinite(numeric) ? numeric : trimmed;
}

export function PersonalInformationForm() {
  const { info, detail, loading, mutating, error, updateProfile } = useProfile();

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [xProfile, setXProfile] = useState("");
  const [instagram, setInstagram] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormInput, unknown, ProfileFormOutput>({
    resolver: zodResolver(profileSchema),
    defaultValues: buildProfileFormValues(info, detail),
  });

  const {
    countryId,
    stateId,
    setCountryId,
    setStateId,
    setCityId,
    countryOptions,
    stateOptions,
    cityOptions,
    isCountriesLoading,
    isStatesLoading,
    isCitiesLoading,
  } = useCountryStateCity({
    initialCountryId: detail?.country_id ?? info?.country?.id ?? null,
    initialStateId: detail?.state_id ?? info?.state?.id ?? null,
    initialCityId: detail?.city_id ?? info?.city?.id ?? null,
    onStateResolved: (resolvedStateId) => {
      setValue("state", String(resolvedStateId), { shouldValidate: true });
    },
  });

  useEffect(() => {
    if (!image && info?.image_url) {
      setPreviewUrl(info.image_url);
    }
  }, [info?.image_url, image]);

  useEffect(() => {
    if (!info && !detail) return;
    reset(buildProfileFormValues(info, detail));
    // Populate social media fields from detail
    setFacebook(detail?.facebook ?? "");
    setLinkedin(detail?.linkedin ?? "");
    setXProfile(detail?.x ?? "");
    setInstagram(detail?.instagram ?? "");
  }, [info, detail, reset]);

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const selectedCity = watch("city");
  const fullName = watch("fullName");
  
  // Track social media changes
  const socialMediaChanged =
    facebook !== (detail?.facebook ?? "") ||
    linkedin !== (detail?.linkedin ?? "") ||
    xProfile !== (detail?.x ?? "") ||
    instagram !== (detail?.instagram ?? "");
  
  const hasChanges = isDirty || image !== null || socialMediaChanged;

  useEffect(() => {
    if (isDirty || (!info && !detail)) return;
    const nextState = resolveLocationId(detail?.state_id, info?.state?.id);
    const nextCity = resolveLocationId(detail?.city_id, info?.city?.id);
    if (nextState && selectedState !== nextState) {
      setValue("state", nextState);
      setStateId(Number(nextState));
    }
    if (nextCity && selectedCity !== nextCity) {
      setValue("city", nextCity);
      setCityId(Number(nextCity));
    }
  }, [
    detail,
    info,
    isDirty,
    selectedState,
    selectedCity,
    setValue,
    setStateId,
    setCityId,
  ]);

  const countryFallbackLabel = info?.country?.name ?? detail?.country?.name ?? "";
  const stateFallbackLabel =
    info?.state?.name ??
    detail?.state?.name ??
    stateOptions.find((option) => option.value === selectedState)?.label ??
    stateOptions.find((option) => option.value === String(stateId))?.label ??
    "";
  const cityFallbackLabel = info?.city?.name ?? detail?.city?.name ?? "";

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (previewUrl && previewUrl !== info?.image_url) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(file ? URL.createObjectURL(file) : (info?.image_url ?? ""));
  }

  const handleCountryChange = (value: string) => {
    setValue("country", value, { shouldValidate: true, shouldDirty: true });
    const numericId = Number(value);
    setCountryId(Number.isFinite(numericId) ? numericId : null);
    setValue("state", "", { shouldValidate: true, shouldDirty: true });
    setValue("city", "", { shouldValidate: true, shouldDirty: true });
  };

  const handleStateChange = (value: string) => {
    setValue("state", value, { shouldValidate: true, shouldDirty: true });
    const numericId = Number(value);
    setStateId(Number.isFinite(numericId) ? numericId : null);
    setValue("city", "", { shouldValidate: true, shouldDirty: true });
    setCityId(null);
  };

  const handleCityChange = (value: string) => {
    setValue("city", value, { shouldValidate: true, shouldDirty: true });
    const numericId = Number(value);
    setCityId(Number.isFinite(numericId) ? numericId : null);
  };

  async function onSubmit(data: ProfileFormOutput) {
    const payload: UpdateProfilePayload = {
      data: {
        phone: data.phone.trim(),
        country_id: data.country ? Number(data.country) : null,
        state_id: data.state ? Number(data.state) : null,
        city_id: data.city ? Number(data.city) : null,
        postal_code: toPostalCodePayload(data.postalCode),
        summary: data.address?.trim() || "",
        gender: detail?.gender ?? null,
        dob: detail?.dob ?? "",
        ID_number: detail?.ID_number ?? "",
        skill_level: detail?.skill_level ?? null,
        educationlevel: detail?.educationlevel ?? null,
        designation: detail?.designation ?? info?.designation ?? "",
        // Social media links
        facebook: facebook?.trim() || null,
        linkedin: linkedin?.trim() || null,
        x: xProfile?.trim() || null,
        instagram: instagram?.trim() || null,
      },
    };

    const success = await updateProfile(payload, image ?? null);
    if (success) {
      setImage(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-[#2563eb]" />
        <span className="ml-2 text-sm text-[#6b7280]">Loading profile...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 pb-8">
      <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div className="relative size-[110px] shrink-0">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={fullName || "Profile"}
              width={110}
              height={110}
              className="size-[110px] rounded-full object-cover"
            />
          ) : (
            <div className="flex size-[110px] items-center justify-center rounded-full bg-[#eef5ff] text-[#2563eb]">
              <UserRound className="size-10" />
            </div>
          )}
          <label
            aria-label="Change profile photo"
            className="absolute right-1 bottom-1 flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#1a1a1a] text-white shadow-sm transition hover:bg-[#111827]"
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
        <div className="text-left">
          <h2 className="text-left text-[22px] font-bold text-[#1e3a8a]">
            {fullName || "Admin"}
          </h2>
          <p className="mt-1.5 text-[13px] text-[#9ca3af]">
            Supported Formats: PNG, JPG, JPEG. Max File Size: 2 MB.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#ef4444]">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <TextField
          label="Full Name"
          required
          readOnly
          inputClassName={readOnlyClassName}
          {...register("fullName")}
        />
        <TextField
          label="Email Address"
          required
          type="email"
          readOnly
          inputClassName={readOnlyClassName}
          {...register("email")}
        />

        <div>
          <FieldLabel required>Phone No</FieldLabel>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <CustomPhoneNumber
                value={field.value as Value | undefined}
                onChange={(value) => field.onChange(value ?? "")}
                defaultCountry="PK"
                placeholder="Enter phone number"
                error={Boolean(errors.phone)}
              />
            )}
          />
          {errors.phone ? (
            <p className="mt-1 text-xs text-[#ef4444]">{errors.phone.message}</p>
          ) : null}
        </div>
        <div className="hidden md:block" aria-hidden />

        <SectionTitle>Personal Address</SectionTitle>

        <div>
          <FieldLabel required>Country Or Region</FieldLabel>
          <SearchableSelect
            value={selectedCountry ?? ""}
            options={countryOptions}
            fallbackLabel={countryFallbackLabel}
            placeholder="Select country"
            loading={isCountriesLoading}
            loadingText="Loading countries..."
            emptyText="No countries found"
            onChange={handleCountryChange}
          />
          {errors.country ? (
            <p className="mt-1 text-xs text-[#ef4444]">{errors.country.message}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel>State / Province</FieldLabel>
          <SearchableSelect
            value={selectedState ?? ""}
            options={stateOptions}
            fallbackLabel={stateFallbackLabel}
            placeholder={countryId ? "Select state" : "Select country first"}
            disabled={!countryId}
            loading={isStatesLoading}
            loadingText="Loading states..."
            emptyText={countryId ? "No states found" : "Select country first"}
            onChange={handleStateChange}
          />
          {errors.state ? (
            <p className="mt-1 text-xs text-[#ef4444]">{errors.state.message}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel required>City</FieldLabel>
          <SearchableSelect
            value={selectedCity ?? ""}
            options={cityOptions}
            fallbackLabel={cityFallbackLabel}
            placeholder={
              selectedState || selectedCity
                ? isCitiesLoading
                  ? "Loading cities..."
                  : "Select city"
                : "Select state first"
            }
            disabled={(!selectedState && !selectedCity) || isCitiesLoading}
            loading={isCitiesLoading}
            loadingText="Loading cities..."
            emptyText={
              selectedState || selectedCity ? "No cities found" : "Select state first"
            }
            onChange={handleCityChange}
          />
          {errors.city ? (
            <p className="mt-1 text-xs text-[#ef4444]">{errors.city.message}</p>
          ) : null}
        </div>

        <div className="hidden md:block" aria-hidden />

        <TextField
          label="Address"
          placeholder="Address"
          inputClassName={inputClassName}
          {...register("address")}
        />

        <div>
          <TextField
            label="Postal Code"
            required
            placeholder="Postal Code"
            inputClassName={inputClassName}
            {...register("postalCode")}
          />
          {errors.postalCode ? (
            <p className="mt-1 text-xs text-[#ef4444]">
              {errors.postalCode.message}
            </p>
          ) : null}
        </div>

        <SectionTitle>Social Information</SectionTitle>

        <TextField
          label="Facebook"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          placeholder="Facebook"
          inputClassName={inputClassName}
        />
        <TextField
          label="X"
          value={xProfile}
          onChange={(e) => setXProfile(e.target.value)}
          placeholder="X"
          inputClassName={inputClassName}
        />
        <TextField
          label="Linkedin"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="Linkedin"
          inputClassName={inputClassName}
        />
        <TextField
          label="Instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="Instagram"
          inputClassName={inputClassName}
        />
      </div>

      <button
        type="submit"
        disabled={mutating || !hasChanges}
        className={cn(
          "inline-flex h-12 min-w-[168px] items-center justify-center gap-2 rounded-full bg-[#e89b1e] px-8 text-[15px] font-semibold text-white transition hover:bg-[#d18b15] disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {mutating ? <Loader2 className="size-4 animate-spin" /> : null}
        {mutating ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
