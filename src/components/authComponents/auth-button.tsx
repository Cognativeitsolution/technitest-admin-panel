import { cn } from "@/lib/utils";

import { authButtonClasses } from "./auth-styles";

type AuthButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
};

export function AuthButton({
  children,
  loading,
  type = "submit",
  onClick,
  className,
}: AuthButtonProps) {
  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={cn(authButtonClasses, className)}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
