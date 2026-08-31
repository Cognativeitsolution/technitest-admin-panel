export type CountryRef = {
  id: number;
  name: string;
  iso2: string;
};

export type StateRef = {
  id: number;
  name: string;
  state_code?: string;
};

export type CityRef = {
  id: number;
  name: string;
};

export type ProfileInfo = {
  id: number | string;
  username: string;
  email: string;
  designation: string | null;
  image_url: string | null;
  country: CountryRef | null;
  state: StateRef | null;
  city: CityRef | null;
  referral_link: string | null;
  total_coins: number | null;
  remaining_balance: number | null;
};

export type ProfileSkillLevel =
  | "student"
  | "professional"
  | "beginner"
  | "intermediate"
  | "advanced"
  | string;

export type ProfileDetail = {
  id: number | string;
  username: string;
  email: string;
  phone: string | null;
  country_id: number | null;
  country: CountryRef | null;
  state_id: number | null;
  state: StateRef | null;
  city_id: number | null;
  city: CityRef | null;
  skill_level: ProfileSkillLevel | null;
  summary: string | null;
  designation: string | null;
  postal_code: string | number | null;
  gender: string | null;
  dob: string | null;
  ID_number: string | null;
  educationlevel: string | null;
  // Social Media Links
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  x?: string | null;
};

export type ProfileUpdateData = {
  phone?: string | null;
  country_id?: number | null;
  state_id?: number | null;
  city_id?: number | null;
  postal_code?: string | number | null;
  gender?: string | null;
  dob?: string | null;
  ID_number?: string | null;
  skill_level?: string | null;
  educationlevel?: string | null;
  summary?: string | null;
  designation?: string | null;
  // Social Media Links
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  x?: string | null;
};

export type UpdateProfilePayload = {
  data: ProfileUpdateData;
};
