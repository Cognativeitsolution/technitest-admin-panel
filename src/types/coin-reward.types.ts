export type CoinRewardUserInfo = {
  id: number;
  username: string;
  email: string;
};

export type ReferralUser = {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_email_verified: boolean;
  referral_status: string;
  join_date: string;
  referrer: CoinRewardUserInfo | null;
};

export type AdminWallet = {
  id: number;
  total_coin: number;
  remaining_balance: number;
  user: CoinRewardUserInfo;
};

export type CoinHistoryItem = {
  id: number;
  transaction_type: string;
  amount: number;
  created_at: string;
  expires_at: string | null;
  details: Record<string, unknown>;
};

export type MyWallet = {
  total_coin: number;
  remaining_balance: number;
};
