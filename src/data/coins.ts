export type CoinTransactionType = "Earned" | "Spent" | "Expired";
export type CoinTransactionStatus = "Completed" | "Expired";
export type ReferralStatus = "Successful" | "Pending" | "Accepted" | "Rejected" | "Expired";

export type CoinTransaction = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: CoinTransactionType;
  count: number;
  source: string;
  date: string;
  status: CoinTransactionStatus;
};

export type ReferralRecord = {
  id: string;
  referrerName: string;
  referredUsers: string[];
  status: ReferralStatus;
  amount: number | null;
  joinedOn: string;
  awardCoins: boolean;
};

export const coinTypeOptions: CoinTransactionType[] = ["Earned", "Spent", "Expired"];
export const referralStatusOptions: ReferralStatus[] = ["Successful", "Pending", "Accepted", "Rejected", "Expired"];
export const dateFilterOptions = ["Today", "Last 7 Days", "Last 30 Days", "Custom Range"];
export const coinSourceOptions = ["Certificate Purchase", "Referral", "Quiz Completion", "Manual Adjustment", "Other"];

export const coinTransactions: CoinTransaction[] = [
  { id: "ct1", userId: "1", userName: "Talha Ahmed", userAvatar: "https://i.pravatar.cc/160?img=11", type: "Earned", count: 100, source: "Referral", date: "12 Nov 2025", status: "Completed" },
  { id: "ct2", userId: "2", userName: "Sara Khan", userAvatar: "https://i.pravatar.cc/160?img=5", type: "Spent", count: 85, source: "Quiz Completion", date: "12 Nov 2025", status: "Completed" },
  { id: "ct3", userId: "2", userName: "Sara Khan", userAvatar: "https://i.pravatar.cc/160?img=5", type: "Expired", count: 85, source: "Quiz Completion", date: "12 Nov 2025", status: "Expired" },
  { id: "ct4", userId: "2", userName: "Sara Khan", userAvatar: "https://i.pravatar.cc/160?img=5", type: "Expired", count: 85, source: "Quiz Completion", date: "12 Nov 2025", status: "Expired" },
  { id: "ct5", userId: "3", userName: "Amina Malik", userAvatar: "https://i.pravatar.cc/160?img=47", type: "Earned", count: 200, source: "Certificate Purchase", date: "10 Nov 2025", status: "Completed" },
  { id: "ct6", userId: "4", userName: "John Smith", userAvatar: "https://i.pravatar.cc/160?img=33", type: "Earned", count: 50, source: "Referral", date: "09 Nov 2025", status: "Completed" },
  { id: "ct7", userId: "5", userName: "Fatima Noor", userAvatar: "https://i.pravatar.cc/160?img=9", type: "Spent", count: 120, source: "Manual Adjustment", date: "08 Nov 2025", status: "Completed" },
];

export const referralRecords: ReferralRecord[] = [
  { id: "r1", referrerName: "Talha Ahmed", referredUsers: ["Ahmed Khan"], status: "Successful", amount: 50, joinedOn: "12 Nov 2025", awardCoins: true },
  { id: "r2", referrerName: "Sara Khan", referredUsers: ["Bilal Malik"], status: "Pending", amount: null, joinedOn: "12 Nov 2025", awardCoins: false },
  { id: "r3", referrerName: "Ali Raza", referredUsers: ["Zain Ali", "Sara Khan"], status: "Successful", amount: 100, joinedOn: "12 Nov 2025", awardCoins: true },
  { id: "r4", referrerName: "Sara Khan", referredUsers: ["Bilal Malik"], status: "Successful", amount: 90, joinedOn: "12 Nov 2025", awardCoins: true },
  { id: "r5", referrerName: "Emily Carter", referredUsers: ["John Smith"], status: "Accepted", amount: null, joinedOn: "10 Nov 2025", awardCoins: false },
  { id: "r6", referrerName: "Usman Raza", referredUsers: ["Ali Hassan"], status: "Rejected", amount: null, joinedOn: "08 Nov 2025", awardCoins: false },
];
