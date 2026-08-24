import { coinRewardService } from "@/services/coin-reward.service";
import { formatDateTime } from "@/lib/utils";
import type { PaginatedData } from "@/types/api.types";
import type { CoinHistoryItem } from "@/types/coin-reward.types";

export type ExportableTab = "coins" | "wallets" | "referrals";

export type ExportTable = {
  title: string;
  filename: string;
  headers: string[];
  rows: string[][];
};

const PAGE_SIZE = 100;

async function fetchAllPages<T>(
  load: (page: number, perPage: number) => Promise<PaginatedData<T>>,
) {
  const first = await load(1, PAGE_SIZE);
  const items = [...(first.items ?? [])];
  const totalPages = Math.max(1, first.total_pages ?? 1);

  for (let page = 2; page <= totalPages; page += 1) {
    const next = await load(page, PAGE_SIZE);
    items.push(...(next.items ?? []));
  }

  return items;
}

function formatDetails(details: Record<string, unknown>) {
  const entries = Object.entries(details).filter(([, value]) => value !== null && value !== undefined);
  if (entries.length === 0) return "--";
  return entries.map(([key, value]) => `${key}: ${String(value)}`).join("; ");
}

function formatType(type: string) {
  if (!type) return "--";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function stamp() {
  return new Date().toISOString().slice(0, 10);
}

function fileSafe(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "user";
}

function mapHistoryRows(items: CoinHistoryItem[]) {
  return items.map((item) => [
    formatType(item.transaction_type),
    String(item.amount),
    formatDateTime(item.created_at),
    formatDateTime(item.expires_at),
    formatDetails(item.details ?? {}),
  ]);
}

export async function buildCoinLogsExport(options: {
  tab: ExportableTab;
  userId: number | null;
  username: string | null;
}): Promise<ExportTable> {
  const date = stamp();

  if (options.tab === "coins") {
    if (options.userId === null) {
      throw new Error("Select a user before exporting coin logs.");
    }

    const items = await fetchAllPages((page, perPage) =>
      coinRewardService.getAdminUserHistory(options.userId as number, { page, per_page: perPage }),
    );
    const username = options.username ?? "user";

    return {
      title: `Coin History - ${username}`,
      filename: `coin-history-${fileSafe(username)}-${date}`,
      headers: ["Type", "Amount", "Created At", "Expires At", "Details"],
      rows: mapHistoryRows(items),
    };
  }

  if (options.tab === "wallets") {
    const items = await fetchAllPages((page, perPage) =>
      coinRewardService.getAdminWallets({ page, per_page: perPage }),
    );

    return {
      title: "Wallets",
      filename: `wallets-${date}`,
      headers: ["Username", "Email", "Total Coins", "Remaining Balance"],
      rows: items.map((wallet) => [
        wallet.user.username,
        wallet.user.email,
        String(wallet.total_coin),
        String(wallet.remaining_balance),
      ]),
    };
  }

  const items = await fetchAllPages((page, perPage) =>
    coinRewardService.getReferralUsers({ page, per_page: perPage }),
  );

  return {
    title: "Referral Users",
    filename: `referrals-${date}`,
    headers: ["Username", "Email", "Status", "Referred By", "Joined On", "Email Verified", "Active"],
    rows: items.map((user) => [
      user.username,
      user.email,
      user.referral_status || "--",
      user.referrer ? `${user.referrer.username} (${user.referrer.email})` : "--",
      formatDateTime(user.join_date),
      user.is_email_verified ? "Yes" : "No",
      user.is_active ? "Yes" : "No",
    ]),
  };
}
