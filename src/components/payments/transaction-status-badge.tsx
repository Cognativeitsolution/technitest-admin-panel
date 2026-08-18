import type { TransactionStatus } from "@/data/payments";

type TransactionStatusBadgeProps = {
  status: TransactionStatus;
};

const statusStyles: Record<TransactionStatus, { bg: string; text: string; dot: string }> = {
  Succeed: { bg: "bg-[#dcfce7]", text: "text-[#16a34a]", dot: "bg-[#16a34a]" },
  Failed: { bg: "bg-[#fef2f2]", text: "text-[#ef4444]", dot: "bg-[#ef4444]" },
  Pending: { bg: "bg-[#fef9c3]", text: "text-[#ca8a04]", dot: "bg-[#ca8a04]" },
};

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const style = statusStyles[status] ?? statusStyles.Pending;

  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <span className={`size-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
