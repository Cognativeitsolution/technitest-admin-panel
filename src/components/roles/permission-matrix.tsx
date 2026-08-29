"use client";

import { CheckSquare, Square } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/roles/empty-state";
import {
  formatModuleName,
  getPermissionAction,
  PERMISSION_ACTIONS,
  PERMISSION_ACTION_LABELS,
  type PermissionGroup,
} from "@/lib/role-utils";
import { cn } from "@/lib/utils";
import type { PermissionRecord } from "@/types/role.types";

type PermissionMatrixProps = {
  groups: PermissionGroup[];
  selectedIds: number[];
  onToggle: (permissionId: number) => void;
  onToggleAll?: (permissionIds: number[]) => void;
  title?: string;
  disabled?: boolean;
};

function permissionForAction(
  permissions: PermissionRecord[],
  action: string,
): PermissionRecord | undefined {
  return permissions.find((p) => getPermissionAction(p) === action);
}

export function PermissionMatrix({
  groups,
  selectedIds,
  onToggle,
  onToggleAll,
  title = "Permissions",
  disabled = false,
}: PermissionMatrixProps) {
  const allPermissionIds = groups.flatMap((group) =>
    group.permissions.map((p) => p.id),
  );
  const selectedCount = selectedIds.filter((id) =>
    allPermissionIds.includes(id),
  ).length;
  const allSelected = allPermissionIds.length > 0 && selectedCount === allPermissionIds.length;

  function requestToggle(permissionId: number) {
    if (!disabled) onToggle(permissionId);
  }

  function toggleAll() {
    if (!disabled && onToggleAll) onToggleAll(allSelected ? [] : allPermissionIds);
  }

  function requestToggleAllGroup(groupChecked: boolean, groupIds: number[]) {
    if (disabled) return;
    if (onToggleAll) {
      onToggleAll(groupChecked ? [] : groupIds);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#111827]">{title}</h3>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
              selectedCount > 0
                ? "bg-[#eef5ff] text-[#2563eb]"
                : "bg-[#f3f4f6] text-[#6b7280]",
            )}
          >
            {selectedCount} of {allPermissionIds.length} selected
          </span>
        </div>

        {onToggleAll && allPermissionIds.length > 0 ? (
          <button
            type="button"
            onClick={toggleAll}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#2563eb] transition hover:bg-[#eef5ff] disabled:opacity-50"
          >
            {allSelected ? (
              <Square className="size-3.5" />
            ) : (
              <CheckSquare className="size-3.5" />
            )}
            {allSelected ? "Clear all" : "Select all"}
          </button>
        ) : null}
      </div>

      <div className="overflow-auto rounded-xl border border-[#e5e7eb] max-h-105">
        <table className="w-full min-w-180 border-collapse text-left">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              {onToggleAll ? (
                <th className="w-12 px-4 py-3 text-center">
                  <span className="flex justify-center">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleAll}
                    />
                  </span>
                </th>
              ) : null}
              <th className="px-4 py-3">Module</th>
              {PERMISSION_ACTIONS.map((action) => (
                <th key={action} className="px-4 py-3 text-center">
                  {PERMISSION_ACTION_LABELS[action]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const groupIds = group.permissions.map((p) => p.id);
              const groupChecked =
                groupIds.length > 0 &&
                groupIds.every((id) => selectedIds.includes(id));

              return (
                <tr
                  key={group.module}
                  className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
                >
                  {onToggleAll ? (
                    <td className="px-4 py-3 text-center">
                      <span className="flex justify-center">
                        <Checkbox
                          checked={groupChecked}
                          onCheckedChange={() => requestToggleAllGroup(groupChecked, groupIds)}
                        />
                      </span>
                    </td>
                  ) : null}
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[#111827]">
                      {formatModuleName(group.module)}
                    </p>
                    <p className="text-[11px] text-[#9ca3af]">
                      {group.permissions.length} permission
                      {group.permissions.length === 1 ? "" : "s"}
                    </p>
                  </td>
                  {PERMISSION_ACTIONS.map((action) => {
                    const permission = permissionForAction(
                      group.permissions,
                      action,
                    );
                    return (
                      <td key={action} className="px-4 py-3 text-center">
                        {permission ? (
                          <span className="flex justify-center">
                            <Checkbox
                              checked={selectedIds.includes(permission.id)}
                              onCheckedChange={() => requestToggle(permission.id)}
                            />
                          </span>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {groups.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No permissions available"
                description="Permissions could not be loaded from the server."
              />
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}