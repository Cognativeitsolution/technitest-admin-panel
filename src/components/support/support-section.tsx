import { cn } from "@/lib/utils";

type SupportSectionProps = {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SupportSection({
  id,
  title,
  description,
  children,
  className,
}: SupportSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="text-xl font-semibold tracking-tight text-[#111827] sm:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-[15px] leading-relaxed text-[#4b5563]">
          {description}
        </p>
      ) : null}
      <div className="mt-5 space-y-8">{children}</div>
    </section>
  );
}
