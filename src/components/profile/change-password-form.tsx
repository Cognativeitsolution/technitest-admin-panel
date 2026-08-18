"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { TextField } from "@/components/ui/text-field";

function PasswordField({
  label,
  id,
  defaultValue,
}: {
  label: string;
  id: string;
  defaultValue?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <TextField
        id={id}
        label={label}
        required
        type={visible ? "text" : "password"}
        defaultValue={defaultValue}
        placeholder={label}
        inputClassName="pr-12"
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((prev) => !prev)}
        className="absolute top-[40px] right-4 rounded-md p-1 text-[#9ca3af] transition hover:text-[#6b7280]"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function ChangePasswordForm() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-[16px] font-bold text-[#111111]">Password</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[#6b7280]">
          Update your account security by changing your current password or
          securely viewing it if forgotten.
        </p>
      </div>

      <div className="space-y-6">
        <PasswordField
          id="old-password"
          label="Old Password"
          defaultValue="password123"
        />
        <div className="space-y-2">
          <PasswordField
            id="new-password"
            label="New Password"
            defaultValue="NewPass@123"
          />
          <p className="text-sm font-medium text-[#3b82f6]">
            Your Password Must Include A Mix Of Uppercase Letters, Numbers, And
            Special Characters.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex h-[48px] min-w-[168px] items-center justify-center rounded-full bg-[#e89b1e] px-8 text-[15px] font-semibold text-white transition hover:bg-[#d18b15]"
      >
        Save Changes
      </button>
    </div>
  );
}
