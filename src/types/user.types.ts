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
  phone: string | null;
  avatar_url: string | null;
  country_id: number | null;
  country: {
    id: number;
    name: string;
    iso2: string;
  } | null;
  total_quizzes_attempted: number | string;
  total_certificates_issued: number | string;
  total_successful_referral?: number | string;
  total_earned_coin?: number | string;
};
