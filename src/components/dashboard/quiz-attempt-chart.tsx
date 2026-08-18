"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", attempts: 42 },
  { day: "Tue", attempts: 68 },
  { day: "Wed", attempts: 55 },
  { day: "Thu", attempts: 88 },
  { day: "Fri", attempts: 72 },
  { day: "Sat", attempts: 48 },
  { day: "Sun", attempts: 35 },
];

export function QuizAttemptChart() {
  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <h2 className="mb-5 text-lg font-bold text-[#111827]">
        Quiz Attempt Trends
      </h2>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#eef2f7" vertical={false} />
            <XAxis
              dataKey="day"
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
              cursor={{ fill: "rgba(59,130,246,0.08)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              }}
            />
            <Bar
              dataKey="attempts"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
