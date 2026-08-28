"use client";

import { useState } from "react";
import { Plus, PlusCircle, RefreshCw, ShieldAlert } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { CheckboxDropdown } from "@/components/feedback/checkbox-dropdown";
import { UsersTable } from "@/components/roles/users-table";
import { RolesTable } from "@/components/roles/roles-table";
import { UserDialog } from "@/components/roles/user-dialog";
import { RoleDialog } from "@/components/roles/role-dialog";
import { PermissionsDialog } from "@/components/roles/permissions-dialog";
import { RolesPageHeader } from "@/components/roles/page-header";
import { RolesTabBar, rolesTabIcons } from "@/components/roles/tab-bar";
import { useRoles } from "@/hooks/roles/use-roles";
import { adminUsers as initialUsers, statusFilterOptions } from "@/data/roles";
import type { RolesTab, AdminUser } from "@/data/roles";
import type { RoleRecord } from "@/types/role.types";

export function RolesPermissionsView({ initialTab = "users" }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<RolesTab>(
    initialTab === "roles" ? "roles" : "users"
  );

  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userDialogMode, setUserDialogMode] = useState<"create" | "edit">("create");
  const [userDialogTarget, setUserDialogTarget] = useState<AdminUser | null>(null);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [permissionsDialogTarget, setPermissionsDialogTarget] = useState<RoleRecord | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<RoleRecord | null>(null);

  const {
    roles,
    groups,
    loading,
    error,
    mutating,
    refresh,
    createRole,
    updateRolePermissions,
    deleteRole,
  } = useRoles();

  const filteredUsers = users.filter((u) => {
    if (statusFilter.length > 0 && !statusFilter.includes(u.status)) return false;
    return true;
  });

  const roleNames = roles.map((r) => r.name);

  function openCreateUser() {
    setUserDialogMode("create");
    setUserDialogTarget(null);
    setUserDialogOpen(true);
  }

  function openEditUser(user: AdminUser) {
    setUserDialogMode("edit");
    setUserDialogTarget(user);
    setUserDialogOpen(true);
  }

  function openCreateRole() {
    setRoleDialogOpen(true);
  }

  function openPermissions(role: RoleRecord) {
    setPermissionsDialogTarget(role);
    setPermissionsDialogOpen(true);
  }

  function closePermissionsDialog() {
    setPermissionsDialogOpen(false);
    setPermissionsDialogTarget(null);
  }

  async function handleDeleteRole() {
    if (!deleteTarget) return;
    const ok = await deleteRole(deleteTarget.id);
    if (ok) setDeleteTarget(null);
  }

  const pageActions = (
    <>
      <button
        type="button"
        onClick={openCreateUser}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] shadow-sm transition hover:bg-[#f9fafb]"
      >
        <PlusCircle className="size-4 text-[#6b7280]" />
        Add User
      </button>
      <button
        type="button"
        onClick={openCreateRole}
        className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
      >
        <Plus className="size-4" />
        Add Role
      </button>
    </>
  );

  return (
    <div className="space-y-5">
      <RolesPageHeader
        title="Roles & Permissions"
        description="Create custom roles and control exactly what each admin can access and do across the platform."
        actions={pageActions}
      />

      <RolesTabBar
        tabs={[
          { id: "users", label: "Users", icon: rolesTabIcons.users },
          { id: "roles", label: "Roles", icon: rolesTabIcons.roles },
        ]}
        active={activeTab}
        counts={{ roles: roles.length, users: users.length }}
        onChange={(id) => setActiveTab(id as RolesTab)}
      />

      {/* Users Tab */}
      {activeTab === "users" ? (
        <div className="space-y-4">
          <CheckboxDropdown
            label="Status"
            options={statusFilterOptions}
            selected={statusFilter}
            onChange={setStatusFilter}
          />
          <UsersTable
            users={filteredUsers}
            onEdit={openEditUser}
            onDelete={(u) => {
              setUsers((prev) => prev.filter((item) => item.id !== u.id));
            }}
          />
        </div>
      ) : null}

      {/* Roles Tab */}
      {activeTab === "roles" ? (
        <div className="space-y-4">
          {error ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
              <span className="flex items-center gap-2">
                <ShieldAlert className="size-4 shrink-0" />
                {error}
              </span>
              <button
                type="button"
                onClick={refresh}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#b91c1c] transition hover:bg-[#fee2e2]"
              >
                <RefreshCw className="size-3.5" />
                Retry
              </button>
            </div>
          ) : null}
          <RolesTable
            roles={roles}
            loading={loading}
            onEdit={openPermissions}
            onDelete={setDeleteTarget}
          />
        </div>
      ) : null}

      {/* Delete Confirmation */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Role"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-[#4b5563]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#111827]">{deleteTarget?.name}</span>?
          Admins assigned to this role will lose its access. This action cannot be
          undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            disabled={mutating}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteRole}
            disabled={mutating}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#dc2626] disabled:opacity-50"
          >
            {mutating ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Dialog>

      {/* User Dialog */}
      <UserDialog
        open={userDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        mode={userDialogMode}
        user={userDialogTarget}
        roleNames={roleNames.length > 0 ? roleNames : ["Super Admin"]}
      />

      {/* Role Dialog */}
      <RoleDialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        groups={groups}
        submitting={mutating}
        onSubmit={createRole}
      />

      {/* Permissions Dialog */}
      <PermissionsDialog
        open={permissionsDialogOpen}
        onClose={closePermissionsDialog}
        role={permissionsDialogTarget}
        groups={groups}
        submitting={mutating}
        onSubmit={updateRolePermissions}
      />
    </div>
  );
}