export type NotificationIconType = "success" | "alert" | "info" | "award";

export type AppNotification = {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
  icon: NotificationIconType;
};

export const notifications: AppNotification[] = [
  {
    id: "1",
    title: "You Did It! Sana Ahmed Quiz Is Successfully Completed",
    description:
      "Sana Ahmed has successfully completed the Advanced SEO Quiz with a score of 94%. Certificate eligibility has been updated.",
    timeAgo: "6 days ago",
    read: false,
    icon: "success",
  },
  {
    id: "2",
    title: "Your Quiz Attempt Was Not Completed",
    description:
      "Usman Raza started Frontend Fundamentals but left the attempt incomplete. A reminder has been queued for follow-up.",
    timeAgo: "5 days ago",
    read: false,
    icon: "alert",
  },
  {
    id: "3",
    title: "New Certificate Issued",
    description:
      "A certificate for JavaScript Basics has been issued to Talha Ahmed and is ready for download.",
    timeAgo: "4 days ago",
    read: true,
    icon: "award",
  },
  {
    id: "4",
    title: "Payment Received Successfully",
    description:
      "A new payment of $120 was received for Premium Quiz Bundle. Transaction ID: TXN-98421.",
    timeAgo: "3 days ago",
    read: false,
    icon: "info",
  },
  {
    id: "5",
    title: "Referral Bonus Unlocked",
    description:
      "Sara Ali referred 3 new users and earned 150 coins. Reward rules were applied automatically.",
    timeAgo: "2 days ago",
    read: true,
    icon: "award",
  },
  {
    id: "6",
    title: "System Maintenance Scheduled",
    description:
      "Scheduled maintenance is planned this weekend. Users may experience brief downtime during the update window.",
    timeAgo: "1 day ago",
    read: false,
    icon: "alert",
  },
];
