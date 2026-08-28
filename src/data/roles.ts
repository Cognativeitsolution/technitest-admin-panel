export type RolesTab = "users" | "roles";
export type UserStatus = "Active" | "Inactive";

export type AdminUser = {
  id: string;
  roleName: string;
  name: string;
  email: string;
  status: UserStatus;
};

export const statusFilterOptions = ["Active", "Inactive"];

export const adminUsers: AdminUser[] = [
  { id: "u1", roleName: "Super Admin", name: "Ammad Aslam", email: "ammad@gmail.com", status: "Active" },
  { id: "u2", roleName: "Content Admin", name: "Nick Walter", email: "nick@gmail.com", status: "Active" },
  { id: "u3", roleName: "CMS Admin", name: "Alan David", email: "alan@gmail.com", status: "Active" },
  { id: "u4", roleName: "System Settings Admin", name: "Brian John", email: "brian@gmail.com", status: "Active" },
];