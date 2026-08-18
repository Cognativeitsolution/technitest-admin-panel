export type RolesTab = "users" | "roles";
export type UserStatus = "Active" | "Inactive";
export type PermissionAction = "view" | "add" | "edit" | "delete";

export type PermissionModule =
  | "Dashboard"
  | "User Management"
  | "Quizzes Management"
  | "Coins & Referrals"
  | "Coupons Management"
  | "Feedback & Reviews"
  | "Payment & Transactions"
  | "System Settings"
  | "Gamification"
  | "Certificate Management"
  | "Content Management CMS"
  | "Notifications"
  | "Roles & Permissions";

export type RolePermission = Record<PermissionAction, boolean>;

export type AdminUser = {
  id: string;
  roleName: string;
  name: string;
  email: string;
  status: UserStatus;
};

export type Role = {
  id: string;
  name: string;
  status: UserStatus;
  permissions: Record<PermissionModule, RolePermission>;
};

export const permissionModules: PermissionModule[] = [
  "Dashboard",
  "User Management",
  "Quizzes Management",
  "Coins & Referrals",
  "Coupons Management",
  "Feedback & Reviews",
  "Payment & Transactions",
  "System Settings",
  "Gamification",
  "Certificate Management",
  "Content Management CMS",
  "Notifications",
  "Roles & Permissions",
];

export const statusFilterOptions = ["Active", "Inactive"];

function allPerms(): RolePermission {
  return { view: false, add: false, edit: false, delete: false };
}

function fullPerms(): RolePermission {
  return { view: true, add: true, edit: true, delete: true };
}

function perms(view: boolean, add: boolean, edit: boolean, del: boolean): RolePermission {
  return { view, add, edit, delete: del };
}

const defaultPermissions: Record<PermissionModule, RolePermission> = Object.fromEntries(
  permissionModules.map((m) => [m, allPerms()])
) as Record<PermissionModule, RolePermission>;

export const roles: Role[] = [
  {
    id: "r1", name: "Super Admin", status: "Active",
    permissions: {
      ...defaultPermissions,
      Dashboard: fullPerms(),
      "User Management": fullPerms(),
      "Quizzes Management": fullPerms(),
      "Coins & Referrals": fullPerms(),
      "Coupons Management": fullPerms(),
      "Feedback & Reviews": fullPerms(),
      "Payment & Transactions": fullPerms(),
      "System Settings": fullPerms(),
      Gamification: fullPerms(),
      "Certificate Management": fullPerms(),
      "Content Management CMS": fullPerms(),
      Notifications: fullPerms(),
      "Roles & Permissions": fullPerms(),
    },
  },
  {
    id: "r2", name: "Content Admin", status: "Active",
    permissions: {
      ...defaultPermissions,
      Dashboard: perms(true, false, false, false),
      "Content Management CMS": perms(true, true, true, false),
      "Feedback & Reviews": perms(true, false, true, false),
      Notifications: perms(true, false, false, false),
    },
  },
  {
    id: "r3", name: "CMS Admin", status: "Active",
    permissions: {
      ...defaultPermissions,
      Dashboard: perms(true, false, false, false),
      "Content Management CMS": perms(true, true, true, true),
    },
  },
  {
    id: "r4", name: "System Settings Admin", status: "Active",
    permissions: {
      ...defaultPermissions,
      Dashboard: perms(true, false, false, false),
      "System Settings": perms(true, true, true, true),
    },
  },
];

export const adminUsers: AdminUser[] = [
  { id: "u1", roleName: "Super Admin", name: "Ammad Aslam", email: "ammad@gmail.com", status: "Active" },
  { id: "u2", roleName: "Content Admin", name: "Nick Walter", email: "nick@gmail.com", status: "Active" },
  { id: "u3", roleName: "CMS Admin", name: "Alan David", email: "alan@gmail.com", status: "Active" },
  { id: "u4", roleName: "System Settings Admin", name: "Brian John", email: "brian@gmail.com", status: "Active" },
];
