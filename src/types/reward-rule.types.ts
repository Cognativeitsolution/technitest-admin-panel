export type RewardCondition = "first_time" | "every_time";

export type RewardType =
  | "quiz_completion"
  | "referral_signup"
  | "certificate_purchase"
  | "coin_expiry";

export const REWARD_TYPE_LABELS: Record<RewardType, string> = {
  quiz_completion: "Quiz Completion",
  referral_signup: "Referral Signup",
  certificate_purchase: "Certificate Purchase",
  coin_expiry: "Coin Expiry Rule",
};

export const REWARD_CONDITION_OPTIONS: { value: RewardCondition; label: string }[] = [
  { value: "first_time", label: "First Pass Only" },
  { value: "every_time", label: "Every Passing Attempts" },
];

export type RewardRule = {
  id: number;
  description: string;
  coins: number;
  condition: RewardCondition;
  coin_expiry: number;
  is_active: boolean;
  reward_type?: RewardType | string;
};

export function formatRewardTypeLabel(type?: string): string {
  if (type && type in REWARD_TYPE_LABELS) {
    return REWARD_TYPE_LABELS[type as RewardType];
  }
  if (!type) return "Reward Rule";
  return type
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isCoinExpiryRule(rule: Pick<RewardRule, "reward_type">): boolean {
  return (rule.reward_type ?? "").toLowerCase().includes("expir");
}

export function formatRewardValue(rule: RewardRule): string {
  if (isCoinExpiryRule(rule)) {
    return `${rule.coin_expiry || rule.coins} Days`;
  }
  return String(rule.coins);
}

export type RewardRuleListData = {
  items: RewardRule[];
  total: number;
};

export type UpdateRewardRulePayload = {
  description: string;
  coins: number;
  condition: RewardCondition;
  coin_expiry: number;
  is_active: boolean;
};
