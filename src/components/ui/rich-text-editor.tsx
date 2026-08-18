"use client";

import { useCallback, useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2, Image, Undo, Redo } from "lucide-react";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
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

export function RichTextEditor({ value, onChange, label, required, className, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML ?? "");
  }, [onChange]);

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
    <div className={cn("flex w-full flex-col gap-[10px]", className)}>
      {label ? (
        <label className="text-[14px] leading-none font-medium text-[#111111]">
          {label}
          {required ? <span className="ml-0.5 text-[#ff0000]">*</span> : null}
        </label>
      ) : null}
      <div className="overflow-hidden rounded-[10px] border border-[#ebebeb] shadow-[0_2px_10px_rgba(16,24,40,0.06)]">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-[#ebebeb] bg-[#fafbfc] px-3 py-2">
          <ToolbarButton onClick={() => execCommand("bold")} title="Bold"><Bold className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("italic")} title="Italic"><Italic className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("underline")} title="Underline"><Underline className="size-4" /></ToolbarButton>
          <Divider />
          <ToolbarButton onClick={() => execCommand("justifyLeft")} title="Align Left"><AlignLeft className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("justifyCenter")} title="Align Center"><AlignCenter className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("justifyRight")} title="Align Right"><AlignRight className="size-4" /></ToolbarButton>
          <Divider />
          <ToolbarButton onClick={() => execCommand("insertOrderedList")} title="Ordered List"><ListOrdered className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("insertUnorderedList")} title="Unordered List"><List className="size-4" /></ToolbarButton>
          <Divider />
          <ToolbarButton onClick={() => {
            const url = prompt("Enter URL:");
            if (url) execCommand("createLink", url);
          }} title="Insert Link"><Link2 className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => {
            const url = prompt("Enter image URL:");
            if (url) execCommand("insertImage", url);
          }} title="Insert Image"><Image className="size-4" /></ToolbarButton>
          <Divider />
          <ToolbarButton onClick={() => execCommand("undo")} title="Undo"><Undo className="size-4" /></ToolbarButton>
          <ToolbarButton onClick={() => execCommand("redo")} title="Redo"><Redo className="size-4" /></ToolbarButton>
        </div>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder={placeholder ?? "Start writing..."}
          className="min-h-[300px] px-5 py-4 text-[15px] leading-relaxed text-[#374151] outline-none empty:before:text-[#b0b0b0] empty:before:content-[attr(data-placeholder)] [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[#111827] [&_h2]:mt-4 [&_h2]:mb-2 [&_p]:mb-3 [&_a]:text-[#2563eb] [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    </div>
  );
}
