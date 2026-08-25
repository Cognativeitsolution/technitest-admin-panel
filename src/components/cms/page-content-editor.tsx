"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  BLOCK_DATA_SCHEMA,
  BLOCK_TYPE_OPTIONS,
  asObjectList,
  asString,
  createEmptyBlock,
  formatBlockType,
} from "@/lib/page-content";
import type { PageContentBlock } from "@/types/page.types";

const inputClassName =
  "h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0";

const textareaClassName =
  "w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 py-3 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0";

type PageContentEditorProps = {
  blocks: PageContentBlock[];
  onChange: (blocks: PageContentBlock[]) => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[14px] leading-none font-medium text-[#111111]">
      {children}
    </label>
  );
}

function JsonDataEditor({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const [raw, setRaw] = useState(() => JSON.stringify(data ?? {}, null, 2));
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    setRaw(JSON.stringify(data ?? {}, null, 2));
    setInvalid(false);
  }, [data]);

  return (
    <div className="flex flex-col gap-2.5">
      <FieldLabel>Block Data (JSON)</FieldLabel>
      <textarea
        rows={4}
        value={raw}
        onChange={(event) => {
          const next = event.target.value;
          setRaw(next);
          try {
            const parsed = JSON.parse(next) as unknown;
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
              setInvalid(false);
              onChange(parsed as Record<string, unknown>);
              return;
            }
            setInvalid(true);
          } catch {
            setInvalid(true);
          }
        }}
        className={textareaClassName}
      />
      {invalid ? (
        <p className="text-xs text-[#ef4444]">Enter valid JSON object.</p>
      ) : null}
    </div>
  );
}

function updateBlockData(
  block: PageContentBlock,
  key: string,
  value: unknown,
): PageContentBlock {
  return { ...block, data: { ...block.data, [key]: value } };
}

function BlockDataFields({
  block,
  onChange,
}: {
  block: PageContentBlock;
  onChange: (block: PageContentBlock) => void;
}) {
  const schema = BLOCK_DATA_SCHEMA[block.type];

  if (!schema) {
    const keys = Object.keys(block.data ?? {});
    if (keys.length === 0) return null;
    return (
      <JsonDataEditor
        data={block.data ?? {}}
        onChange={(data) => onChange({ ...block, data })}
      />
    );
  }

  return (
    <div className="space-y-4">
      {schema.strings?.map((field) =>
        field.multiline ? (
          <div key={field.key} className="flex flex-col gap-2.5">
            <FieldLabel>{field.label}</FieldLabel>
            <textarea
              rows={3}
              value={asString(block.data?.[field.key])}
              onChange={(event) =>
                onChange(updateBlockData(block, field.key, event.target.value))
              }
              className={textareaClassName}
            />
          </div>
        ) : (
          <div key={field.key} className="flex flex-col gap-2.5">
            <FieldLabel>{field.label}</FieldLabel>
            <input
              type="text"
              value={asString(block.data?.[field.key])}
              onChange={(event) =>
                onChange(updateBlockData(block, field.key, event.target.value))
              }
              className={inputClassName}
            />
          </div>
        ),
      )}

      {schema.arrays?.map((field) => {
        const items = asObjectList(block.data?.[field.key]);
        return (
          <div key={field.key} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-[#111827]">{field.label}</h4>
              <button
                type="button"
                onClick={() => {
                  const nextItem = Object.fromEntries(
                    field.itemFields.map((itemField) => [itemField.key, ""]),
                  );
                  onChange(updateBlockData(block, field.key, [...items, nextItem]));
                }}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb] hover:underline"
              >
                <Plus className="size-3.5" />
                Add
              </button>
            </div>
            {items.map((item, index) => (
              <div
                key={`${field.key}-${index}`}
                className="space-y-3 rounded-xl border border-[#eef1f6] bg-[#f8fafc] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold tracking-wide text-[#6b7280] uppercase">
                    {field.label} {index + 1}
                  </p>
                  <button
                    type="button"
                    aria-label={`Remove ${field.label} ${index + 1}`}
                    onClick={() => {
                      onChange(
                        updateBlockData(
                          block,
                          field.key,
                          items.filter((_, itemIndex) => itemIndex !== index),
                        ),
                      );
                    }}
                    className="rounded-lg p-1.5 text-[#9ca3af] transition hover:bg-white hover:text-[#ef4444]"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                {field.itemFields.map((itemField) => (
                  <div key={itemField.key} className="flex flex-col gap-2.5">
                    <FieldLabel>{itemField.label}</FieldLabel>
                    <input
                      type="text"
                      value={asString(item[itemField.key])}
                      onChange={(event) => {
                        const next = items.map((current, itemIndex) =>
                          itemIndex === index
                            ? { ...current, [itemField.key]: event.target.value }
                            : current,
                        );
                        onChange(updateBlockData(block, field.key, next));
                      }}
                      className={inputClassName}
                    />
                  </div>
                ))}
              </div>
            ))}
            {items.length === 0 ? (
              <p className="text-sm text-[#6b7280]">No {field.label.toLowerCase()} yet.</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function PageContentEditor({ blocks, onChange }: PageContentEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#111827]">Content Blocks</h3>
        <button
          type="button"
          onClick={() => onChange([...blocks, createEmptyBlock("hero")])}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb] hover:underline"
        >
          <Plus className="size-3.5" />
          Add Block
        </button>
      </div>

      {blocks.map((block, index) => (
        <div
          key={`${block.type}-${index}`}
          className="space-y-4 rounded-2xl border border-[#eef1f6] bg-white p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2.5 sm:max-w-xs sm:flex-1">
              <FieldLabel>Block Type</FieldLabel>
              <select
                value={block.type}
                onChange={(event) => {
                  const next = blocks.map((current, blockIndex) =>
                    blockIndex === index
                      ? { ...current, type: event.target.value }
                      : current,
                  );
                  onChange(next);
                }}
                className={inputClassName}
              >
                {BLOCK_TYPE_OPTIONS.includes(
                  block.type as (typeof BLOCK_TYPE_OPTIONS)[number],
                ) ? null : (
                  <option value={block.type}>{formatBlockType(block.type)}</option>
                )}
                {BLOCK_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {formatBlockType(type)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              aria-label={`Remove ${formatBlockType(block.type)} block`}
              onClick={() =>
                onChange(blocks.filter((_, blockIndex) => blockIndex !== index))
              }
              className="self-end rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444] sm:self-center"
            >
              <Trash2 className="size-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel>Header</FieldLabel>
            <input
              type="text"
              value={block.header}
              onChange={(event) => {
                const next = blocks.map((current, blockIndex) =>
                  blockIndex === index
                    ? { ...current, header: event.target.value }
                    : current,
                );
                onChange(next);
              }}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <FieldLabel>Text</FieldLabel>
            <textarea
              rows={3}
              value={block.text}
              onChange={(event) => {
                const next = blocks.map((current, blockIndex) =>
                  blockIndex === index
                    ? { ...current, text: event.target.value }
                    : current,
                );
                onChange(next);
              }}
              className={textareaClassName}
            />
          </div>

          <BlockDataFields
            block={block}
            onChange={(updated) => {
              const next = blocks.map((current, blockIndex) =>
                blockIndex === index ? updated : current,
              );
              onChange(next);
            }}
          />
        </div>
      ))}

      {blocks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#d1d5db] bg-white p-6 text-center text-sm text-[#6b7280]">
          No content blocks yet. Add a block to start editing this page.
        </p>
      ) : null}
    </div>
  );
}
