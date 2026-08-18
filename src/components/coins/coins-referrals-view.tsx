"use client";

import { useState } from "react";
import { Settings, Download, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { Pagination } from "@/components/shared/pagination";
import { CoinsTable } from "@/components/coins/coins-table";
import { ReferralsTable } from "@/components/coins/referrals-table";
import {
  coinTransactions,
  referralRecords,
  coinTypeOptions,
  referralStatusOptions,
  dateFilterOptions,
  coinSourceOptions,
} from "@/data/coins";
import type { CoinTransaction, ReferralRecord } from "@/data/coins";

const PAGE_SIZE = 6;

export function CoinsReferralsView({ initialTab = "coins" }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<"coins" | "referrals">(initialTab === "referrals" ? "referrals" : "coins");

  const [coinTypeFilter, setCoinTypeFilter] = useState<string>("Type");
  const [coinDateFilter, setCoinDateFilter] = useState<string>("By Date");
  const [referralStatusFilter, setReferralStatusFilter] = useState<string>("Status");
  const [referralDateFilter, setReferralDateFilter] = useState<string>("By Date");

  const [coinPage, setCoinPage] = useState(1);
  const [referralPage, setReferralPage] = useState(1);

  const [deleteCoinTarget, setDeleteCoinTarget] = useState<CoinTransaction | null>(null);
  const [deleteReferralTarget, setDeleteReferralTarget] = useState<ReferralRecord | null>(null);
  const [editCoinTarget, setEditCoinTarget] = useState<CoinTransaction | null>(null);
  const [editReferralTarget, setEditReferralTarget] = useState<ReferralRecord | null>(null);
  const [rewardRulesOpen, setRewardRulesOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Reward rules state
  const [rules, setRules] = useState([
    { label: "Referral Bonus", value: "100", unit: "Coins per referral", enabled: true },
    { label: "Quiz Completion Bonus", value: "10", unit: "Coins per quiz", enabled: false },
    { label: "Certificate Bonus", value: "50", unit: "Coins per certificate", enabled: true },
  ]);

  // Edit coin form state
  const [editCoinForm, setEditCoinForm] = useState({ count: "", source: "" });
  // Edit referral form state
  const [editReferralForm, setEditReferralForm] = useState({ status: "", amount: "", awardCoins: false });

  const filteredCoins = coinTransactions.filter((tx) => {
    if (coinTypeFilter !== "Type" && tx.type !== coinTypeFilter) return false;
    return true;
  });

  const filteredReferrals = referralRecords.filter((r) => {
    if (referralStatusFilter !== "Status" && r.status !== referralStatusFilter) return false;
    return true;
  });

  const coinTotalPages = Math.max(1, Math.ceil(filteredCoins.length / PAGE_SIZE));
  const referralTotalPages = Math.max(1, Math.ceil(filteredReferrals.length / PAGE_SIZE));

  const coinPageItems = filteredCoins.slice((coinPage - 1) * PAGE_SIZE, coinPage * PAGE_SIZE);
  const referralPageItems = filteredReferrals.slice((referralPage - 1) * PAGE_SIZE, referralPage * PAGE_SIZE);

  function openEditCoin(tx: CoinTransaction) {
    setEditCoinForm({ count: String(tx.count), source: tx.source });
    setEditCoinTarget(tx);
  }

  function saveEditCoin() {
    setEditCoinTarget(null);
  }

  function openEditReferral(r: ReferralRecord) {
    setEditReferralForm({ status: r.status, amount: r.amount !== null ? String(r.amount) : "", awardCoins: r.awardCoins });
    setEditReferralTarget(r);
  }

  function saveEditReferral() {
    setEditReferralTarget(null);
  }

  function handleExport(format: string) {
    setExportOpen(false);
  }

  const tabs = [
    { id: "coins" as const, label: "Coins" },
    { id: "referrals" as const, label: "Referrals" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Coins & Referrals
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRewardRulesOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f2937]"
          >
            <Settings className="size-4" />
            Reward Rules
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen((prev) => !prev)}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
            >
              <Download className="size-4" />
              Export Logs
              <ChevronDown className="size-4" />
            </button>
            {exportOpen ? (
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-44">
                <div className="overflow-hidden rounded-2xl border border-[#eef1f6] bg-white shadow-[0_12px_30px_rgba(16,24,40,0.14)]">
                  <ul className="py-1.5">
                    <li>
                      <button
                        type="button"
                        onClick={() => handleExport("csv")}
                        className="flex w-full px-4 py-3 text-sm font-medium text-[#111827] transition hover:bg-[#f8fafc]"
                      >
                        Export as CSV
                      </button>
                    </li>
                    <div className="mx-3 h-px bg-[#eef1f6]" />
                    <li>
                      <button
                        type="button"
                        onClick={() => handleExport("pdf")}
                        className="flex w-full px-4 py-3 text-sm font-medium text-[#111827] transition hover:bg-[#f8fafc]"
                      >
                        Export as PDF
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 rounded-xl bg-[#f3f4f6] p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === "coins") setCoinPage(1);
              else setReferralPage(1);
            }}
            className={`inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-white text-[#111827] shadow-sm"
                : "text-[#6b7280] hover:text-[#374151]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Coins Tab */}
      {activeTab === "coins" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu
              label="By Date"
              options={dateFilterOptions}
              value={coinDateFilter}
              onChange={(v) => { setCoinDateFilter(v); setCoinPage(1); }}
            />
            <DropdownMenu
              label="Type"
              options={["Type", ...coinTypeOptions]}
              value={coinTypeFilter}
              onChange={(v) => { setCoinTypeFilter(v); setCoinPage(1); }}
            />
          </div>

          <CoinsTable
            transactions={coinPageItems}
            onEdit={openEditCoin}
            onDelete={setDeleteCoinTarget}
          />

          <Pagination
            currentPage={coinPage}
            totalPages={coinTotalPages}
            onPageChange={setCoinPage}
          />
        </div>
      ) : null}

      {/* Referrals Tab */}
      {activeTab === "referrals" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu
              label="By Date"
              options={dateFilterOptions}
              value={referralDateFilter}
              onChange={(v) => { setReferralDateFilter(v); setReferralPage(1); }}
            />
            <DropdownMenu
              label="Status"
              options={["Status", ...referralStatusOptions]}
              value={referralStatusFilter}
              onChange={(v) => { setReferralStatusFilter(v); setReferralPage(1); }}
            />
          </div>

          <ReferralsTable
            referrals={referralPageItems}
            onEdit={openEditReferral}
            onDelete={setDeleteReferralTarget}
          />

          <Pagination
            currentPage={referralPage}
            totalPages={referralTotalPages}
            onPageChange={setReferralPage}
          />
        </div>
      ) : null}

      {/* Delete Coin Confirmation */}
      <Dialog
        open={!!deleteCoinTarget}
        onClose={() => setDeleteCoinTarget(null)}
        title="Delete Coin Transaction"
      >
        <p className="text-[15px] text-[#4b5563]">
          Are you sure you want to delete the coin transaction for <span className="font-semibold text-[#111827]">{deleteCoinTarget?.userName}</span>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteCoinTarget(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setDeleteCoinTarget(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white transition hover:bg-[#dc2626]"
          >
            Delete
          </button>
        </div>
      </Dialog>

      {/* Delete Referral Confirmation */}
      <Dialog
        open={!!deleteReferralTarget}
        onClose={() => setDeleteReferralTarget(null)}
        title="Delete Referral"
      >
        <p className="text-[15px] text-[#4b5563]">
          Are you sure you want to delete the referral by <span className="font-semibold text-[#111827]">{deleteReferralTarget?.referrerName}</span>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteReferralTarget(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setDeleteReferralTarget(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white transition hover:bg-[#dc2626]"
          >
            Delete
          </button>
        </div>
      </Dialog>

      {/* Edit Coin Dialog */}
      <Dialog
        open={!!editCoinTarget}
        onClose={() => setEditCoinTarget(null)}
        title="Edit Coins"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">
              Coin Count<span className="ml-0.5 text-[#ff0000]">*</span>
            </label>
            <input
              type="number"
              value={editCoinForm.count}
              onChange={(e) => setEditCoinForm((prev) => ({ ...prev, count: e.target.value }))}
              className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
              placeholder="Enter coin count"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">Source</label>
            <select
              value={editCoinForm.source}
              onChange={(e) => setEditCoinForm((prev) => ({ ...prev, source: e.target.value }))}
              className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            >
              {coinSourceOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setEditCoinTarget(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveEditCoin}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400]"
          >
            Save Changes
          </button>
        </div>
      </Dialog>

      {/* Edit Referral Dialog */}
      <Dialog
        open={!!editReferralTarget}
        onClose={() => setEditReferralTarget(null)}
        title="Edit Referral"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">Status</label>
            <select
              value={editReferralForm.status}
              onChange={(e) => setEditReferralForm((prev) => ({ ...prev, status: e.target.value }))}
              className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            >
              {referralStatusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">Coin Amount</label>
            <input
              type="number"
              value={editReferralForm.amount}
              onChange={(e) => setEditReferralForm((prev) => ({ ...prev, amount: e.target.value }))}
              className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
              placeholder="Enter coin amount"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#e5e7eb] px-4 py-3">
            <span className="text-sm font-medium text-[#374151]">Award Coins</span>
            <button
              type="button"
              role="switch"
              aria-checked={editReferralForm.awardCoins}
              onClick={() => setEditReferralForm((prev) => ({ ...prev, awardCoins: !prev.awardCoins }))}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                editReferralForm.awardCoins ? "bg-[#2563eb]" : "bg-[#d1d5db]"
              }`}
            >
              <span
                className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
                  editReferralForm.awardCoins ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setEditReferralTarget(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveEditReferral}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400]"
          >
            Save Changes
          </button>
        </div>
      </Dialog>

      {/* Reward Rules Dialog */}
      <Dialog
        open={rewardRulesOpen}
        onClose={() => setRewardRulesOpen(false)}
        title="Reward Rules"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-4 rounded-xl border border-[#e5e7eb] px-4 py-3">
              <div className="flex-1 space-y-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#6b7280]">Rule Name</label>
                  <input
                    type="text"
                    value={rule.label}
                    onChange={(e) => {
                      const next = [...rules];
                      next[idx] = { ...next[idx], label: e.target.value };
                      setRules(next);
                    }}
                    className="h-9 rounded-lg border border-[#e5e7eb] px-3 text-sm text-[#111827] outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[13px] font-medium text-[#6b7280]">Value</label>
                    <input
                      type="number"
                      value={rule.value}
                      onChange={(e) => {
                        const next = [...rules];
                        next[idx] = { ...next[idx], value: e.target.value };
                        setRules(next);
                      }}
                      className="mt-1 h-9 w-full rounded-lg border border-[#e5e7eb] px-3 text-sm text-[#111827] outline-none focus:border-[#2563eb]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[13px] font-medium text-[#6b7280]">Unit</label>
                    <input
                      type="text"
                      value={rule.unit}
                      onChange={(e) => {
                        const next = [...rules];
                        next[idx] = { ...next[idx], unit: e.target.value };
                        setRules(next);
                      }}
                      className="mt-1 h-9 w-full rounded-lg border border-[#e5e7eb] px-3 text-sm text-[#111827] outline-none focus:border-[#2563eb]"
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={rule.enabled}
                onClick={() => {
                  const next = [...rules];
                  next[idx] = { ...next[idx], enabled: !next[idx].enabled };
                  setRules(next);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  rule.enabled ? "bg-[#2563eb]" : "bg-[#d1d5db]"
                }`}
              >
                <span
                  className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
                    rule.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setRewardRulesOpen(false)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setRewardRulesOpen(false)}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400]"
          >
            Save Rules
          </button>
        </div>
      </Dialog>
    </div>
  );
}
