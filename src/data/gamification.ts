export type BadgeStatus = "enabled" | "disabled";
export type GamificationTab = "badges" | "stars" | "top-scorer";

export type PercentageRange =
  | "95 to 100"
  | "80 to <95"
  | "65 to <80"
  | "50 to <65";

export const percentageRangeOptions: PercentageRange[] = [
  "95 to 100",
  "80 to <95",
  "65 to <80",
  "50 to <65",
];

export const starRangeOptions = ["90+", "85–90%", "80–85%", "75–80%", "70–75%"];

export type GamificationBadge = {
  id: string;
  name: string;
  iconUrl: string;
  criteria: string;
  range: PercentageRange;
  lastUpdated: string;
  status: BadgeStatus;
  autoAssign: boolean;
};

export type StarRule = {
  id: string;
  starCount: number;
  range: string;
  lastUpdated: string;
};

export type TopScorer = {
  id: string;
  rank: number;
  userName: string;
  userAvatar: string;
  score: number;
  quizName: string;
  level: string;
  certificate: string;
  date: string;
  featured: boolean;
};

export const levelOptions = ["Beginner", "Skilled", "Advanced"];

export const badges: GamificationBadge[] = [
  { id: "b1", name: "Platinum", iconUrl: "/badges/platinum.svg", criteria: "95 to 100", range: "95 to 100", lastUpdated: "12 Nov 2025", status: "enabled", autoAssign: true },
  { id: "b2", name: "Gold", iconUrl: "/badges/gold.svg", criteria: "80 to <95", range: "80 to <95", lastUpdated: "12 Nov 2025", status: "enabled", autoAssign: true },
  { id: "b3", name: "Silver", iconUrl: "/badges/silver.svg", criteria: "65 to <80", range: "65 to <80", lastUpdated: "12 Nov 2025", status: "enabled", autoAssign: false },
];

export const starRules: StarRule[] = [
  { id: "s1", starCount: 5, range: "90+", lastUpdated: "12 Nov 2025" },
  { id: "s2", starCount: 4, range: "85–90%", lastUpdated: "12 Nov 2025" },
  { id: "s3", starCount: 3, range: "80–85%", lastUpdated: "12 Nov 2025" },
  { id: "s4", starCount: 2, range: "75–80%", lastUpdated: "12 Nov 2025" },
  { id: "s5", starCount: 1, range: "70–75%", lastUpdated: "12 Nov 2025" },
];

export const topScorers: TopScorer[] = [
  { id: "ts1", rank: 1, userName: "Chris", userAvatar: "https://i.pravatar.cc/160?img=12", score: 97, quizName: "JavaScript Basics", level: "Beginner", certificate: "Tech Beginner", date: "12 Nov 2025", featured: true },
  { id: "ts2", rank: 2, userName: "Emma", userAvatar: "https://i.pravatar.cc/160?img=9", score: 94, quizName: "HTML Advanced", level: "Skilled", certificate: "Tech Beginner", date: "12 Nov 2025", featured: false },
  { id: "ts3", rank: 3, userName: "Jake", userAvatar: "https://i.pravatar.cc/160?img=15", score: 93, quizName: "CSS Fundamentals", level: "Advanced", certificate: "Tech Beginner", date: "12 Nov 2025", featured: false },
  { id: "ts4", rank: 4, userName: "Neha", userAvatar: "https://i.pravatar.cc/160?img=45", score: 91, quizName: "Advanced Marketing", level: "Skilled", certificate: "Tech Beginner", date: "12 Nov 2025", featured: false },
  { id: "ts5", rank: 5, userName: "David", userAvatar: "https://i.pravatar.cc/160?img=33", score: 90, quizName: "UI/UX Designing", level: "Beginner", certificate: "Tech Beginner", date: "12 Nov 2025", featured: false },
];
