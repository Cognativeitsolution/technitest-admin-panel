"use client";

import { useState } from "react";
import { ArrowLeft, Camera, Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { TagsInput } from "@/components/ui/tags-input";
import { blogPosts, blogCategoryOptions } from "@/data/cms";
import type { BlogFaq, BlogCategory } from "@/data/cms";

export default function BlogItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const existing = !isNew ? blogPosts.find((b) => b.id === id) : null;

  const [metaTitle, setMetaTitle] = useState(existing?.metaTitle ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [category, setCategory] = useState<BlogCategory>(existing?.category ?? "Design & Development");
  const [keywords, setKeywords] = useState<string[]>(existing?.keywords ?? []);
  const [description, setDescription] = useState(existing?.description ?? "");
  const [faqs, setFaqs] = useState<BlogFaq[]>(existing?.faqs ?? []);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(existing?.ogImageUrl ?? null);

  function generateSlug() {
    const s = metaTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);
    setSlug(s);
  }

  function addFaq() {
    setFaqs((prev) => [...prev, { id: `fq-${Date.now()}`, question: "", answer: "" }]);
  }

  function updateFaq(id: string, field: "question" | "answer", value: string) {
    setFaqs((prev) => prev.map((f) => f.id === id ? { ...f, [field]: value } : f));
  }

  function removeFaq(id: string) {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  }

  function handleSave() {
    router.push("/cms");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/cms?tab=blogs")}
          className="flex size-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#374151] transition hover:bg-[#f9fafb]"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">Blogs Items</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[30%_70%]">
        {/* Left Column — SEO Image */}
        <div className="space-y-3">
          <h3 className="text-[16px] font-bold text-[#111827]">OG Tags</h3>
          <div className="relative overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white">
            <div className="aspect-[1180/600] w-full bg-[#eff6ff]">
              {ogImagePreview ? (
                <div className="flex size-full items-center justify-center text-sm text-[#6b7280]">Image uploaded</div>
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 text-[#9ca3af]">
                  <Camera className="size-10" />
                  <span className="text-sm">No image uploaded</span>
                </div>
              )}
            </div>
            <label className="absolute bottom-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#2563eb] text-white shadow-lg transition hover:bg-[#1d4ed8]">
              <Camera className="size-4" />
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setOgImagePreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
          <p className="text-[12px] text-[#6b7280]">Supported Files: png, jpg, jpeg. Image will be resized into 1180x600px</p>
        </div>

        {/* Right Column — Form */}
        <div className="space-y-5">
          {/* Meta Title */}
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-medium text-[#111111]">
                Meta Title<span className="ml-0.5 text-[#ff0000]">*</span>
              </label>
              <button
                type="button"
                onClick={generateSlug}
                className="text-[13px] font-semibold text-[#2563eb] transition hover:text-[#1d4ed8]"
              >
                Make Slug
              </button>
            </div>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
              placeholder="Enter meta title"
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">
              Slug<span className="ml-0.5 text-[#ff0000]">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
              placeholder="Enter slug"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">
              Category<span className="ml-0.5 text-[#ff0000]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BlogCategory)}
              className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            >
              {blogCategoryOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Keywords */}
          <TagsInput
            label="Meta Keywords"
            tags={keywords}
            onChange={setKeywords}
            placeholder="Type keyword and press Enter"
          />

          {/* Description */}
          <RichTextEditor
            label="Description"
            required
            value={description}
            onChange={setDescription}
            placeholder="Start writing your blog description..."
          />

          {/* FAQs */}
          <div className="space-y-4">
            <h3 className="text-[16px] font-bold text-[#111827]">FAQs</h3>
            {faqs.map((faq) => (
              <div key={faq.id} className="space-y-3 rounded-xl border border-[#e5e7eb] p-4">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-medium text-[#6b7280]">Question</label>
                  <button
                    type="button"
                    onClick={() => removeFaq(faq.id)}
                    className="text-[13px] font-medium text-[#ef4444] transition hover:text-[#dc2626]"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                  className="h-[46px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-4 text-[14px] text-[#4b5563] outline-none transition focus:border-[#dcdcdc] focus:ring-0"
                  placeholder="Enter question"
                />
                <label className="text-[13px] font-medium text-[#6b7280]">Answer</label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                  rows={3}
                  className="w-full rounded-[10px] border border-[#e5e7eb] bg-[#f0f7ff] px-4 py-3 text-[14px] text-[#4b5563] outline-none transition focus:border-[#dcdcdc] focus:ring-0"
                  placeholder="Enter answer"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addFaq}
              className="flex items-center gap-2 rounded-xl border border-dashed border-[#d1d5db] px-4 py-3 text-sm font-medium text-[#6b7280] transition hover:border-[#2563eb] hover:text-[#2563eb]"
            >
              <Plus className="size-4" />
              Add more Questions
            </button>
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400]"
          >
            {isNew ? "Create Blog" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
