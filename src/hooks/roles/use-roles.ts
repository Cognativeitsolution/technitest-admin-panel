"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { groupPermissionsByModule } from "@/lib/role-utils";
import { roleService } from "@/services/role.service";
import type { CreateRolePayload, RoleRecord } from "@/types/role.types";

export function useRoles() {
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [permissions, setPermissions] = useState<RoleRecord["permissions"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([roleService.getRoles(), roleService.getPermissions()])
      .then(([rolesResult, permissionsResult]) => {
        if (cancelled) return;
        setRoles(rolesResult);
        setPermissions(permissionsResult);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(ApiError.fromAxiosError(err).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const groups = useMemo(() => groupPermissionsByModule(permissions), [permissions]);

  const refresh = useCallback(() => {
    setLoading(true);
    setNonce((prev) => prev + 1);
  }, []);

  const createRole = useCallback(async (payload: CreateRolePayload) => {
    setMutating(true);
    try {
      await roleService.createRole(payload);
      toast.success("Role created");
      refresh();
      return true;
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message);
      return false;
    } finally {
      setMutating(false);
    }
  }, [refresh]);

  const updateRolePermissions = useCallback(
    async (roleId: number, permissionIds: number[]) => {
      setMutating(true);
      try {
        await roleService.updateRole(roleId, { permission_ids: permissionIds });
        toast.success("Role permissions updated");
        refresh();
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  const deleteRole = useCallback(
    async (roleId: number) => {
      setMutating(true);
      try {
        await roleService.deleteRole(roleId);
        toast.success("Role deleted");
        refresh();
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  const restoreRole = useCallback(
    async (roleId: number) => {
      setMutating(true);
      try {
        await roleService.restoreRole(roleId);
        toast.success("Role restored");
        refresh();
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  return {
    roles,
    groups,
    loading,
    error,
    mutating,
    refresh,
    createRole,
    updateRolePermissions,
    deleteRole,
    restoreRole,
  };
}