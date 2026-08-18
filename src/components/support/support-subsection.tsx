import { cn } from "@/lib/utils";

type SupportSubsectionProps = {
  title: string;
  intro?: string;
  expectation?: string;
  children: React.ReactNode;
  className?: string;
};

export function SupportSubsection({
  title,
  intro,
  expectation,
  children,
  className,
}: SupportSubsectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-base font-semibold text-[#111827] sm:text-lg">
        {title}
      </h3>
      {intro ? (
        <p className="text-[15px] leading-relaxed text-[#4b5563]">{intro}</p>
      ) : null}
      {children}
      {expectation ? (
        <div className="rounded-xl border border-[#eef1f6] bg-[#f9fafb] p-4">
          <p className="text-sm font-semibold text-[#111827]">
            What to expect
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-[#6b7280]">
            {expectation}
          </p>
        </div>
      ) : null}
    </div>
  );
}
