import { cn } from "@/lib/utils";

type SupportStepsProps = {
  steps: string[];
  className?: string;
};

export function SupportSteps({ steps, className }: SupportStepsProps) {
  return (
    <ol
      type="1"
      className={cn(
        "list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-[#4b5563]",
        className
      )}
    >
      {steps.map((step, index) => (
        <li key={index} className="pl-1 marker:font-semibold marker:text-[#6b7280]">
          {step}
        </li>
      ))}
    </ol>
  );
}
