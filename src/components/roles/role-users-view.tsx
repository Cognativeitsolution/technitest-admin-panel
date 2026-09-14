"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Pagination } from "@/components/shared/pagination";
import { UpdateUserRoleDialog } from "@/components/roles/update-user-role-dialog";
import { RoleBadge } from "@/components/roles/role-badge";
import { UsersTable } from "@/components/users/users-table";
import { useUsers } from "@/hooks/users/use-users";
import { ApiError } from "@/lib/api-error";
import { buildUserUpdateFormData } from "@/lib/user-update";
import { roleService } from "@/services/role.service";
import { userService } from "@/services/user.service";
import type { RoleRecord } from "@/types/role.types";
import type { ApiUser } from "@/types/user.types";

const PAGE_SIZE = 10;

type RoleUsersViewProps = {
  roleId: string;
};

export function RoleUsersView({ roleId }: RoleUsersViewProps) {
  const [role, setRole] = useState<RoleRecord | null>(null);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [roleLoading, setRoleLoading] = useState(true);
  const [roleError, setRoleError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setRoleLoading(true);

    roleService
      .getRoles()
      .then((allRoles) => {
        if (cancelled) return;
        const matchedRole = allRoles.find((item) => String(item.id) === roleId) ?? null;
        setRoles(allRoles);
        setRole(matchedRole);
        setRoleError(matchedRole ? null : "Role not found.");
      })
      .catch((error) => {
        if (cancelled) return;
        setRole(null);
        setRoles([]);
        setRoleError(ApiError.fromAxiosError(error).message);
      })
      .finally(() => {
        if (!cancelled) setRoleLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [roleId]);

  const loading = roleLoading;
  const error = roleError;

  return (
    <div className="space-y-5">
      <Link
        href="/roles"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280] transition hover:text-[#111827]"
      >
        <ArrowLeft className="size-4" />
        Back to Roles & Permissions
      </Link>

      <div className="rounded-2xl border border-[#e8ecf2] bg-white px-6 py-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            {role ? <RoleBadge name={role.name} /> : null}
            <div>
              <h1 className="text-[24px] font-bold tracking-tight text-[#111827]">
                {role?.name ?? "Role Users"}
              </h1>
              <p className="mt-1 text-sm text-[#6b7280]">
                {role?.description || "Users assigned to this role"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      ) : null}

      {!error && loading && !role ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[#e8ecf2] bg-white p-6 text-sm text-[#6b7280]">
          <ShieldCheck className="size-5 animate-pulse text-[#f0a500]" />
          Loading role users...
        </div>
      ) : null}

      {!error && role ? (
        <RoleUsersList roleSlug={role.slug} roles={roles} />
      ) : null}
    </div>
  );
}

type RoleUsersListProps = {
  roleSlug: string;
  roles: RoleRecord[];
};

function RoleUsersList({ roleSlug, roles }: RoleUsersListProps) {
  const {
    items,
    pagination,
    loading,
    goToPage,
    mutateItems,
  } = useUsers({
    perPage: PAGE_SIZE,
    role_slug: roleSlug,
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<ApiUser | null>(null);
  const [updatingRole, setUpdatingRole] = useState(false);

  function handleEditRoleClick(user: ApiUser) {
    setUserToEdit(user);
    setEditDialogOpen(true);
  }

  async function handleUpdateUserRole(user: ApiUser, roleId: number) {
    const selectedRole = roles.find((role) => role.id === roleId);
    const currentRoleSlug = user.roles?.[0];

    if (selectedRole?.slug === currentRoleSlug) {
      toast.info("User already has this role.");
      return true;
    }

    setUpdatingRole(true);
    try {
      await userService.updateUser(user.id, buildUserUpdateFormData(user, { role_id: roleId }));

      mutateItems((prevItems) =>
        prevItems.filter((item) => item.id !== user.id),
      );

      toast.success(`${user.username} role updated successfully`);
      return true;
    } catch (error) {
      toast.error(ApiError.fromAxiosError(error).message || "Failed to update user role");
      return false;
    } finally {
      setUpdatingRole(false);
    }
  }

  return (
    <>
      <UsersTable
        variant="role"
        users={items}
        loading={loading}
        onEdit={handleEditRoleClick}
      />

      <Pagination
        currentPage={pagination.page || 1}
        totalPages={Math.max(1, pagination.totalPages || 1)}
        onPageChange={goToPage}
      />

      <UpdateUserRoleDialog
        open={editDialogOpen}
        onClose={() => !updatingRole && setEditDialogOpen(false)}
        user={userToEdit}
        roles={roles}
        submitting={updatingRole}
        onSubmit={handleUpdateUserRole}
      />
    </>
  );
}
