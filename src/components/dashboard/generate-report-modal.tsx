"use client";

import { useState } from "react";
import { Check, Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Dialog } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { dashboardService } from "@/services/dashboard.service";
import { ReportFormat, ReportType } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";

type GenerateReportModalProps = {
  open: boolean;
  onClose: () => void;
  dateFrom?: string | null;
  dateTo?: string | null;
};

const REPORT_TYPES: { id: ReportType; label: string; desc: string }[] = [
  { id: "full", label: "Full Dashboard Overview", desc: "Comprehensive summary of all KPIs, charts, and activities" },
  { id: "growth", label: "User Growth & Demographics", desc: "Detailed student vs professional acquisition trends" },
  { id: "quizzes", label: "Quiz Attempts & Performance", desc: "Quiz metrics, completion rates, and top scorers" },
  { id: "financial", label: "Financial & Payments Summary", desc: "Revenue trends and payment transaction records" },
  { id: "activities", label: "Recent User Activity Log", desc: "Audit trail of student completions, badges, and certificates" },
];

export function GenerateReportModal({
  open,
  onClose,
  dateFrom,
  dateTo,
}: GenerateReportModalProps) {
  const [reportType, setReportType] = useState<ReportType>("full");
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [loading, setLoading] = useState(false);

  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeGrowth, setIncludeGrowth] = useState(true);
  const [includeQuizzes, setIncludeQuizzes] = useState(true);
  const [includeTopScorers, setIncludeTopScorers] = useState(true);
  const [includeActivities, setIncludeActivities] = useState(true);

  function handleTypeChange(type: ReportType) {
    setReportType(type);
    if (type === "full") {
      setIncludeSummary(true);
      setIncludeGrowth(true);
      setIncludeQuizzes(true);
      setIncludeTopScorers(true);
      setIncludeActivities(true);
    } else if (type === "growth") {
      setIncludeSummary(true);
      setIncludeGrowth(true);
      setIncludeQuizzes(false);
      setIncludeTopScorers(false);
      setIncludeActivities(false);
    } else if (type === "quizzes") {
      setIncludeSummary(false);
      setIncludeGrowth(false);
      setIncludeQuizzes(true);
      setIncludeTopScorers(true);
      setIncludeActivities(false);
    } else if (type === "financial") {
      setIncludeSummary(true);
      setIncludeGrowth(false);
      setIncludeQuizzes(false);
      setIncludeTopScorers(false);
      setIncludeActivities(false);
    } else if (type === "activities") {
      setIncludeSummary(false);
      setIncludeGrowth(false);
      setIncludeQuizzes(false);
      setIncludeTopScorers(false);
      setIncludeActivities(true);
    }
  }

  async function handleGenerate() {
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading(`Generating ${format.toUpperCase()} report...`);

    try {
      const result = await dashboardService.generateReport(dateFrom, dateTo);
      if (!result) {
        toast.error("No report available for the selected range.", { id: toastId });
        return;
      }

      toast.success(`${format.toUpperCase()} Report downloaded successfully!`, { id: toastId });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate dashboard report.";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Generate Dashboard Report"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Report Type */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#111827]">
            Select Report Type
          </label>
          <div className="grid gap-2 sm:grid-cols-1">
            {REPORT_TYPES.map((type) => {
              const isSelected = reportType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeChange(type.id)}
                  className={cn(
                    "flex items-start justify-between rounded-xl border p-3.5 text-left transition",
                    isSelected
                      ? "border-[#2563eb] bg-[#eff6ff]/60 ring-1 ring-[#2563eb]"
                      : "border-[#e5e7eb] bg-white hover:bg-[#fafbfc]"
                  )}
                >
                  <div>
                    <p className={cn("text-sm font-semibold", isSelected ? "text-[#2563eb]" : "text-[#111827]")}>
                      {type.label}
                    </p>
                    <p className="mt-0.5 text-xs text-[#6b7280]">{type.desc}</p>
                  </div>
                  {isSelected ? (
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-white">
                      <Check className="size-3" strokeWidth={3} />
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Export Format */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#111827]">
            Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat("pdf")}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 transition",
                format === "pdf"
                  ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb] ring-1 ring-[#2563eb]"
                  : "border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#fafbfc]"
              )}
            >
              <div className={cn("flex size-9 items-center justify-center rounded-lg", format === "pdf" ? "bg-[#2563eb] text-white" : "bg-[#f3f4f6] text-[#6b7280]")}>
                <FileText className="size-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">PDF Document</p>
                <p className="text-xs text-[#6b7280]">Formatted report</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat("csv")}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 transition",
                format === "csv"
                  ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb] ring-1 ring-[#2563eb]"
                  : "border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#fafbfc]"
              )}
            >
              <div className={cn("flex size-9 items-center justify-center rounded-lg", format === "csv" ? "bg-[#2563eb] text-white" : "bg-[#f3f4f6] text-[#6b7280]")}>
                <FileSpreadsheet className="size-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">CSV / Excel</p>
                <p className="text-xs text-[#6b7280]">Raw spreadsheet data</p>
              </div>
            </button>
          </div>
        </div>

        {/* Included Sections */}
        <div>
          <label className="mb-2.5 block text-sm font-semibold text-[#111827]">
            Sections to Include
          </label>
          <div className="grid grid-cols-1 gap-2.5 rounded-xl border border-[#eef1f6] bg-[#fafbfc] p-3.5 sm:grid-cols-2">
            <Checkbox
              checked={includeSummary}
              onCheckedChange={setIncludeSummary}
              label="Executive KPI Metrics"
            />
            <Checkbox
              checked={includeGrowth}
              onCheckedChange={setIncludeGrowth}
              label="User Growth Analytics"
            />
            <Checkbox
              checked={includeQuizzes}
              onCheckedChange={setIncludeQuizzes}
              label="Quiz Attempt Stats"
            />
            <Checkbox
              checked={includeTopScorers}
              onCheckedChange={setIncludeTopScorers}
              label="Top Scorers Leaderboard"
            />
            <div className="sm:col-span-2">
              <Checkbox
                checked={includeActivities}
                onCheckedChange={setIncludeActivities}
                label="Recent Activity Audit Trail"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eef1f6]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-10 rounded-xl border border-[#e5e7eb] px-4 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || (!includeSummary && !includeGrowth && !includeQuizzes && !includeTopScorers && !includeActivities)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Download Report
          </button>
        </div>
      </div>
    </Dialog>
  );
}
