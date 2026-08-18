import { cn } from "@/lib/utils";

type TextFieldProps = Omit<
  React.ComponentProps<"input">,
  "className" | "id"
> & {
  label: string;
  required?: boolean;
  id?: string;
  className?: string;
  inputClassName?: string;
};

export function TextField({
  label,
  required = false,
  id,
  className,
  inputClassName,
  ...props
}: TextFieldProps) {
  const fieldId =
    id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className={cn("flex w-full flex-col gap-[10px]", className)}>
      <label
        htmlFor={fieldId}
        className="text-[14px] leading-none font-medium text-[#111111]"
      >
        {label}
        {required ? <span className="ml-0.5 text-[#ff0000]">*</span> : null}
      </label>
      <input
        id={fieldId}
        className={cn(
          "h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] font-normal text-[#b0b0b0] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:text-[#4b5563] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0",
          inputClassName
        )}
        {...props}
      />
    </div>
  );
}
