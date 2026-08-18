export type SitePageOption = "Homepage" | "About Us" | "Categories" | "Quiz Page" | "Blog" | "Contact Us" | "FAQs";
export type MetaRobotsOption = "index, follow" | "noindex, follow" | "index, nofollow" | "noindex, nofollow";

export type GeneralSettingsValues = {
  siteTitle: string;
  siteBaseColor: string;
  recordsPerPage: string;
  quizAttemptsLimit: string;
  defaultUserRole: string;
  coinsExpiry: string;
  certificateExpiry: string;
};

export type SeoSettingsValues = {
  page: SitePageOption;
  metaTitle: string;
  metaRobots: string;
  metaDescription: string;
  keywords: string[];
  ogImageUrl: string;
};

export type NotificationSettingsValues = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  adminAlerts: boolean;
  quizCompletion: boolean;
  certificateNotifications: boolean;
  referralNotifications: boolean;
  paymentNotifications: boolean;
  userRegistration: boolean;
};

export type LogoFaviconValues = {
  primaryLogo: string;
  darkLogo: string;
  favicon: string;
};

export const sitePageOptions: SitePageOption[] = ["Homepage", "About Us", "Categories", "Quiz Page", "Blog", "Contact Us", "FAQs"];
export const metaRobotsOptions: MetaRobotsOption[] = ["index, follow", "noindex, follow", "index, nofollow", "noindex, nofollow"];
export const recordsPerPageOptions = ["10 Items Per Page", "20 Items Per Page", "50 Items Per Page", "100 Items Per Page"];
export const quizAttemptsOptions = ["1 Attempt", "2 Attempts", "3 Attempts", "5 Attempts", "Unlimited"];
export const defaultUserRoleOptions = ["None", "Student", "Instructor", "Admin"];
export const coinsExpiryOptions = ["7 Days", "15 Days", "30 Days", "60 Days", "Never"];
export const certificateExpiryOptions = ["6 Months", "1 Year", "2 Years", "Never"];

export const defaultGeneralSettings: GeneralSettingsValues = {
  siteTitle: "Techni Test",
  siteBaseColor: "#2533F1",
  recordsPerPage: "20 Items Per Page",
  quizAttemptsLimit: "3 Attempts",
  defaultUserRole: "None",
  coinsExpiry: "15 Days",
  certificateExpiry: "2 Years",
};

export const defaultSeoSettings: SeoSettingsValues = {
  page: "Homepage",
  metaTitle: "",
  metaRobots: "index, follow",
  metaDescription: "",
  keywords: ["Figma", "Design", "Business Job"],
  ogImageUrl: "",
};

export const defaultNotificationSettings: NotificationSettingsValues = {
  emailNotifications: true,
  pushNotifications: false,
  adminAlerts: true,
  quizCompletion: true,
  certificateNotifications: true,
  referralNotifications: false,
  paymentNotifications: true,
  userRegistration: true,
};
