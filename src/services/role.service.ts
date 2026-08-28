import apiClient from "@/lib/api-client";
import type {
  CreateRolePayload,
  PermissionRecord,
  RoleRecord,
  UpdateRolePayload,
} from "@/types/role.types";

const BASE = "/api/v1/roles";

export const roleService = {
  getPermissions: async () => {
    const { data } = await apiClient.get<PermissionRecord[]>(
      `${BASE}/permissions`,
    );
    return data;
  },

  getRoles: async () => {
    const { data } = await apiClient.get<RoleRecord[]>(`${BASE}/`);
    return data;
  },

  createRole: async (payload: CreateRolePayload) => {
    const { data } = await apiClient.post<RoleRecord>(`${BASE}/`, payload);
    return data;
  },

  updateRole: async (roleId: number, payload: UpdateRolePayload) => {
    const { data } = await apiClient.put<RoleRecord>(
      `${BASE}/${roleId}`,
      payload,
    );
    return data;
  },

  deleteRole: async (roleId: number) => {
    const { data } = await apiClient.delete<string>(`${BASE}/${roleId}`);
    return data;
  },

  restoreRole: async (roleId: number) => {
    const { data } = await apiClient.post<RoleRecord>(
      `${BASE}/${roleId}/restore`,
    );
    return data;
  },
};