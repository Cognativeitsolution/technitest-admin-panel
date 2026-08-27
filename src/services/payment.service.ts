import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  TransactionReceipt,
  TransactionRecord,
  TransactionsListResult,
  TransactionsQuery,
  TransactionStatusResponse,
} from "@/types/payment.types";

const BASE = "/api/v1/payment/transactions";

export const paymentService = {
  getTransactions: async (params?: TransactionsQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<TransactionsListResult>>(
      BASE,
      { params },
    );
    return data.response.data;
  },

  getTransactionById: async (transactionId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<TransactionRecord>>(
      `${BASE}/${transactionId}`,
    );
    return data.response.data;
  },

  getTransactionStatus: async (transactionId: number) => {
    const { data } = await apiClient.get<
      ApiEnvelope<TransactionStatusResponse>
    >(`${BASE}/${transactionId}/status`);
    return data.response.data;
  },

  getTransactionReceipt: async (transactionId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<TransactionReceipt>>(
      `${BASE}/${transactionId}/receipt`,
    );
    return data.response.data;
  },
};
