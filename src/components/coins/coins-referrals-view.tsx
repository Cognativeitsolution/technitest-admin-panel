"use client";

import { useEffect, useMemo, useState } from "react";
import { Settings, Download, ChevronDown } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { Pagination } from "@/components/shared/pagination";
import { CoinHistoryTable } from "@/components/coins/coin-history-table";
import { ReferralUsersTable } from "@/components/coins/referral-users-table";
import { WalletsTable } from "@/components/coins/wallets-table";
import { useAdminWallets } from "@/hooks/coin-reward/use-admin-wallets";
import { useMyWallet } from "@/hooks/coin-reward/use-my-wallet";
import { useReferralUsers } from "@/hooks/coin-reward/use-referral-users";
import { useUserCoinHistory } from "@/hooks/coin-reward/use-user-coin-history";
import type { AdminWallet } from "@/types/coin-reward.types";

const PAGE_SIZE = 10;
const USER_PLACEHOLDER = "Select User";

type TabId = "coins" | "wallets" | "referrals";

export function CoinsReferralsView({ initialTab = "coins" }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<TabId>(
    initialTab === "referrals" ? "referrals" : initialTab === "wallets" ? "wallets" : "coins",
  );

  const [rewardRulesOpen, setRewardRulesOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Reward rules state
  const [rules, setRules] = useState([
    { label: "Referral Bonus", value: "100", unit: "Coins per referral", enabled: true },
    { label: "Quiz Completion Bonus", value: "10", unit: "Coins per quiz", enabled: false },
    { label: "Certificate Bonus", value: "50", unit: "Coins per certificate", enabled: true },
  ]);

  const myWalletQuery = useMyWallet();

  // Wallets tab (paginated)
  const [walletPage, setWalletPage] = useState(1);
  const walletsQuery = useAdminWallets({ page: walletPage, perPage: PAGE_SIZE });

  // Full wallet list powers the user selector on the Coins tab
  const userOptionsQuery = useAdminWallets({ page: 1, perPage: 100 });

  const [selectedUsername, setSelectedUsername] = useState<string>(USER_PLACEHOLDER);
  const [historyPage, setHistoryPage] = useState(1);

  useEffect(() => {
    if (selectedUsername === USER_PLACEHOLDER && userOptionsQuery.items.length > 0) {
      setSelectedUsername(userOptionsQuery.items[0].user.username);
    }
  }, [selectedUsername, userOptionsQuery.items]);

  const selectedUserId = useMemo(
    () =>
      userOptionsQuery.items.find((wallet) => wallet.user.username === selectedUsername)?.user.id ?? null,
    [userOptionsQuery.items, selectedUsername],
  );

  const historyQuery = useUserCoinHistory({ userId: selectedUserId, page: historyPage, perPage: PAGE_SIZE });

  // Referrals tab (paginated)
  const [referralPage, setReferralPage] = useState(1);
  const referralsQuery = useReferralUsers({ page: referralPage, perPage: PAGE_SIZE });

  function handleSelectUser(username: string) {
    if (username === selectedUsername) return;
    setSelectedUsername(username);
    setHistoryPage(1);
  }

  function handleViewHistory(wallet: AdminWallet) {
    setSelectedUsername(wallet.user.username);
    setHistoryPage(1);
    setActiveTab("coins");
  }

  function handleExport(format: string) {
    setExportOpen(false);
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "coins", label: "Coins" },
    { id: "wallets", label: "Wallets" },
    { id: "referrals", label: "Referrals" },
  ];

  const userOptions = [USER_PLACEHOLDER, ...userOptionsQuery.items.map((wallet) => wallet.user.username)];

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

      {/* My Wallet Summary */}
      {myWalletQuery.wallet ? (
        <div className="grid max-w-xl grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#e8ecf2] bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
            <p className="text-[13px] font-medium text-[#6b7280]">Your Total Coins</p>
            <p className="mt-1 text-[22px] font-bold text-[#111827]">{myWalletQuery.wallet.total_coin}</p>
          </div>
          <div className="rounded-2xl border border-[#e8ecf2] bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
            <p className="text-[13px] font-medium text-[#6b7280]">Your Remaining Balance</p>
            <p className="mt-1 text-[22px] font-bold text-[#111827]">{myWalletQuery.wallet.remaining_balance}</p>
          </div>
        </div>
      ) : null}

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 rounded-xl bg-[#f3f4f6] p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
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
              label={USER_PLACEHOLDER}
              options={userOptions}
              value={selectedUsername}
              onChange={handleSelectUser}
            />
            {userOptionsQuery.error ? (
              <p className="text-sm text-[#ef4444]">{userOptionsQuery.error}</p>
            ) : null}
          </div>

          {historyQuery.error ? (
            <p className="text-sm text-[#ef4444]">{historyQuery.error}</p>
          ) : null}

          <CoinHistoryTable items={historyQuery.items} loading={historyQuery.loading} />

          <Pagination
            currentPage={historyQuery.pagination.page}
            totalPages={historyQuery.pagination.totalPages}
            onPageChange={setHistoryPage}
          />
        </div>
      ) : null}

      {/* Wallets Tab */}
      {activeTab === "wallets" ? (
        <div className="space-y-4">
          {walletsQuery.error ? (
            <p className="text-sm text-[#ef4444]">{walletsQuery.error}</p>
          ) : null}

          <WalletsTable
            wallets={walletsQuery.items}
            loading={walletsQuery.loading}
            onViewHistory={handleViewHistory}
          />

          <Pagination
            currentPage={walletsQuery.pagination.page}
            totalPages={walletsQuery.pagination.totalPages}
            onPageChange={setWalletPage}
          />
        </div>
      ) : null}

      {/* Referrals Tab */}
      {activeTab === "referrals" ? (
        <div className="space-y-4">
          {referralsQuery.error ? (
            <p className="text-sm text-[#ef4444]">{referralsQuery.error}</p>
          ) : null}

          <ReferralUsersTable users={referralsQuery.items} loading={referralsQuery.loading} />

          <Pagination
            currentPage={referralsQuery.pagination.page}
            totalPages={referralsQuery.pagination.totalPages}
            onPageChange={setReferralPage}
          />
        </div>
      ) : null}

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
