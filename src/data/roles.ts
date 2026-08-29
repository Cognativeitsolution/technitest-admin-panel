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
