"use client";

import { useEffect, useRef, useState } from "react";
import { Settings, Download, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { Pagination } from "@/components/shared/pagination";
import { Can } from "@/components/shared/can";
import { CoinHistoryTable } from "@/components/coins/coin-history-table";
import { buildCoinLogsExport } from "@/components/coins/export-coin-logs";
import { ReferralUsersTable } from "@/components/coins/referral-users-table";
import { RewardRulesDialog } from "@/components/coins/reward-rules-dialog";
import { WalletsTable } from "@/components/coins/wallets-table";
import { useAdminWallets } from "@/hooks/coin-reward/use-admin-wallets";
import { useMyWallet } from "@/hooks/coin-reward/use-my-wallet";
import { useReferralUsers } from "@/hooks/coin-reward/use-referral-users";
import { useUserCoinHistory } from "@/hooks/coin-reward/use-user-coin-history";
import { downloadCsv, downloadPdf } from "@/lib/export-file";
import { ApiError } from "@/lib/api-error";
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
  const [exporting, setExporting] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const myWalletQuery = useMyWallet();

  // Wallets tab (paginated)
  const walletsQuery = useAdminWallets({ perPage: PAGE_SIZE });

  // Full wallet list powers the user selector on the Coins tab
  const userOptionsQuery = useAdminWallets({ perPage: 100 });

  const [selectedUsername, setSelectedUsername] = useState<string>(USER_PLACEHOLDER);

  const usernames = userOptionsQuery.items.map((wallet) => wallet.user.username);
  const activeUsername =
    selectedUsername !== USER_PLACEHOLDER && usernames.includes(selectedUsername)
      ? selectedUsername
      : usernames[0] ?? null;
  const selectedUserId = activeUsername
    ? userOptionsQuery.items.find((wallet) => wallet.user.username === activeUsername)?.user.id ?? null
    : null;

  const historyQuery = useUserCoinHistory({ userId: selectedUserId, perPage: PAGE_SIZE });

  // Referrals tab (paginated)
  const referralsQuery = useReferralUsers({ perPage: PAGE_SIZE });

  function handleSelectUser(username: string) {
    if (username === USER_PLACEHOLDER || username === activeUsername) return;
    setSelectedUsername(username);
    historyQuery.goToPage(1);
  }

  function handleViewHistory(wallet: AdminWallet) {
    if (wallet.user.username !== activeUsername) {
      setSelectedUsername(wallet.user.username);
      historyQuery.goToPage(1);
    }
    setActiveTab("coins");
  }

  useEffect(() => {
    if (!exportOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!exportMenuRef.current?.contains(event.target as Node)) {
        setExportOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setExportOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [exportOpen]);

  async function handleExport(format: "csv" | "pdf") {
    if (exporting) return;
    setExportOpen(false);
    setExporting(true);
    const toastId = toast.loading(`Preparing ${format.toUpperCase()} export...`);

    try {
      const table = await buildCoinLogsExport({
        tab: activeTab,
        userId: selectedUserId,
        username: activeUsername,
      });

      if (table.rows.length === 0) {
        toast.error("No data available to export.", { id: toastId });
        return;
      }

      if (format === "csv") {
        downloadCsv(`${table.filename}.csv`, table.headers, table.rows);
      } else {
        downloadPdf(`${table.filename}.pdf`, table.title, table.headers, table.rows);
      }

      toast.success(`Exported as ${format.toUpperCase()}`, { id: toastId });
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message, { id: toastId });
    } finally {
      setExporting(false);
    }
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "coins", label: "Coins" },
    { id: "wallets", label: "Wallets" },
    { id: "referrals", label: "Referrals" },
  ];

  const userOptions = [USER_PLACEHOLDER, ...usernames];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Coins & Referrals
        </h1>
        <div className="flex items-center gap-3">
          <Can permission="reward_rule:update">
            <button
              type="button"
              onClick={() => setRewardRulesOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f2937]"
            >
              <Settings className="size-4" />
              Reward Rules
            </button>
          </Can>
          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setExportOpen((prev) => !prev)}
              disabled={exporting}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400] disabled:pointer-events-none disabled:opacity-60"
            >
              <Download className="size-4" />
              {exporting ? "Exporting..." : "Export Logs"}
              <ChevronDown className="size-4" />
            </button>
            {exportOpen ? (
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-44">
                <div className="overflow-hidden rounded-2xl border border-[#eef1f6] bg-white shadow-[0_12px_30px_rgba(16,24,40,0.14)]">
                  <ul className="py-1.5">
                    <li>
                      <button
                        type="button"
                        onClick={() => void handleExport("csv")}
                        className="flex w-full px-4 py-3 text-sm font-medium text-[#111827] transition hover:bg-[#f8fafc]"
                      >
                        Export as CSV
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => void handleExport("pdf")}
                        className="flex w-full border-t border-[#eef1f6] px-4 py-3 text-sm font-medium text-[#111827] transition hover:bg-[#f8fafc]"
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
              value={activeUsername ?? USER_PLACEHOLDER}
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
            onPageChange={historyQuery.goToPage}
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
            onPageChange={walletsQuery.goToPage}
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
            onPageChange={referralsQuery.goToPage}
          />
        </div>
      ) : null}

      <RewardRulesDialog open={rewardRulesOpen} onClose={() => setRewardRulesOpen(false)} />
    </div>
  );
}
