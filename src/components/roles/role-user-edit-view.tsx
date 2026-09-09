"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { UserProfileInfo } from "@/components/users/user-profile-info";
import { useCountryStateCity } from "@/hooks/locations/use-country-state-city";
import { roleService } from "@/services/role.service";
import { userService } from "@/services/user.service";
import type { UserRecord } from "@/data/users";

type Props = {
  roleSlug: string;
  userId: string;
};

export function RoleUserEditView({ roleSlug, userId }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialCountryId, setInitialCountryId] = useState<number | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);

  const {
    countryId, stateId, cityId,
    setCountryId, setStateId, setCityId,
    countryOptions, stateOptions, cityOptions,
    isCountriesLoading, isStatesLoading, isCitiesLoading,
  } = useCountryStateCity({ initialCountryId });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      userService.getUserById(userId),
      roleService.getRoles(),
    ])
      .then(([apiUser, roles]) => {
        if (cancelled) return;

        // Resolve the role_id from the slug so the update payload is correct
        const matchedRole = roles.find((r) => r.slug === roleSlug);
        if (matchedRole) setRoleId(matchedRole.id);

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

        if (apiUser.country_id) setInitialCountryId(apiUser.country_id);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to fetch user details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const dataObj = {
      username: formData.get("username") as string,
      phone: formData.get("phone") as string,
      ID_number: formData.get("ID_number") as string,
      educationlevel: formData.get("educationlevel") as string,
      skill_level: formData.get("skill_level") as string,
      dob: formData.get("dob") as string,
      postal_code: 0,
      gender: "male",
      role_id: roleId ?? 2,
      country_id: countryId ?? null,
      state_id: stateId ?? null,
      city_id: cityId ?? null,
      summary: "",
      designation: "",
    };

    const apiFormData = new FormData();
    apiFormData.append("data", JSON.stringify(dataObj));
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) apiFormData.append("image", imageFile);

    try {
      setSubmitting(true);
      await userService.updateUser(userId, apiFormData);
      toast.success("User updated successfully");
      router.push(`/roles/${roleSlug}`);
    } catch {
      toast.error("Failed to update user");
    } finally {
      setSubmitting(false);
    }
  }

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
          Edit User
        </span>
        <span className="hidden h-6 w-px bg-[#d1d5db] sm:block" />
        <span className="rounded-full bg-[#111827] px-3.5 py-1.5 text-sm font-semibold text-white">
          {user.name}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <UserProfileInfo
          user={user}
          readonly={false}
          hideExtraFields
          location={{
            countryId,
            stateId,
            cityId,
            countryOptions,
            stateOptions,
            cityOptions,
            isCountriesLoading,
            isStatesLoading,
            isCitiesLoading,
            onCountryChange: (v) => {
              const n = Number(v);
              setCountryId(Number.isFinite(n) && n > 0 ? n : null);
            },
            onStateChange: (v) => {
              const n = Number(v);
              setStateId(Number.isFinite(n) && n > 0 ? n : null);
            },
            onCityChange: (v) => {
              const n = Number(v);
              setCityId(Number.isFinite(n) && n > 0 ? n : null);
            },
            countryFallbackLabel: user.country,
          }}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#f0a500] px-8 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href={`/roles/${roleSlug}`}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#e5e7eb] px-8 text-sm font-semibold text-[#374151] transition hover:bg-[#d1d5db]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
