"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { TextField } from "@/components/ui/text-field";
import { useChangePassword } from "@/hooks/auth/use-change-password";

function PasswordField({
  label,
  id,
  value,
  error,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <TextField
        id={id}
        label={label}
        required
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        aria-invalid={!!error}
        inputClassName="pr-12"
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((prev) => !prev)}
        className="absolute top-10 right-4 rounded-md p-1 text-[#9ca3af] transition hover:text-[#6b7280]"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
      {error ? (
        <p className="mt-1 text-xs text-[#ef4444]">{error}</p>
      ) : null}
    </div>
  );
}

export function ChangePasswordForm() {
  const { changePassword, loading, fieldErrors } = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setConfirmError("New password and confirmation do not match");
      return;
    }
    const success = await changePassword({
      current_password: currentPassword,
      new_password: newPassword,
    });
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setConfirmError(undefined);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-8"
      noValidate
    >
      <div>
        <h2 className="text-[16px] font-bold text-[#111111]">Password</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[#6b7280]">
          Update your account security by changing your current password.
        </p>
      </div>

      <div className="space-y-6">
        <PasswordField
          id="old-password"
          label="Old Password"
          value={currentPassword}
          error={fieldErrors.current_password}
          onChange={setCurrentPassword}
        />
        <div className="space-y-2">
          <PasswordField
            id="new-password"
            label="New Password"
            value={newPassword}
            error={fieldErrors.new_password}
            onChange={setNewPassword}
          />
          <p className="text-sm font-medium text-[#3b82f6]">
            Your Password Must Include A Mix Of Uppercase Letters, Numbers, And
            Special Characters.
          </p>
        </div>
        <PasswordField
          id="confirm-password"
          label="Confirm New Password"
          value={confirmPassword}
          error={confirmError}
          onChange={(value) => {
            setConfirmPassword(value);
            if (confirmError) setConfirmError(undefined);
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 min-w-42 items-center justify-center gap-2 rounded-full bg-[#e89b1e] px-8 text-[15px] font-semibold text-white transition hover:bg-[#d18b15] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}