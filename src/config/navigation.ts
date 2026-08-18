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
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "User Management", href: "/users", icon: Users },
  { label: "Quizzes Management", href: "/quizzes", icon: BookOpen },
  { label: "Coins & Referrals", href: "/coins", icon: Coins },
  { label: "Gamification", href: "/gamification", icon: Trophy },
  { label: "Coupons Management", href: "/coupons", icon: Ticket },
  { label: "Certificate Management", href: "/certificates", icon: Award },
  { label: "Feedback & Reviews", href: "/feedback", icon: MessageSquare },
  { label: "Content Management CMS", href: "/cms", icon: FileText },
  { label: "Payment & Transactions", href: "/payments", icon: CreditCard },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "System Settings", href: "/settings", icon: Settings },
  { label: "Roles & Permissions", href: "/roles", icon: Shield },
];
