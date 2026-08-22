"use client";

import { useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  authErrorTextClasses,
  authInputClasses,
  authInputErrorClasses,
  authLabelClasses,
} from "./auth-styles";

type AuthFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  type?: "text" | "email" | "password" | "checkbox";
  required?: boolean;
  error?: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  children?: React.ReactNode;
};

export function AuthField({
  label,
  type = "text",
  required = true,
  error,
  placeholder,
  className,
  labelClassName,
  errorClassName,
  children,
  ...props
}: AuthFieldProps) {
  const isPassword = type === "password";
  const [show, setShow] = useState(false);
  const inputType = isPassword ? (show ? "text" : "password") : type;

  const labelMarkup = label ? (
    <label className={cn("block", authLabelClasses, labelClassName)}>
      {label} {required && <span className="ml-[2px] text-[#ff2c2c]">*</span>}
    </label>
  ) : null;

  const errorMarkup = error ? (
    <p className={cn(authErrorTextClasses, errorClassName)}>{error}</p>
  ) : null;

  if (type === "checkbox") {
    return (
      <div className={className}>
        <label className="flex cursor-pointer items-center text-[15px] font-normal text-[#252525]">
          <span className="relative flex size-[17px] items-center justify-center">
            <input
              type="checkbox"
              className="peer size-[17px] shrink-0 appearance-none rounded-[2px] border border-[#4B4B4B] bg-white transition-colors checked:border-[#EC9700] checked:bg-[#EC9700]"
              {...props}
            />
            <Check className="pointer-events-none absolute size-[13px] text-white opacity-0 transition-opacity peer-checked:opacity-100" />
          </span>
          <span className="ml-[10px]">{children}</span>
        </label>
        {errorMarkup}
      </div>
    );
  }

  return (
    <div className={className}>
      {labelMarkup}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          className={cn(
            authInputClasses,
            isPassword && "pr-12",
            error && authInputErrorClasses,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#171717] transition-colors"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {errorMarkup}
    </div>
  );
}
