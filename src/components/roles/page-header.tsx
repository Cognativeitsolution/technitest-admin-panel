"use client";

type RolesPageHeaderProps = {
  title: string;
  description: string;
  actions: React.ReactNode;
};

export function RolesPageHeader({ title, description, actions }: RolesPageHeaderProps) {
  return (
    <div className="rounded-2xl border border-[#e8ecf2] bg-white px-6 py-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#111827]">
            {title}
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      </div>
    </div>
  );
}