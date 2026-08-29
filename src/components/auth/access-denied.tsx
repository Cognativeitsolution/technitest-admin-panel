"use client";

import Link from "next/link";
import { ShieldX } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-[#e8ecf2] bg-white px-6 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#fef2f2] text-[#ef4444]">
        <ShieldX className="size-7" />
      </span>
      <h2 className="mt-5 text-xl font-bold text-[#111827]">Access denied</h2>
      <p className="mt-2 max-w-sm text-sm text-[#6b7280]">
        You don&apos;t have permission to access this section. Contact an
        administrator if you believe this is a mistake.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#111827] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f2937]"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}