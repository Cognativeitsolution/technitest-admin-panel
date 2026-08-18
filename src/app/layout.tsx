import type { Metadata } from "next";
import { Urbanist } from "next/font/google";

import { AdminShell } from "@/components/layout/admin-shell";

import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Technitest Admin",
  description: "Technitest administration panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
