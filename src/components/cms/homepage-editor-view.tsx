"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Cloud,
  Heart,
  Languages,
  Play,
  Star,
} from "lucide-react";

import { GalleryModal } from "@/components/cms/gallery-modal";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { TextField } from "@/components/ui/text-field";

const categories = [
  { label: "Health & Wellness", icon: Heart },
  { label: "Language Study", icon: Languages },
  { label: "Management", icon: BookOpen },
  { label: "Cloud Computing", icon: Cloud },
  { label: "Certification", icon: Award },
];

const steps = [
  "Choose Category",
  "Attempt Your Quiz",
  "Earn Certificate",
  "Get Your Results",
];

const trending = [
  { title: "BBA", color: "bg-[#7c3aed]" },
  { title: "Healthy Lifestyle", color: "bg-[#2563eb]" },
  { title: "Basics of Computer Science", color: "bg-[#16a34a]" },
];

export function HomepageEditorView() {
  const [shortTitle, setShortTitle] = useState(
    "Attempt Quizzes, Improve Skills, Earn Certificates."
  );
  const [description, setDescription] = useState(
    "<p>Practice industry-ready quizzes, track your progress, and unlock certificates that help you stand out.</p>"
  );
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [heroImage, setHeroImage] = useState("https://i.pravatar.cc/420?img=12");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/cms"
          className="inline-flex items-center gap-2 text-[22px] font-bold tracking-tight text-[#111827] transition hover:text-[#3b82f6]"
        >
          <ArrowLeft className="size-5" />
          Homepage
        </Link>
        <button
          type="button"
          className="inline-flex h-11 w-fit items-center justify-center rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          Save Changes
        </button>
      </div>

      <div className="space-y-5 rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
        <TextField
          label="Short Title"
          value={shortTitle}
          onChange={(e) => setShortTitle(e.target.value)}
          inputClassName="text-[#4b5563]"
        />
        <RichTextEditor
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Write homepage description..."
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#111827]">Live Preview</h2>
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="text-sm font-semibold text-[#2563eb] hover:underline"
          >
            Change Hero Image
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_8px_24px_rgba(16,24,40,0.06)]">
          {/* Hero */}
          <section className="grid gap-6 bg-gradient-to-br from-[#eff6ff] via-white to-[#f8fafc] p-6 lg:grid-cols-2 lg:p-10">
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                {shortTitle}
              </h3>
              <div
                className="mt-3 text-sm leading-relaxed text-[#6b7280]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 items-center rounded-lg bg-[#2563eb] px-4 text-sm font-semibold text-white"
                >
                  Join Now
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#2563eb] px-4 text-sm font-semibold text-[#2563eb]"
                >
                  <Play className="size-4" />
                  Watch Video
                </button>
              </div>
            </div>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl">
              <Image
                src={heroImage}
                alt="Homepage hero"
                fill
                className="object-cover"
              />
            </div>
          </section>

          {/* Categories */}
          <section className="border-t border-[#eef1f6] px-6 py-8">
            <h4 className="mb-5 text-center text-lg font-bold text-[#111827]">
              Unlock Your Learning Potential
            </h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl bg-[#f8fafc] p-4 text-center"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon className="size-5 text-[#2563eb]" />
                  </div>
                  <p className="text-xs font-semibold text-[#374151]">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Achievement */}
          <section className="grid gap-6 border-t border-[#eef1f6] bg-[#fafbfc] p-6 lg:grid-cols-2 lg:p-10">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl">
              <Image
                src="https://i.pravatar.cc/420?img=33"
                alt="Achievement"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-xl font-bold text-[#111827]">
                Turning Effort Into Achievement!
              </h4>
              <p className="mt-2 text-sm text-[#6b7280]">
                Track progress, earn certificates, and grow with a community of
                learners worldwide.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["250+", "Courses"],
                  ["75k+", "Active Users"],
                  ["11k+", "Certificates"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl bg-white p-3 text-center shadow-sm">
                    <p className="text-lg font-bold text-[#f0a500]">{value}</p>
                    <p className="text-[11px] text-[#6b7280]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Steps */}
          <section className="border-t border-[#eef1f6] px-6 py-8">
            <h4 className="mb-5 text-center text-lg font-bold text-[#111827]">
              Simple Steps, Smarter Results
            </h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-xl border border-[#eef1f6] bg-white p-4 text-center shadow-sm"
                >
                  <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-[#eff6ff] text-sm font-bold text-[#2563eb]">
                    {index + 1}
                  </div>
                  <p className="text-sm font-semibold text-[#111827]">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mx-6 mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#eef2ff] p-6 sm:flex-row sm:items-center">
            <div>
              <h4 className="text-lg font-bold text-[#111827]">
                Boost Your Skills Today — Take a Quiz & Get Certified!
              </h4>
              <p className="mt-1 text-sm text-[#6b7280]">
                Start practicing now and unlock your next certificate.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 shrink-0 items-center rounded-lg bg-[#f0a500] px-4 text-sm font-semibold text-white"
            >
              Start Now
            </button>
          </section>

          {/* Trending */}
          <section className="border-t border-[#eef1f6] px-6 py-8">
            <h4 className="mb-5 text-lg font-bold text-[#111827]">
              Trending Quizzes
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              {trending.map((item) => (
                <div
                  key={item.title}
                  className="overflow-hidden rounded-xl border border-[#eef1f6] bg-white shadow-sm"
                >
                  <div className={cnBanner(item.color)}>{item.title}</div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-[#111827]">
                      {item.title} Quiz
                    </p>
                    <p className="mt-1 text-xs text-[#6b7280]">
                      Practice questions with instant feedback.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hall of Achievers */}
          <section className="border-t border-[#eef1f6] bg-[#fafbfc] px-6 py-8">
            <h4 className="mb-5 text-center text-lg font-bold text-[#111827]">
              Hall of Achievers
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              {[5, 9, 20].map((img, i) => (
                <div
                  key={img}
                  className="rounded-xl border border-[#eef1f6] bg-white p-4 text-center shadow-sm"
                >
                  <Image
                    src={`https://i.pravatar.cc/120?img=${img}`}
                    alt="Achiever"
                    width={64}
                    height={64}
                    className="mx-auto size-16 rounded-full object-cover"
                  />
                  <p className="mt-3 text-sm font-semibold text-[#111827]">
                    Top Learner {i + 1}
                  </p>
                  <p className="text-xs text-[#6b7280]">Certified Professional</p>
                  <div className="mt-2 flex justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star
                        key={star}
                        className="size-3.5 fill-[#fbbf24] text-[#fbbf24]"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="border-t border-[#eef1f6] px-6 py-8">
            <h4 className="mb-4 text-center text-lg font-bold text-[#111827]">
              Real People, Real Reviews!
            </h4>
            <div className="mx-auto max-w-2xl rounded-2xl border border-[#eef1f6] bg-white p-6 text-center shadow-sm">
              <CheckCircle2 className="mx-auto size-8 text-[#22c55e]" />
              <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
                “Technitest helped me prepare faster and earn certificates that
                actually boosted my profile.”
              </p>
              <p className="mt-3 text-sm font-semibold text-[#111827]">
                Amina Khan
              </p>
            </div>
          </section>
        </div>
      </div>

      <GalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelect={setHeroImage}
      />
    </div>
  );
}

function cnBanner(color: string) {
  return `${color} px-4 py-6 text-center text-sm font-bold text-white`;
}
