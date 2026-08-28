export type PermissionRecord = {
  id: number;
  name: string;
  slug: string;
  module: string;
  description: string;
};

export type RoleRecord = {
  id: number;
  name: string;
  description: string;
  slug: string;
  is_system: boolean;
  is_superuser: boolean;
  permissions: PermissionRecord[];
};

export type CreateRolePayload = {
  name: string;
  description: string;
  permission_ids: number[];
};

export type UpdateRolePayload = {
  permission_ids: number[];
};