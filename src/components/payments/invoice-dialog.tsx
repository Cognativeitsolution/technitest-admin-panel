"use client";

import { Printer, Download, X } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { TransactionStatusBadge } from "@/components/payments/transaction-status-badge";
import type { PaymentTransaction } from "@/data/payments";

type InvoiceDialogProps = {
  open: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
};

export function InvoiceDialog({
  open,
  onClose,
  transaction,
}: InvoiceDialogProps) {
  if (!transaction) return null;

  const tx = transaction;

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const content = document.getElementById("invoice-content");
    if (!content) return;
    printWindow.document.write(`
      <html><head><title>Invoice ${tx.orderId}</title>
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
      ${content.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  function handleDownload() {
    const content = document.getElementById("invoice-content");
    if (!content) return;
    const blob = new Blob([`
      <html><head><title>Invoice ${tx.orderId}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; color: #111827; }
        h2 { font-size: 20px; margin-bottom: 8px; }
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
      ${content.innerHTML}
      </body></html>
    `], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${tx.orderId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Invoice"
      maxWidth="max-w-3xl"
    >
      <div id="invoice-content" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-sm text-[#6b7280]">Order ID#</span>
            <span className="ml-2 text-sm font-bold text-[#2563eb]">
              {tx.orderId}
            </span>
          </div>
          <TransactionStatusBadge status={tx.status} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-sm text-[#6b7280]">Customer ID#</span>
            <span className="ml-2 text-sm font-medium text-[#111827]">
              {tx.customerId}
            </span>
          </div>
          <div>
            <span className="text-sm text-[#6b7280]">Purchase Date</span>
            <span className="ml-2 text-sm font-medium text-[#111827]">
              {tx.purchaseDate}
            </span>
          </div>
        </div>

        <div className="border-t border-[#eef1f6]" />

        {/* Billing Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-3 text-sm font-bold text-[#111827]">Bill to</h4>
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#111827]">
                {tx.billingTo.name}
              </p>
              <p className="text-sm text-[#6b7280]">{tx.billingTo.company}</p>
              <p className="text-sm text-[#6b7280]">{tx.billingTo.phone}</p>
              <p className="text-sm text-[#6b7280]">{tx.billingTo.email}</p>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold text-[#111827]">
              Bill from
            </h4>
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#111827]">
                {tx.billingFrom.name}
              </p>
              <p className="text-sm text-[#6b7280]">{tx.billingFrom.company}</p>
              <p className="text-sm text-[#6b7280]">{tx.billingFrom.phone}</p>
              <p className="text-sm text-[#6b7280]">{tx.billingFrom.email}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#eef1f6]" />

        {/* Payment Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <span className="text-sm text-[#6b7280]">Payment method</span>
            <p className="mt-1 text-sm font-medium text-[#111827]">
              {tx.paymentMethod.method}
            </p>
          </div>
          <div>
            <span className="text-sm text-[#6b7280]">
              {tx.paymentMethod.maskedNumber}
            </span>
            <p className="mt-1 text-sm font-medium text-[#111827]">
              {tx.paymentMethod.holderName}
            </p>
          </div>
        </div>

        <div className="border-t border-[#eef1f6]" />

        {/* Order Items */}
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#eef1f6] text-[13px] font-semibold text-[#374151]">
                <th className="pb-2 text-left">Order</th>
                <th className="pb-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {tx.orderItems.map((item, idx) => (
                <tr key={idx} className="border-b border-[#eef1f6]">
                  <td className="py-3 text-sm text-[#111827]">{item.order}</td>
                  <td className="py-3 text-sm font-medium text-[#111827]">
                    {item.currency} {item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="py-3 text-sm font-semibold text-[#111827]">
                  Sub Total
                </td>
                <td className="py-3 text-sm font-semibold text-[#111827]">
                  {tx.priceSummary.currency}{" "}
                  {tx.orderItems
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#eef1f6]" />

        {/* Price Breakdown */}
        <div>
          <h4 className="mb-3 text-sm font-bold text-[#111827]">
            Price Info
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7280]">
                {tx.priceSummary.couponLabel}
              </span>
              <span className="font-medium text-[#111827]">
                {tx.priceSummary.currency} (
                {tx.priceSummary.couponAmount.toLocaleString()})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7280]">
                {tx.priceSummary.coinsLabel}
              </span>
              <span className="font-medium text-[#111827]">
                {tx.priceSummary.currency} (
                {tx.priceSummary.coinsAmount.toLocaleString()})
              </span>
            </div>
            <div className="flex justify-between border-t border-[#eef1f6] pt-2 text-sm">
              <span className="font-semibold text-[#111827]">
                Gross Total
              </span>
              <span className="font-semibold text-[#111827]">
                {tx.priceSummary.currency}{" "}
                {tx.priceSummary.grossTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#eef1f6]" />

        {/* Final Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#6b7280]">Total</span>
            <span className="font-semibold text-[#111827]">
              {tx.priceSummary.currency}{" "}
              {tx.priceSummary.total.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold text-[#2563eb]">
              Received Payment
            </span>
            <span className="font-bold text-[#2563eb]">
              {tx.priceSummary.currency}{" "}
              {tx.priceSummary.receivedPayment.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3 border-t border-[#eef1f6] pt-5">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          <Printer className="size-4" />
          Print
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2563eb] px-5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
        >
          <Download className="size-4" />
          Download
        </button>
      </div>
    </Dialog>
  );
}
