"use client";

import Image from "next/image";
import { CalendarDays, Camera, ChevronDown } from "lucide-react";

import { SearchableSelect } from "@/components/common/searchable-select";
import type { SelectOption } from "@/hooks/locations/use-country-state-city";
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

// Wrapper so ProfileField's <label> doesn't capture click events for the custom select
function SelectField({ label, required, children }: ProfileFieldProps) {
  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-[#374151]">
        {label}
        {required ? <span className="ml-0.5 text-[#ef4444]">*</span> : null}
      </span>
      {children}
    </div>
  );
}

const inputClassName =
  "h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] outline-none transition focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20";

const readOnlyClassName =
  "h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] cursor-default";

// Makes SearchableSelect buttons visually match the rest of the form inputs
const selectClassName =
  "[&_button]:h-11 [&_button]:rounded-xl [&_button]:border-[#e5e7eb] [&_button]:bg-[#f8fafc] [&_button]:shadow-none [&_button]:text-sm [&_button]:font-medium [&_button]:text-[#111827]";

type LocationProps = {
  countryId: number | null;
  stateId: number | null;
  cityId: number | null;
  countryOptions: SelectOption[];
  stateOptions: SelectOption[];
  cityOptions: SelectOption[];
  isCountriesLoading: boolean;
  isStatesLoading: boolean;
  isCitiesLoading: boolean;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  countryFallbackLabel?: string;
};

type UserProfileInfoProps = {
  user: UserRecord;
  readonly?: boolean;
  /** Pass this to enable API-driven country/state/city dropdowns on the edit form */
  location?: LocationProps;
};

export function UserProfileInfo({ user, readonly = false, location }: UserProfileInfoProps) {
  const showDropdowns = !readonly && !!location;

  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
      <h2 className="text-lg font-bold text-[#111827]">Profile Info</h2>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative size-[88px] shrink-0">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={88}
              height={88}
              className="size-[88px] rounded-full object-cover"
            />
          ) : (
            <div className="flex size-[88px] items-center justify-center rounded-full bg-gray-200 text-3xl font-semibold text-gray-500">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          {readonly ? null : (
            <label
              aria-label="Change profile photo"
              className="absolute right-0 bottom-0 flex size-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#111827] text-white shadow-sm"
            >
              <Camera className="size-3.5" />
              <input type="file" name="image" accept="image/*" className="hidden" />
            </label>
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
        {/* Full Name */}
        <ProfileField label="Full Name" required>
          {readonly ? (
            <input type="text" value={user.name} readOnly className={readOnlyClassName} />
          ) : (
            <input type="text" name="username" defaultValue={user.name} className={inputClassName} />
          )}
        </ProfileField>

        {/* Email */}
        <ProfileField label="Email Address" required>
          {readonly ? (
            <input type="email" value={user.email} readOnly className={readOnlyClassName} />
          ) : (
            <input type="email" name="email" defaultValue={user.email} className={inputClassName} />
          )}
        </ProfileField>

        {/* Phone */}
        <ProfileField label="Phone">
          {readonly ? (
            <input type="text" value={user.phone} readOnly className={readOnlyClassName} />
          ) : (
            <input type="text" name="phone" defaultValue={user.phone} className={inputClassName} />
          )}
        </ProfileField>

        {/* Country */}
        {showDropdowns ? (
          <SelectField label="Country" required>
            <SearchableSelect
              value={location.countryId ? String(location.countryId) : ""}
              options={location.countryOptions}
              fallbackLabel={location.countryFallbackLabel ?? user.country}
              placeholder="Select country"
              loading={location.isCountriesLoading}
              loadingText="Loading countries..."
              emptyText="No countries found"
              onChange={location.onCountryChange}
              className={selectClassName}
            />
          </SelectField>
        ) : (
          <ProfileField label="Country" required>
            <input
              type="text"
              value={user.country}
              readOnly={readonly}
              {...(!readonly && { name: "country", defaultValue: user.country })}
              className={readonly ? readOnlyClassName : inputClassName}
            />
          </ProfileField>
        )}

        {/* State */}
        {showDropdowns ? (
          <SelectField label="State/Province" required>
            <SearchableSelect
              value={location.stateId ? String(location.stateId) : ""}
              options={location.stateOptions}
              placeholder={location.countryId ? "Select state" : "Select country first"}
              loading={location.isStatesLoading}
              loadingText="Loading states..."
              emptyText="No states found"
              disabled={!location.countryId}
              onChange={location.onStateChange}
              className={selectClassName}
            />
          </SelectField>
        ) : (
          <ProfileField label="State/Province" required>
            <input
              type="text"
              value={user.state}
              readOnly={readonly}
              {...(!readonly && { name: "state", defaultValue: user.state })}
              className={readonly ? readOnlyClassName : inputClassName}
            />
          </ProfileField>
        )}

        {/* City */}
        {showDropdowns ? (
          <SelectField label="City" required>
            <SearchableSelect
              value={location.cityId ? String(location.cityId) : ""}
              options={location.cityOptions}
              placeholder={location.stateId ? "Select city" : "Select state first"}
              loading={location.isCitiesLoading}
              loadingText="Loading cities..."
              emptyText="No cities found"
              disabled={!location.stateId}
              onChange={location.onCityChange}
              className={selectClassName}
            />
          </SelectField>
        ) : (
          <ProfileField label="City" required>
            <input
              type="text"
              value={user.city}
              readOnly={readonly}
              {...(!readonly && { name: "city", defaultValue: user.city })}
              className={readonly ? readOnlyClassName : inputClassName}
            />
          </ProfileField>
        )}

        {/* Identification No */}
        <ProfileField label="Identification No">
          {readonly ? (
            <input type="text" value={user.identificationNo} readOnly className={readOnlyClassName} />
          ) : (
            <input type="text" name="ID_number" defaultValue={user.identificationNo} className={inputClassName} />
          )}
        </ProfileField>

        {/* Highest Education */}
        <ProfileField label="Highest Education">
          {readonly ? (
            <div className="relative">
              <input type="text" value={user.highestEducation} readOnly className={cn(readOnlyClassName, "pr-10")} />
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          ) : (
            <div className="relative">
              <select
                name="educationlevel"
                defaultValue={user.highestEducation}
                className={cn(inputClassName, "appearance-none pr-10")}
              >
                <option value="no_formal_education">No Formal Education</option>
                <option value="elementary">Elementary</option>
                <option value="high_school">High School</option>
                <option value="vocational_trade">Vocational Trade</option>
                <option value="college_diploma">College Diploma</option>
                <option value="associate_degree">Associate Degree</option>
                <option value="bachelors_degree">Bachelor's Degree</option>
                <option value="graduate_certificate">Graduate Certificate</option>
                <option value="masters_degree">Master's Degree</option>
                <option value="professional_degree">Professional Degree</option>
                <option value="doctoral_degree">Doctoral Degree</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          )}
        </ProfileField>

        {/* Level */}
        <ProfileField label="Level">
          {readonly ? (
            <div className="relative">
              <input type="text" value={user.level} readOnly className={cn(readOnlyClassName, "pr-10")} />
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          ) : (
            <div className="relative">
              <select
                name="skill_level"
                defaultValue={user.level}
                className={cn(inputClassName, "appearance-none pr-10")}
              >
                <option value="student">Student</option>
                <option value="professional">Professional</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          )}
        </ProfileField>

        {/* Date Of Birth */}
        <ProfileField label="Date Of Birth">
          {readonly ? (
            <div className="relative">
              <input type="text" value={user.dateOfBirth} readOnly className={cn(readOnlyClassName, "pr-10")} />
              <CalendarDays className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                name="dob"
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
      </div>
    </section>
  );
}
