"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  useState,
} from "react";
import PhoneInput, {
  type Country,
  type Value,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { isE164PhoneNumber, normalizeToE164 } from "@/utils/phone";

import styles from "./phone-input.module.css";

type CountryOption = {
  value?: string;
  label: string;
  divider?: boolean;
};

type CountrySelectProps = {
  value?: string;
  onChange: (value: string | undefined) => void;
  options: CountryOption[];
  iconComponent?: React.ComponentType<{
    country?: string;
    label?: string;
  }>;
};

function CountrySelect({
  value,
  onChange,
  options,
  iconComponent: Icon,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!search) return options.filter((option) => !option.divider);
    return options.filter(
      (option) =>
        !option.divider &&
        (option.label || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        type="button"
        className="mr-2 flex items-center gap-1 border-none bg-transparent outline-none"
        onClick={() => setOpen((current) => !current)}
      >
        {Icon ? <Icon country={value} label={selectedOption?.label} /> : null}
        <ChevronDown className="size-4 opacity-50" />
      </button>

      {open ? (
        <div className="absolute top-full left-0 z-50 mt-2 max-h-60 w-[280px] overflow-hidden rounded-lg border border-[#ebebeb] bg-white shadow-md">
          <div className="border-b border-[#eef1f6] p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="h-8 w-full rounded-md border border-[#e5e7eb] px-2 text-sm outline-none"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filteredOptions.map((option) => (
              <li key={option.value || option.label}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f8fafc]"
                >
                  {Icon ? (
                    <Icon country={option.value} label={option.label} />
                  ) : null}
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

type CustomPhoneNumberProps = {
  value?: Value;
  onChange: (value: Value) => void;
  error?: boolean;
  defaultCountry?: Country;
  placeholder?: string;
  className?: string;
};

export function CustomPhoneNumber({
  value,
  onChange,
  error = false,
  defaultCountry = "PK",
  placeholder = "Enter phone number",
  className,
}: CustomPhoneNumberProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const normalizedValue = useMemo(() => normalizeToE164(value), [value]);

  useEffect(() => {
    if (!mounted || !normalizedValue || normalizedValue === value) return;
    if (typeof value === "string" && isE164PhoneNumber(value)) return;
    onChange(normalizedValue);
  }, [mounted, normalizedValue, value, onChange]);

  const displayValue =
    normalizedValue ?? (value ? (value as Value) : undefined);

  if (!mounted) {
    return (
      <div className={className}>
        <div
          className={cn(styles.phoneInput, error && styles.phoneInputError)}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <PhoneInput
        value={displayValue}
        onChange={(nextValue) => onChange(nextValue ?? ("" as Value))}
        placeholder={placeholder}
        autoComplete="tel"
        defaultCountry={defaultCountry}
        international
        countryCallingCodeEditable={false}
        flags={flags}
        countrySelectComponent={CountrySelect}
        className={cn(styles.phoneInput, error && styles.phoneInputError)}
      />
    </div>
  );
}
