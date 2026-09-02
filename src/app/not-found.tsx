"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  HelpCircle,
  Home,
  Settings,
  Users,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        {/* Visual 404 Accent Badge */}
        <div className="relative mb-6 flex size-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#fef3c7] via-[#fffbeb] to-[#fef08a] shadow-[0_8px_30px_rgba(240,165,0,0.18)]">
          <span className="text-4xl font-extrabold tracking-tight text-[#d97706]">
            404
          </span>
          <div className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-[#f0a500] text-white shadow">
            <span className="text-xs font-bold">!</span>
          </div>
        </div>

        {/* Heading & Description */}
        <h1 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-3 text-base text-[#6b7280]">
          Oops! The page you are looking for doesn't exist, may have been removed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] shadow-sm transition hover:bg-[#f9fafb]"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>

          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
          >
            <Home className="size-4" />
            Go to Dashboard
          </Link>
        </div>

        {/* Quick Links Section */}
        <div className="mt-12 w-full rounded-2xl border border-[#e8ecf2] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
            Popular Sections
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Link
              href="/quizzes"
              className="flex flex-col items-center gap-2 rounded-xl p-3 text-xs font-medium text-[#374151] transition hover:bg-[#f8fafc] hover:text-[#2563eb]"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                <BookOpen className="size-4" />
              </div>
              Quizzes
            </Link>

            <Link
              href="/users"
              className="flex flex-col items-center gap-2 rounded-xl p-3 text-xs font-medium text-[#374151] transition hover:bg-[#f8fafc] hover:text-[#2563eb]"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#f0fdf4] text-[#16a34a]">
                <Users className="size-4" />
              </div>
              Users
            </Link>

            <Link
              href="/cms"
              className="flex flex-col items-center gap-2 rounded-xl p-3 text-xs font-medium text-[#374151] transition hover:bg-[#f8fafc] hover:text-[#2563eb]"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#fdf4ff] text-[#a855f7]">
                <FileText className="size-4" />
              </div>
              CMS
            </Link>

            <Link
              href="/settings"
              className="flex flex-col items-center gap-2 rounded-xl p-3 text-xs font-medium text-[#374151] transition hover:bg-[#f8fafc] hover:text-[#2563eb]"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#4b5563]">
                <Settings className="size-4" />
              </div>
              Settings
            </Link>
          </div>
        </div>

        {/* Support Link */}
        <p className="mt-6 flex items-center gap-1 text-xs text-[#9ca3af]">
          Need assistance?{" "}
          <Link
            href="/support"
            className="inline-flex items-center gap-1 font-semibold text-[#2563eb] hover:underline"
          >
            <HelpCircle className="size-3.5" />
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
