"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link2, Image, Undo, Redo, Heading1, Heading2, Heading3, Heading4, Quote, Code, Minus, Eraser, Highlighter,
  Indent, Outdent, Palette, Subscript as SubscriptIcon, Superscript as SuperscriptIcon, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
};

type ActiveFormats = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  subscript: boolean;
  superscript: boolean;
  insertOrderedList: boolean;
  insertUnorderedList: boolean;
  justifyLeft: boolean;
  justifyCenter: boolean;
  justifyRight: boolean;
  justifyFull: boolean;
  isLink: boolean;
  blockquote: boolean;
  codeBlock: boolean;
};

const defaultFormats: ActiveFormats = {
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  subscript: false,
  superscript: false,
  insertOrderedList: false,
  insertUnorderedList: false,
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false,
  justifyFull: false,
  isLink: false,
  blockquote: false,
  codeBlock: false,
};

function ToolbarButton({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-md transition",
        active ? "bg-[#e5e7eb] text-[#111827]" : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-[#e5e7eb]" />;
}

const TEXT_COLORS = ["", "#111827", "#6b7280", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#ffffff"];

const HIGHLIGHT_COLORS = ["", "#fef08a", "#bbf7d0", "#bfdbfe", "#fbcfe8", "#fed7aa", "#e9d5ff", "#fecaca", "#a7f3d0", "#000000"];

function ColorPickerButton({ colors, command, icon, title }: { colors: string[]; command: string; icon: React.ReactNode; title: string }) {
  const [open, setOpen] = useState(false);
  const [activeColor, setActiveColor] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const customRef = useRef<HTMLInputElement>(null);

  const select = useCallback((color: string) => {
    setActiveColor(color);
    document.execCommand(command, false, color || "#000000");
  }, [command]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        title={title}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen(!open)}
        className="flex size-8 items-center justify-center rounded-md text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
      >
        {icon}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-[#e5e7eb] bg-white p-3 shadow-lg" style={{ width: 168 }}>
          <div className="flex flex-wrap gap-1.5">
            {colors.map((c) => (
              <button
                key={c || "default"}
                type="button"
                title={c || "Default"}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => select(c)}
                className={cn(
                  "size-6 rounded-md border-2 transition hover:scale-110",
                  activeColor === c ? "border-[#2563eb] ring-1 ring-[#2563eb]" : "border-[#d1d5db]"
                )}
                style={{ backgroundColor: c || "#ffffff" }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 border-t border-[#e5e7eb] pt-2">
            <input
              ref={customRef}
              type="color"
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => select(e.target.value)}
              className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => customRef.current?.click()}
              className="text-xs font-medium text-[#6b7280] transition hover:text-[#111827]"
            >
              Custom
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setOpen(false)}
              className="rounded-md bg-[#f3f4f6] px-2.5 py-1 text-xs font-medium text-[#374151] transition hover:bg-[#e5e7eb]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HeadingDropdown({ onSelect }: { onSelect: (tag: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const headings = [
    { label: "Paragraph", value: "p", icon: <span className="text-sm font-normal">P</span> },
    { label: "Heading 1", value: "h1", icon: <Heading1 className="size-4" /> },
    { label: "Heading 2", value: "h2", icon: <Heading2 className="size-4" /> },
    { label: "Heading 3", value: "h3", icon: <Heading3 className="size-4" /> },
    { label: "Heading 4", value: "h4", icon: <Heading4 className="size-4" /> },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        title="Heading"
        onClick={() => setOpen(!open)}
        className="flex h-8 items-center gap-1 rounded-md px-1.5 text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
      >
        <Heading2 className="size-4" />
        <ChevronDown className="size-3" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-40 rounded-lg border border-[#e5e7eb] bg-white py-1 shadow-lg">
          {headings.map((h) => (
            <button
              key={h.value}
              type="button"
              onClick={() => { onSelect(h.value); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-[#374151] transition hover:bg-[#f3f4f6]"
            >
              {h.icon}
              <span>{h.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function RichTextEditor({ value, onChange, label, required, className, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastSetValue = useRef<string | undefined>(undefined);
  const savedRange = useRef<Range | null>(null);
  const [formats, setFormats] = useState<ActiveFormats>(defaultFormats);

  useEffect(() => {
    if (!editorRef.current) return;
    const domHtml = editorRef.current.innerHTML;
    if (value && value !== lastSetValue.current && value !== domHtml) {
      editorRef.current.innerHTML = value;
    }
    lastSetValue.current = value;
  }, [value]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0);
    }
  }, []);

  const restoreSelection = useCallback(() => {
    if (savedRange.current && editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange.current);
      savedRange.current = null;
      return true;
    }
    return false;
  }, []);

  const checkActiveFormats = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const isInsideEditor = editorRef.current?.contains(sel.anchorNode);
    if (!isInsideEditor) return;

    const anchor = sel.anchorNode;
    const parentAnchor = anchor?.nodeType === Node.TEXT_NODE ? anchor.parentElement : anchor as HTMLElement;
    const blockNode = parentAnchor?.closest("blockquote, pre, h1, h2, h3, h4, p, div");
    const insideOl = !!parentAnchor?.closest("ol");
    const insideUl = !!parentAnchor?.closest("ul");

    setFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      subscript: document.queryCommandState("subscript"),
      superscript: document.queryCommandState("superscript"),
      insertOrderedList: insideOl,
      insertUnorderedList: insideUl,
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      justifyFull: document.queryCommandState("justifyFull"),
      isLink: !!parentAnchor?.closest("a[href]"),
      blockquote: blockNode?.tagName === "BLOCKQUOTE",
      codeBlock: blockNode?.tagName === "PRE",
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", checkActiveFormats);
    return () => document.removeEventListener("selectionchange", checkActiveFormats);
  }, [checkActiveFormats]);

  const execCommand = useCallback((command: string, value?: string) => {
    restoreSelection();
    window.requestAnimationFrame(() => {
      document.execCommand(command, false, value);
      checkActiveFormats();
      onChange(editorRef.current?.innerHTML ?? "");
    });
  }, [onChange, checkActiveFormats, restoreSelection]);

  const toggleList = useCallback((ordered: boolean) => {
    restoreSelection();
    window.requestAnimationFrame(() => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      const listTag = ordered ? "ol" : "ul";
      const oppositeTag = ordered ? "ul" : "ol";

      const existingList = range.startContainer.parentElement?.closest(`${listTag}, ${oppositeTag}`);
      if (existingList && existingList.tagName.toLowerCase() === listTag) {
        const fragment = document.createDocumentFragment();
        while (existingList.firstChild) fragment.appendChild(existingList.firstChild);
        existingList.parentNode?.replaceChild(fragment, existingList);
      } else if (existingList && existingList.tagName.toLowerCase() === oppositeTag) {
        const newList = document.createElement(listTag);
        newList.innerHTML = existingList.innerHTML;
        existingList.parentNode?.replaceChild(newList, existingList);
      } else {
        document.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList", false);
      }
      checkActiveFormats();
      onChange(editorRef.current?.innerHTML ?? "");
    });
  }, [onChange, checkActiveFormats, restoreSelection]);

  const handleToolbarMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    saveSelection();
  }, [saveSelection]);

  const insertLink = useCallback(() => {
    restoreSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const anchor = selection.anchorNode?.nodeType === Node.TEXT_NODE
      ? selection.anchorNode.parentElement?.closest("a[href]")
      : (selection.anchorNode as HTMLElement)?.closest?.("a[href]");

    if (anchor) {
      const parent = anchor.parentNode;
      while (anchor.firstChild) parent?.insertBefore(anchor.firstChild, anchor);
      parent?.removeChild(anchor);
      checkActiveFormats();
      onChange(editorRef.current?.innerHTML ?? "");
      return;
    }

    const url = prompt("Enter URL:");
    if (!url) return;
    const range = selection.getRangeAt(0);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = selection.toString() || url;
    range.deleteContents();
    range.insertNode(link);
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(link);
    selection.addRange(newRange);
    checkActiveFormats();
    onChange(editorRef.current?.innerHTML ?? "");
  }, [onChange, checkActiveFormats, restoreSelection]);

  const handleInput = useCallback(() => {
    onChange(editorRef.current?.innerHTML ?? "");
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertText", false, "    ");
    }
  }, []);

  return (
    <div className={cn("flex w-full flex-col gap-2.5", className)}>
      {label ? (
        <label className="text-[14px] leading-none font-medium text-[#111111]">
          {label}
          {required ? <span className="ml-0.5 text-[#ff0000]">*</span> : null}
        </label>
      ) : null}
      <div className="max-h-[80vh] overflow-y-auto rounded-[10px] border border-[#ebebeb] shadow-[0_2px_10px_rgba(16,24,40,0.06)]">
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-[#ebebeb] bg-[#fafbfc] px-3 py-2" onMouseDown={handleToolbarMouseDown}>
          <HeadingDropdown onSelect={(tag) => execCommand("formatBlock", tag)} />
          <Divider />
          <ToolbarButton onClick={() => execCommand("bold")} active={formats.bold} title="Bold (Ctrl+B)"><Bold className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("italic")} active={formats.italic} title="Italic (Ctrl+I)"><Italic className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("underline")} active={formats.underline} title="Underline (Ctrl+U)"><Underline className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("strikeThrough")} active={formats.strikeThrough} title="Strikethrough"><Strikethrough className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("subscript")} active={formats.subscript} title="Subscript"><SubscriptIcon className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("superscript")} active={formats.superscript} title="Superscript"><SuperscriptIcon className="size-4" /></ToolbarButton>
          <Divider />
          <ColorPickerButton colors={TEXT_COLORS} command="foreColor" icon={<Palette className="size-4" />} title="Text Color" />
          <ColorPickerButton colors={HIGHLIGHT_COLORS} command="hiliteColor" icon={<Highlighter className="size-4" />} title="Highlight" />
          <Divider />
          <ToolbarButton onClick={() => execCommand("justifyLeft")} active={formats.justifyLeft} title="Align Left"><AlignLeft className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("justifyCenter")} active={formats.justifyCenter} title="Align Center"><AlignCenter className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("justifyRight")} active={formats.justifyRight} title="Align Right"><AlignRight className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("justifyFull")} active={formats.justifyFull} title="Justify"><AlignJustify className="size-4" /></ToolbarButton>
          <Divider />
          <ToolbarButton onClick={() => toggleList(true)} active={formats.insertOrderedList} title="Ordered List"><ListOrdered className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => toggleList(false)} active={formats.insertUnorderedList} title="Unordered List"><List className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("indent")} title="Indent"><Indent className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("outdent")} title="Outdent"><Outdent className="size-4" /></ToolbarButton>
          <Divider />
          <ToolbarButton onClick={() => execCommand("formatBlock", "blockquote")} active={formats.blockquote} title="Blockquote"><Quote className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("formatBlock", "pre")} active={formats.codeBlock} title="Code Block"><Code className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("insertHorizontalRule")} title="Horizontal Rule"><Minus className="size-4" /></ToolbarButton>
          <Divider />
          <ToolbarButton onClick={insertLink} active={formats.isLink} title={formats.isLink ? "Remove Link" : "Insert Link"}><Link2 className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => {
            const url = prompt("Enter image URL:");
            if (url) execCommand("insertImage", url);
          }} title="Insert Image"><Image className="size-4" /></ToolbarButton>
          <Divider />
          <ToolbarButton onClick={() => execCommand("removeFormat")} title="Clear Formatting"><Eraser className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("undo")} title="Undo (Ctrl+Z)"><Undo className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("redo")} title="Redo (Ctrl+Y)"><Redo className="size-4" /></ToolbarButton>
        </div>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder={placeholder ?? "Start writing..."}
          className="min-h-75 px-5 py-4 text-[15px] leading-relaxed text-[#374151] outline-none empty:before:text-[#b0b0b0] empty:before:content-[attr(data-placeholder)] [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#111827] [&_h1]:mt-5 [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#111827] [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#111827] [&_h3]:mt-3 [&_h3]:mb-2 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-[#111827] [&_h4]:mt-3 [&_h4]:mb-1 [&_p]:mb-3 [&_a]:text-[#2563eb] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#d1d5db] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#6b7280] [&_pre]:rounded-lg [&_pre]:bg-[#f3f4f6] [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:overflow-x-auto [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_li]:mb-1"
        />
      </div>
    </div>
  );
}
