"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { permissionModules } from "@/data/roles";
import type { PermissionModule, RolePermission } from "@/data/roles";

type PermissionMatrixProps = {
  permissions: Record<PermissionModule, RolePermission>;
  onChange: (permissions: Record<PermissionModule, RolePermission>) => void;
};

const actions: { key: keyof RolePermission; label: string }[] = [
  { key: "view", label: "View" },
  { key: "add", label: "Add" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

export function PermissionMatrix({ permissions, onChange }: PermissionMatrixProps) {
  function toggle(module: PermissionModule, action: keyof RolePermission) {
    const updated = { ...permissions };
    const current = { ...updated[module] };
    current[action] = !current[action];

    if ((action === "add" || action === "edit" || action === "delete") && current[action]) {
      current.view = true;
    }

    if (action === "view" && !current.view) {
      current.add = false;
      current.edit = false;
      current.delete = false;
    }

    updated[module] = current;
    onChange(updated);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#e5e7eb]">
      <table className="w-full min-w-[500px] border-collapse text-left">
        <thead>
          <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
            <th className="px-4 py-3">Module</th>
            {actions.map((a) => (
              <th key={a.key} className="px-4 py-3 text-center">{a.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissionModules.map((mod) => (
            <tr key={mod} className="border-t border-[#eef1f6]">
              <td className="px-4 py-3 text-sm font-medium text-[#111827]">{mod}</td>
              {actions.map((a) => (
                <td key={a.key} className="px-4 py-3 text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permissions[mod][a.key]}
                      onCheckedChange={() => toggle(mod, a.key)}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
