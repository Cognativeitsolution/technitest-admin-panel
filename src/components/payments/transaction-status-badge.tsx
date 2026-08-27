import { TRANSACTION_STATUS_LABELS } from "@/types/payment.types";
import type { TransactionStatus } from "@/types/payment.types";

type TransactionStatusBadgeProps = {
  status: TransactionStatus;
};

const statusStyles: Record<TransactionStatus, { bg: string; text: string; dot: string }> = {
  completed: { bg: "bg-[#dcfce7]", text: "text-[#16a34a]", dot: "bg-[#16a34a]" },
  failed: { bg: "bg-[#fef2f2]", text: "text-[#ef4444]", dot: "bg-[#ef4444]" },
  pending: { bg: "bg-[#fef9c3]", text: "text-[#ca8a04]", dot: "bg-[#ca8a04]" },
  refunded: { bg: "bg-[#ede9fe]", text: "text-[#7c3aed]", dot: "bg-[#7c3aed]" },
};

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const style = statusStyles[status] ?? statusStyles.pending;

  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <span className={`size-1.5 rounded-full ${style.dot}`} />
      {TRANSACTION_STATUS_LABELS[status] ?? status}
    </span>
  );
}
