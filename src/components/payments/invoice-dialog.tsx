"use client";

import { Printer, Download, Loader2 } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import {
  TRANSACTION_STATUS_LABELS,
  type TransactionRecord,
  type TransactionReceipt,
  type TransactionStatus,
} from "@/types/payment.types";

const BILL_FROM = {
  name: "Tech-ni-test",
  company: "Technitest.com",
  phone: "+923657895235",
  email: "info@technitest.com",
} as const;

const STATUS_TEXT_CLASS: Record<TransactionStatus, string> = {
  completed: "text-[#16a34a]",
  pending: "text-[#ca8a04]",
  failed: "text-[#ef4444]",
  refunded: "text-[#7c3aed]",
};

type InvoiceDialogProps = {
  open: boolean;
  onClose: () => void;
  transaction: TransactionRecord | null;
  receipt: TransactionReceipt | null;
  loading: boolean;
};

function formatMoney(currency: string, amount: number) {
  return `${currency.toUpperCase()} ${amount.toLocaleString()}`;
}

function formatPurchaseDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${String(date.getFullYear()).slice(-2)} / ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatProvider(provider: string) {
  if (!provider) return "—";
  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

function maskReference(reference: string | null | undefined) {
  if (!reference) return null;
  const digits = reference.replace(/\s/g, "");
  if (digits.length < 4) return `*******${digits}`;
  return `*******${digits.slice(-4)}`;
}

function getInvoiceHtml(title: string, innerHtml: string) {
  return `<html><head><title>${title}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; color: #111827; }
        h2 { font-size: 20px; margin-bottom: 8px; }
        .section { margin-bottom: 24px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .label { color: #6b7280; font-size: 13px; }
        .value { font-size: 14px; font-weight: 500; }
        .blue { color: #2563eb; }
        .green { color: #16a34a; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
        th { background: #f9fafb; font-weight: 600; }
        .separator { border-top: 1px solid #e5e7eb; margin: 16px 0; }
        .total-row { display: flex; justify-content: space-between; padding: 6px 0; }
        .total-label { color: #6b7280; }
        .total-value { font-weight: 600; }
        .highlight { color: #2563eb; font-weight: 700; font-size: 16px; }
      </style></head><body>
      ${innerHtml}
      </body></html>`;
}

export function InvoiceDialog({
  open,
  onClose,
  transaction,
  receipt,
  loading,
}: InvoiceDialogProps) {
  if (!transaction) return null;

  const tx = transaction;
  const currency = tx.currency || "USD";
  const couponAmount = tx.discount_amount ?? 0;
  const coinsAmount = tx.coins_discount_amount ?? 0;
  const paidAmount = tx.amount ?? 0;
  const subTotal = paidAmount + couponAmount + coinsAmount;
  const receivedPayment = tx.status === "completed" ? paidAmount : 0;
  const orderLabel = receipt?.certificate_number
    ? `Certificate ${receipt.certificate_number}`
    : tx.quiz_attempt_id
      ? `Quiz Attempt #${tx.quiz_attempt_id}`
      : "Order";
  const billToName =
    receipt?.user_email?.split("@")[0] || `User #${tx.user_id}`;
  const maskedAccount = maskReference(tx.provider_reference);
  const invoiceTitle = `Invoice #${tx.id}`;

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const content = document.getElementById("invoice-content");
    if (!content) return;
    printWindow.document.write(getInvoiceHtml(invoiceTitle, content.innerHTML));
    printWindow.document.close();
    printWindow.print();
  }

  function handleDownload() {
    const content = document.getElementById("invoice-content");
    if (!content) return;
    const blob = new Blob([getInvoiceHtml(invoiceTitle, content.innerHTML)], {
      type: "text/html",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${tx.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Dialog open={open} onClose={onClose} title="Invoice" maxWidth="max-w-xl px-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-[#2563eb]" />
          <span className="ml-2 text-sm text-[#6b7280]">Loading receipt...</span>
        </div>
      ) : (
        <div id="invoice-content" className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-sm text-[#9ca3af]">Order ID#</span>
              <span className="text-sm font-bold text-[#2563eb]">
                {tx.id}
              </span>
            </div>
            <span
              className={`text-sm font-medium ${STATUS_TEXT_CLASS[tx.status] ?? "text-[#6b7280]"}`}
            >
              {TRANSACTION_STATUS_LABELS[tx.status] ?? tx.status}
            </span>
          </div>

          <div className="border-t border-[#eef1f6]" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-[#9ca3af]">Customer ID#</p>
              <p className="mt-0.5 text-sm font-medium text-[#111827]">
                {tx.user_id}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-[#9ca3af]">Purchase Date</p>
              <p className="mt-0.5 text-sm font-medium text-[#111827]">
                {formatPurchaseDate(tx.completed_at ?? tx.created_at)}
              </p>
            </div>
          </div>

          <div className="border-t border-[#eef1f6]" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-[#9ca3af]">Bill to:</p>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold capitalize text-[#111827]">
                  {billToName}
                </p>
                {receipt?.user_email && (
                  <p className="text-sm text-[#111827]">{receipt.user_email}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="mb-2 text-sm text-[#9ca3af]">Bill from:</p>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-[#111827]">
                  {BILL_FROM.name}
                </p>
                <p className="text-sm text-[#111827]">{BILL_FROM.company}</p>
                <p className="text-sm text-[#111827]">{BILL_FROM.phone}</p>
                <p className="text-sm text-[#111827]">{BILL_FROM.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#eef1f6]" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#9ca3af]">Payment Method:</p>
              <p className="mt-1 text-sm font-semibold text-[#111827]">
                {formatProvider(tx.provider)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#6b7280]">
                {maskedAccount || tx.provider_reference || "—"}
              </p>
              <p className="mt-1 text-sm font-semibold capitalize text-[#111827]">
                {billToName}
              </p>
            </div>
          </div>

          <div className="border-t border-[#eef1f6]" />

          <div>
            <div className="flex justify-between text-sm text-[#9ca3af]">
              <span>Order</span>
              <span>Amount</span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-[#111827]">{orderLabel}</span>
              <span className="font-medium text-[#111827]">
                {formatMoney(currency, subTotal)}
              </span>
            </div>
            <div className="mt-3 flex justify-between text-sm font-semibold text-[#111827]">
              <span>Sub Total</span>
              <span>{formatMoney(currency, subTotal)}</span>
            </div>
          </div>

          <div className="border-t border-[#eef1f6]" />

          <div>
            <p className="mb-3 text-sm text-[#9ca3af]">Discounts</p>
            {couponAmount > 0 && (
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-[#111827]">
                  Coupon
                  {subTotal > 0
                    ? ` (${Math.round((couponAmount / subTotal) * 100)}%)`
                    : ""}
                </span>
                <span className="font-medium text-[#111827]">
                  {currency.toUpperCase()} ({couponAmount.toLocaleString()})
                </span>
              </div>
            )}
            {(coinsAmount > 0 || (tx.coins_spent ?? 0) > 0) && (
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-[#111827]">
                  Coins{tx.coins_spent ? ` (${tx.coins_spent})` : ""}
                </span>
                <span className="font-medium text-[#111827]">
                  {currency.toUpperCase()} ({coinsAmount.toLocaleString()})
                </span>
              </div>
            )}
            <div className="mt-3 flex justify-between text-sm font-semibold text-[#111827]">
              <span>Gross Total</span>
              <span>{formatMoney(currency, paidAmount)}</span>
            </div>
          </div>

          <div className="border-t border-[#eef1f6]" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-[#111827]">
              <span>Total</span>
              <span>{formatMoney(currency, paidAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#2563eb]">
              <span>Received Payment</span>
              <span>{formatMoney(currency, receivedPayment)}</span>
            </div>
          </div>

          {tx.failure_reason && (
            <>
              <div className="border-t border-[#eef1f6]" />
              <div>
                <p className="text-sm text-[#9ca3af]">Failure Reason</p>
                <p className="mt-0.5 text-sm font-medium text-[#ef4444]">
                  {tx.failure_reason}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3 border-t border-[#eef1f6] pt-5">
        <button
          type="button"
          onClick={handlePrint}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
        >
          <Printer className="size-4" />
          Print
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2563eb] px-5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
        >
          <Download className="size-4" />
          Download
        </button>
      </div>
    </Dialog>
  );
}
