"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { CheckboxDropdown } from "@/components/feedback/checkbox-dropdown";
import { UsersTable } from "@/components/roles/users-table";
import { RolesTable } from "@/components/roles/roles-table";
import { UserDialog } from "@/components/roles/user-dialog";
import { RoleDialog } from "@/components/roles/role-dialog";
import { PermissionsDialog } from "@/components/roles/permissions-dialog";
import {
  adminUsers as initialUsers,
  roles as initialRoles,
  statusFilterOptions,
} from "@/data/roles";
import type { RolesTab, AdminUser, Role } from "@/data/roles";

export function RolesPermissionsView({ initialTab = "users" }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<RolesTab>(
    initialTab === "roles" ? "roles" : "users"
  );

  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userDialogMode, setUserDialogMode] = useState<"create" | "edit">("create");
  const [userDialogTarget, setUserDialogTarget] = useState<AdminUser | null>(null);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleDialogMode, setRoleDialogMode] = useState<"create" | "edit">("create");
  const [roleDialogTarget, setRoleDialogTarget] = useState<Role | null>(null);

  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [permissionsDialogTarget, setPermissionsDialogTarget] = useState<Role | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ type: string; item: AdminUser | Role } | null>(null);

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
    setRoleDialogMode("create");
    setRoleDialogTarget(null);
    setRoleDialogOpen(true);
  }

  function openEditRole(role: Role) {
    setRoleDialogMode("edit");
    setRoleDialogTarget(role);
    setRoleDialogOpen(true);
  }

  function openPermissions(role: Role) {
    setPermissionsDialogTarget(role);
    setPermissionsDialogOpen(true);
  }

  function confirmDelete(type: string, item: AdminUser | Role) {
    setDeleteTarget({ type, item });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const { type, item } = deleteTarget;
    if (type === "user") {
      setUsers((prev) => prev.filter((u) => u.id !== item.id));
    } else {
      setRoles((prev) => prev.filter((r) => r.id !== item.id));
    }
    setDeleteTarget(null);
  }

  function deleteItemName() {
    if (!deleteTarget) return "";
    const { type, item } = deleteTarget;
    if (type === "user") return (item as AdminUser).name;
    return (item as Role).name;
  }

  const tabs = [
    { id: "users" as const, label: "Users" },
    { id: "roles" as const, label: "Roles" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Roles &amp; Permissions
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCreateUser}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f2937]"
          >
            <Plus className="size-4" />
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
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 rounded-xl bg-[#f3f4f6] p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-[#111827] text-white shadow-sm"
                : "text-[#6b7280] hover:text-[#374151]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
            onDelete={(u) => confirmDelete("user", u)}
          />
        </div>
      ) : null}

      {/* Roles Tab */}
      {activeTab === "roles" ? (
        <div className="space-y-4">
          <RolesTable
            roles={roles}
            onEdit={openEditRole}
            onDelete={(r) => confirmDelete("role", r)}
          />
        </div>
      ) : null}

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.type === "user" ? "User" : "Role"}`}
      >
        <p className="text-[15px] text-[#4b5563]">
          Are you sure you want to delete <span className="font-semibold text-[#111827]">{deleteItemName()}</span>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white transition hover:bg-[#dc2626]"
          >
            Delete
          </button>
        </div>
      </Dialog>

      {/* User Dialog */}
      <UserDialog
        open={userDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        mode={userDialogMode}
        user={userDialogTarget}
        roleNames={roleNames}
      />

      {/* Role Dialog */}
      <RoleDialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        mode={roleDialogMode}
        role={roleDialogTarget}
      />

      {/* Permissions Dialog */}
      <PermissionsDialog
        open={permissionsDialogOpen}
        onClose={() => setPermissionsDialogOpen(false)}
        role={permissionsDialogTarget}
      />
    </div>
  );
}
