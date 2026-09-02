export const NOTIFICATION_SETTING_KEYS = [
  "certificate_issued",
  "certificate_expiry_reminder",
  "payment_failed",
  "payment_retry_reminder",
  "abandoned_checkout_reminder",
  "coins_earned",
  "coin_expiry_reminder",
  "referral_reward",
  "quiz_session_expiry_reminder",
  "password_reset",
  "change_password",
  "security_updated",
  "profile_updated",
  "roles_changed",
  "account_status_changed",
] as const;

export type NotificationSettingKey = (typeof NOTIFICATION_SETTING_KEYS)[number];

export type NotificationSettingItem = {
  id: number;
  value: boolean;
};

export type NotificationSettingsApiResponse = Partial<
  Record<NotificationSettingKey, NotificationSettingItem | boolean>
>;

export type NotificationSettingsUpdatePayload = Partial<
  Record<NotificationSettingKey, boolean>
>;

export const NOTIFICATION_SETTING_LABELS: Record<NotificationSettingKey, string> = {
  certificate_issued: "Certificate Issued",
  certificate_expiry_reminder: "Certificate Expiry Reminder",
  payment_failed: "Payment Failed",
  payment_retry_reminder: "Payment Retry Reminder",
  abandoned_checkout_reminder: "Abandoned Checkout Reminder",
  coins_earned: "Coins Earned",
  coin_expiry_reminder: "Coin Expiry Reminder",
  referral_reward: "Referral Reward",
  quiz_session_expiry_reminder: "Quiz Session Expiry Reminder",
  password_reset: "Password Reset",
  change_password: "Change Password",
  security_updated: "Security Updated",
  profile_updated: "Profile Updated",
  roles_changed: "Roles Changed",
  account_status_changed: "Account Status Changed",
};

export function extractNotificationSettingValue(
  value: NotificationSettingItem | boolean | undefined,
): boolean {
  if (typeof value === "boolean") return value;
  return value?.value ?? false;
}

export function mapNotificationSettingsResponse(
  data: NotificationSettingsApiResponse | null | undefined,
): NotificationSettingsUpdatePayload {
  return NOTIFICATION_SETTING_KEYS.reduce((acc, key) => {
    acc[key] = extractNotificationSettingValue(data?.[key]);
    return acc;
  }, {} as NotificationSettingsUpdatePayload);
}
