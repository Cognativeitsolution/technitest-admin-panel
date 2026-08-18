"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import type { TopScorer } from "@/data/gamification";
import { levelOptions } from "@/data/gamification";

type TopScorerDialogProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  scorer: TopScorer | null;
};

export function TopScorerDialog({ open, onClose, mode, scorer }: TopScorerDialogProps) {
  const [rank, setRank] = useState(scorer ? String(scorer.rank) : "");
  const [userName, setUserName] = useState(scorer?.userName ?? "");
  const [score, setScore] = useState(scorer ? String(scorer.score) : "");
  const [quizName, setQuizName] = useState(scorer?.quizName ?? "");
  const [level, setLevel] = useState(scorer?.level ?? "Beginner");
  const [certificate, setCertificate] = useState(scorer?.certificate ?? "");
  const [featured, setFeatured] = useState(scorer?.featured ?? false);

  const title = mode === "create" ? "Add Top Scorer" : "Edit Top Scorer";

  function handleSave() {
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} maxWidth="max-w-lg">
      <div className="space-y-4">
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Rank<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            placeholder="Enter rank"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            User Name<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            placeholder="Enter user name"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Score<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            placeholder="Enter score"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">Quiz Name</label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            placeholder="Enter quiz name"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
          >
            {levelOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">Certificate</label>
          <input
            type="text"
            value={certificate}
            onChange={(e) => setCertificate(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            placeholder="Enter certificate name"
          />
        </div>

        <div className="rounded-xl border border-[#e5e7eb] px-4 py-3">
          <Switch
            checked={featured}
            onCheckedChange={setFeatured}
            label="Featured on homepage?"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          Save Changes
        </button>
      </div>
    </Dialog>
  );
}
