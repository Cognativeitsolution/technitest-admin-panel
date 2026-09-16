import { cn } from "@/lib/utils";

type CardStatusBadgeProps = {
  inactive?: boolean;
};

export function CardStatusBadge({ inactive = false }: CardStatusBadgeProps) {
  return (
    <span
      className={cn(
        "absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-[0_6px_16px_rgba(15,23,42,0.28)] ring-1 backdrop-blur-md",
        inactive
          ? "bg-white/95 text-[#b91c1c] ring-red-200/80"
          : "bg-white/95 text-[#15803d] ring-emerald-200/80",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          inactive ? "bg-[#dc2626]" : "bg-[#16a34a]",
        )}
      />
      {inactive ? "Inactive" : "Active"}
    </span>
  );
}
