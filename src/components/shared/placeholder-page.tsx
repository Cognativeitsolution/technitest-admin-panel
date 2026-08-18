type PlaceholderPageProps = {
  title: string;
  description?: string;
};

export function PlaceholderPage({
  title,
  description = "This section will be built next.",
}: PlaceholderPageProps) {
  return (
    <div className="rounded-2xl border border-[#eef1f6] bg-white p-8 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
        {title}
      </h1>
      <p className="mt-2 text-sm text-[#6b7280]">{description}</p>
    </div>
  );
}
