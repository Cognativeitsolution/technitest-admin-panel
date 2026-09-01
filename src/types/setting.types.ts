export type SettingUpdator = {
  id: number;
  username: string;
  email: string;
};

export type SettingRecord = {
  id: number;
  key: string;
  value: string;
  is_image: boolean;
  is_encrypted: boolean;
  deletable: boolean;
  status: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  updator?: SettingUpdator;
};

export type GeneralSettingItem = {
  id: number;
  value: string;
};

export type GeneralSettingsApiResponse = Record<string, GeneralSettingItem>;

export type UpdateSettingPayload = {
  value?: string;
  is_image?: boolean;
  is_encrypted?: boolean;
  status?: string;
  is_active?: boolean;
};

export type CreateSettingPayload = {
  key: string;
  value: string;
  is_image?: boolean;
  is_encrypted?: boolean;
  deletable?: boolean;
  status?: string;
};

export const SETTING_FIELD_LABELS: Record<string, string> = {
  coin_value_usd: "Coin Value (USD)",
  footer_text: "Footer Text",
  footer_content: "Footer Content",
  contact_email: "Contact Email",
  contact_number: "Contact Number",
  website_email: "Website Email",
  location_address: "Location Address",
  social_instagram: "Instagram",
  social_linkedin: "LinkedIn",
  social_twitter: "Twitter/X",
  social_pinterest: "Pinterest",
  social_youtube: "YouTube",
  cancellation_fee: "Cancellation Fee",
  force_delete_scheduled_users_days: "Force Delete Days",
  soft_delete_scheduled_users_days: "Soft Delete Days",
  registration_coins: "Registration Coins",
  site_name: "Site Name",
  social_facebook: "Facebook",
};

export function formatSettingLabel(key: string) {
  return (
    SETTING_FIELD_LABELS[key] ??
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
