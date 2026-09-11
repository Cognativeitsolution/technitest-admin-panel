export type ApiUser = {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_email_verified: boolean;
  referral_code: string | null;
  roles: string[];
  permissions: string[];
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  phone: string | null;
  avatar_url: string | null;
  country_id: number | null;
  country: {
    id: number;
    name: string;
    iso2: string;
  } | null;
  state_id?: number | null;
  state?: {
    id: number;
    name: string;
    state_code?: string;
  } | null;
  city_id?: number | null;
  city?: {
    id: number;
    name: string;
  } | null;
  skill_level?: string | null;
  summary?: string | null;
  designation?: string | null;
  postal_code?: number | null;
  gender?: string | null;
  dob?: string | null;
  ID_number?: string | null;
  educationlevel?: string | null;
  total_quizzes_attempted: number | string;
  total_certificates_issued: number | string;
  total_successful_referral?: number | string;
  total_earned_coin?: number | string;
};
