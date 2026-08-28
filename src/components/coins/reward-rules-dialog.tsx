"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { Can } from "@/components/shared/can";
import { RewardRuleEditDialog } from "@/components/coins/reward-rule-edit-dialog";
import { useRewardRules } from "@/hooks/coin-reward/use-reward-rules";
import {
  formatRewardTypeLabel,
  formatRewardValue,
  type RewardRule,
  type UpdateRewardRulePayload,
} from "@/types/reward-rule.types";

type RewardRulesDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function RewardRulesDialog({ open, onClose }: RewardRulesDialogProps) {
  const rulesQuery = useRewardRules({ perPage: 50, enabled: open });
  const [editingRule, setEditingRule] = useState<RewardRule | null>(null);

  useEffect(() => {
    if (!open) setEditingRule(null);
  }, [open]);

  function handleCloseAll() {
    setEditingRule(null);
    onClose();
  }

  async function handleUpdate(payload: UpdateRewardRulePayload) {
    if (!editingRule) return false;
    return rulesQuery.updateRule(editingRule.id, payload);
  }

  return (
    <>
      <Dialog
        open={open && !editingRule}
        onClose={handleCloseAll}
        title="Reward Rules"
        maxWidth="max-w-3xl"
      >
        {rulesQuery.error ? (
          <p className="mb-4 text-sm text-[#ef4444]">{rulesQuery.error}</p>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-[#e8ecf2]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-140 border-collapse text-left">
              <thead>
                <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
                  <th className="px-5 py-3.5">Reward Type</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5">Coins</th>
                  <th className="px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rulesQuery.loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#6b7280]">
                      Loading reward rules...
                    </td>
                  </tr>
                ) : (
                  <>
                    {rulesQuery.items.map((rule) => (
                      <tr key={rule.id} className="border-t border-[#eef1f6]">
                        <td className="px-5 py-4 text-sm font-medium text-[#111827]">
                          {formatRewardTypeLabel(rule.reward_type)}
                        </td>
                        <td className="px-5 py-4 text-sm text-[#374151]">{rule.description || "--"}</td>
                        <td className="px-5 py-4 text-sm font-medium text-[#111827]">
                          {formatRewardValue(rule)}
                        </td>
                        <td className="px-5 py-4">
                          <Can permission="reward_rule:update">
                            <button
                              type="button"
                              aria-label={`Edit ${formatRewardTypeLabel(rule.reward_type)}`}
                              onClick={() => setEditingRule(rule)}
                              className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                            >
                              <Pencil className="size-4" />
                            </button>
                          </Can>
                        </td>
                      </tr>
                    ))}
                    {rulesQuery.items.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#6b7280]">
                          No reward rules found.
                        </td>
                      </tr>
                    ) : null}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Dialog>

      <RewardRuleEditDialog
        open={!!editingRule}
        rule={editingRule}
        submitting={rulesQuery.mutating}
        onClose={() => setEditingRule(null)}
        onSubmit={handleUpdate}
      />
    </>
  );
}
