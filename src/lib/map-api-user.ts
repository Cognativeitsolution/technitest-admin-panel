import type { UserRecord } from "@/data/users";
import type { ApiUser } from "@/types/user.types";

export function mapApiUserToUserRecord(user: ApiUser): UserRecord {
  return {
    id: String(user.id),
    name: user.username,
    username: user.username,
    email: user.email,
    phone: user.phone ?? "-",
    country: user.country?.name ?? "-",
    quizzesTaken: user.total_quizzes_attempted ?? 0,
    certificates: user.total_certificates_issued ?? 0,
    avatar: user.avatar_url ?? "",
    state: "",
    city: "",
    identificationNo: "",
    highestEducation: "",
    level: "",
    dateOfBirth: "",
    coinsEarned: 0,
    successfulReferrals: 0,
    emailVerified: user.is_email_verified,
    mobileVerified: false,
  };
}

export function mapApiUsersToUserRecords(users: ApiUser[]): UserRecord[] {
  return users.map(mapApiUserToUserRecord);
}
