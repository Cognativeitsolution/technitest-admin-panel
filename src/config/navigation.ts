import {
  LayoutDashboard,
  Users,
  BookOpen,
  Coins,
  Trophy,
  Ticket,
  Award,
  MessageSquare,
  FileText,
  CircleHelp,
  CreditCard,
  Bell,
  Settings,
  Shield,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /**
   * Permission modules required to access this section (any-of).
   * Empty/undefined means every signed-in admin can access it.
   * Super admins bypass this check entirely.
   */
  modules?: string[];
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "User Management", href: "/users", icon: Users, modules: ["user"] },
  { label: "Quizzes Management", href: "/quizzes", icon: BookOpen, modules: ["quiz"] },
  { label: "Coins & Referrals", href: "/coins", icon: Coins, modules: ["reward_rule"] },
  { label: "Gamification", href: "/gamification", icon: Trophy, modules: ["badges", "stars"] },
  { label: "Coupons Management", href: "/coupons", icon: Ticket, modules: ["coupon"] },
  { label: "Certificate Management", href: "/certificates", icon: Award, modules: ["certificate"] },
  { label: "Feedback & Reviews", href: "/feedback", icon: MessageSquare },
  { label: "Content Management CMS", href: "/cms", icon: FileText, modules: ["blog", "media", "category"] },
  { label: "FAQ Management", href: "/faqs", icon: CircleHelp },
  { label: "Payment & Transactions", href: "/payments", icon: CreditCard, modules: ["payment"] },
  { label: "Notifications", href: "/notifications", icon: Bell, modules: ["notification"] },
  { label: "System Settings", href: "/settings", icon: Settings },
  { label: "Roles & Permissions", href: "/roles", icon: Shield, modules: ["role", "permission"] },
];

export function findNavItemForPath(pathname: string): NavItem | undefined {
  return navItems.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );
}