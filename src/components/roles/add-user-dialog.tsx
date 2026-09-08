"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { TextField } from "@/components/ui/text-field";
import type { RoleRecord } from "@/types/role.types";

const selectClassName =
  "h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0 appearance-none";

type AddUserPayload = {
  username: string;
  email: string;
  password: string;
  role_id: number;
};

type AddUserDialogProps = {
  open: boolean;
  onClose: () => void;
  roles: RoleRecord[];
  submitting?: boolean;
  onSubmit: (payload: AddUserPayload) => Promise<boolean>;
};

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[14px] font-medium leading-none text-[#111111]"
    >
      {children}
      {required ? <span className="ml-0.5 text-[#ff0000]">*</span> : null}
    </label>
  );
}

export function AddUserDialog({
  open,
  onClose,
  roles,
  submitting = false,
  onSubmit,
}: AddUserDialogProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset form whenever the dialog opens
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setUsername("");
      setEmail("");
      setPassword("");
      setRoleId(roles.length > 0 ? String(roles[0].id) : "");
      setShowPassword(false);
      setFormError(null);
    }
  }

  async function handleSave() {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername) {
      setFormError("Username is required.");
      return;
    }
    if (!trimmedEmail) {
      setFormError("Email address is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!trimmedPassword) {
      setFormError("Password is required.");
      return;
    }
    if (trimmedPassword.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (!roleId) {
      setFormError("Please select a role.");
      return;
    }

    setFormError(null);

    const ok = await onSubmit({
      username: trimmedUsername,
      email: trimmedEmail,
      password: trimmedPassword,
      role_id: Number(roleId),
    });

    if (ok) onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add User" maxWidth="max-w-lg">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            autoComplete="off"
            disabled={submitting}
            inputClassName="h-[48px] text-[#4b5563]"
          />

          <TextField
            label="Email Address"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            autoComplete="off"
            disabled={submitting}
            inputClassName="h-[48px] text-[#4b5563]"
          />
        </div>

        {/* Password with show/hide toggle */}
        <div className="flex flex-col gap-[10px]">
          <FieldLabel htmlFor="add-user-password" required>
            Password
          </FieldLabel>
          <div className="relative">
            <input
              id="add-user-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              disabled={submitting}
              className="h-[48px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 pr-12 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0 disabled:opacity-60"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-[#9ca3af] transition hover:text-[#374151]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Role selector */}
        <div className="flex flex-col gap-[10px]">
          <FieldLabel htmlFor="add-user-role" required>
            Role
          </FieldLabel>
          <div className="relative">
            <select
              id="add-user-role"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              disabled={submitting || roles.length === 0}
              className={selectClassName}
            >
              {roles.length === 0 ? (
                <option value="">Loading roles...</option>
              ) : (
                roles.map((role) => (
                  <option key={role.id} value={String(role.id)}>
                    {role.name}
                  </option>
                ))
              )}
            </select>
            {/* Custom chevron */}
            <svg
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#9ca3af]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {formError ? (
          <p className="rounded-lg bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">
            {formError}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-[#eef1f6] pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting}
          className="inline-flex h-11 min-w-32 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400] disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Add User"}
        </button>
      </div>
    </Dialog>
  );
}
