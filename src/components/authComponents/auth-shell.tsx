"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  formSize?: "default" | "wide";
  formClassName?: string;
};

export function AuthShell({
  children,
  imageSrc,
  imageAlt,
  formClassName,
}: AuthShellProps) {
  return (
    <main className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[58%_42%]">
        <section className="relative hidden min-h-screen overflow-hidden lg:block">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="58vw"
            className="object-cover"
          />
          <Link
            href="/"
            className="absolute left-8 top-7 z-10 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft className="size-4" />
            Back To Home
          </Link>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-white px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className={cn("w-full max-w-[480px]", formClassName)}>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
