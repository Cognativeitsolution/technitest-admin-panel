"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays, ChevronDown } from "lucide-react";

const data = [
  { month: "Jan", students: 120, professionals: 90 },
  { month: "Feb", students: 180, professionals: 140 },
  { month: "Mar", students: 150, professionals: 220 },
  { month: "Apr", students: 260, professionals: 180 },
  { month: "May", students: 310, professionals: 250 },
  { month: "Jun", students: 280, professionals: 300 },
  { month: "Jul", students: 360, professionals: 270 },
  { month: "Aug", students: 420, professionals: 340 },
  { month: "Sep", students: 390, professionals: 380 },
  { month: "Oct", students: 470, professionals: 350 },
  { month: "Nov", students: 510, professionals: 430 },
  { month: "Dec", students: 560, professionals: 480 },
];

export function UserGrowthChart() {
  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-5">
          <h2 className="text-lg font-bold text-[#111827]">User Growth</h2>
          <div className="flex items-center gap-4 text-sm text-[#6b7280]">
            <span className="inline-flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#22c55e]" />
              Students
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#8b5cf6]" />
              Professionals
            </span>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#374151]"
        >
          <CalendarDays className="size-3.5 text-[#6b7280]" />
          Oct 18 - Nov 18
          <ChevronDown className="size-3.5 text-[#9ca3af]" />
        </button>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#eef2f7" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              }}
            />
            <Line
              type="monotone"
              dataKey="students"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="professionals"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
