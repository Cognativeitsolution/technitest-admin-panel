"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useCountryStateCity } from "@/hooks/locations/use-country-state-city";
import type { CertificateRecord, UserRecord } from "@/data/users";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { roleService } from "@/services/role.service";
import { userService } from "@/services/user.service";
import { ApiError } from "@/lib/api-error";

type UserEditViewProps = {
  userId: string;
};

export function UserEditView({ userId }: UserEditViewProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [roleId, setRoleId] = useState<number>(2);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialCountryId, setInitialCountryId] = useState<number | null>(null);
  const [initialStateId, setInitialStateId] = useState<number | null>(null);
  const [initialCityId, setInitialCityId] = useState<number | null>(null);

  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);

  const {
    countryId,
    stateId,
    cityId,
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
    initialCountryId,
    initialStateId,
    initialCityId,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      userService.getUserById(userId),
      userService.getUserCertificates(userId),
      roleService.getRoles(),
    ])
      .then(([fetchedUser, certsData, roles]) => {
        if (cancelled) return;

        const matchedRole = roles.find((role) => role.slug === fetchedUser.roles?.[0]);
        if (matchedRole) {
          setRoleId(matchedRole.id);
        }

        const mappedUser: UserRecord = {
          id: String(fetchedUser.id),
          name: fetchedUser.username,
          username: fetchedUser.username,
          email: fetchedUser.email,
          phone: fetchedUser.phone || "",
          country: fetchedUser.country?.name || "",
          quizzesTaken: fetchedUser.total_quizzes_attempted ?? "-",
          certificates: fetchedUser.total_certificates_issued ?? "-",
          avatar: fetchedUser.avatar_url || "",
          state: fetchedUser.state?.name || "",
          city: fetchedUser.city?.name || "",
          identificationNo: fetchedUser.ID_number || "",
          highestEducation: fetchedUser.educationlevel || "",
          level: fetchedUser.skill_level || "",
          dateOfBirth: fetchedUser.dob || "",
          coinsEarned: fetchedUser.total_earned_coin ?? "-",
          total_successful_referral: fetchedUser.total_successful_referral ?? "-",
          emailVerified: fetchedUser.is_email_verified,
          mobileVerified: false,
        };
        setUser(mappedUser);

        if (fetchedUser.country_id) {
          setInitialCountryId(fetchedUser.country_id);
        }
        if (fetchedUser.state_id) {
          setInitialStateId(fetchedUser.state_id);
        }
        if (fetchedUser.city_id) {
          setInitialCityId(fetchedUser.city_id);
        }

        let certsList = [];
        if (Array.isArray(certsData?.items)) {
          certsList = certsData.items;
        } else if (Array.isArray(certsData?.data)) {
          certsList = certsData.data;
        } else if (Array.isArray(certsData)) {
          certsList = certsData;
        }

        setCertificates(
          certsList.map((cert: CertificateRecord & { certificate_number?: string; quiz_title?: string; percentage?: number; issued_at?: string; quiz_attempt_id?: number }) => ({
            id: String(cert.id),
            certificate: cert.certificate_number || cert.certificate || "Certificate",
            issuedFor: cert.quiz_title || cert.issuedFor || "-",
            score: cert.percentage !== undefined ? `${cert.percentage}%` : cert.score || "-",
            issuedOn: cert.issued_at
              ? new Date(cert.issued_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : cert.issuedOn || "-",
            quizAttemptId: cert.quiz_attempt_id ?? cert.quizAttemptId,
          })),
        );
      })
      .catch((error) => {
        if (cancelled) return;
        console.error(error);
        toast.error(ApiError.fromAxiosError(error).message || "Failed to fetch user details");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleCountryChange = (value: string) => {
    const numericId = Number(value);
    setCountryId(Number.isFinite(numericId) && numericId > 0 ? numericId : null);
  };

  const handleStateChange = (value: string) => {
    const numericId = Number(value);
    setStateId(Number.isFinite(numericId) && numericId > 0 ? numericId : null);
  };

  const handleCityChange = (value: string) => {
    const numericId = Number(value);
    setCityId(Number.isFinite(numericId) && numericId > 0 ? numericId : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const dataObj = {
      username: formData.get("username") as string,
      phone: formData.get("phone") as string,
      ID_number: formData.get("ID_number") as string,
      educationlevel: formData.get("educationlevel") as string,
      skill_level: formData.get("skill_level") as string,
      dob: formData.get("dob") as string,
      postal_code: Number(formData.get("postal_code") || 0),
      gender: (formData.get("gender") as string) || "male",
      role_id: roleId,
      country_id: countryId ?? null,
      state_id: stateId ?? null,
      city_id: cityId ?? null,
      summary: (formData.get("summary") as string) || "",
      designation: (formData.get("designation") as string) || "",
    };

    const apiFormData = new FormData();
    apiFormData.append("data", JSON.stringify(dataObj));

    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      apiFormData.append("image", imageFile);
    }

    try {
      setSubmitting(true);
      await userService.updateUser(userId, apiFormData);
      toast.success("User updated successfully");
      router.push("/users");
    } catch (error) {
      console.error(error);
      toast.error(ApiError.fromAxiosError(error).message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

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
          Edit User
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <UserProfileInfo
          user={user}
          readonly={false}
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
            onCountryChange: handleCountryChange,
            onStateChange: handleStateChange,
            onCityChange: handleCityChange,
            countryFallbackLabel: user.country,
          }}
        />
        <UserCertificatesTable certificates={certificates} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#f0a500] px-8 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href={`/users`}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#e5e7eb] px-8 text-sm font-semibold text-[#374151] transition hover:bg-[#d1d5db]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
