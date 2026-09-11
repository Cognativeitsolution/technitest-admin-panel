import type { ApiUser } from "@/types/user.types";

export function buildUserUpdateFormData(
  user: ApiUser,
  overrides: Partial<{ role_id: number }> = {},
) {
  const formData = new FormData();

  formData.append(
    "data",
    JSON.stringify({
      username: user.username,
      phone: user.phone || "",
      ID_number: user.ID_number || "",
      educationlevel: user.educationlevel || "",
      skill_level: user.skill_level || "",
      dob: user.dob || "",
      postal_code: user.postal_code ?? 0,
      gender: user.gender || "male",
      role_id: overrides.role_id,
      country_id: user.country_id ?? null,
      state_id: user.state_id ?? null,
      city_id: user.city_id ?? null,
      summary: user.summary || "",
      designation: user.designation || "",
    }),
  );

  return formData;
}
