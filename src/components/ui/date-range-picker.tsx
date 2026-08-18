"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

type DateRangePickerProps = {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  className?: string;
  dualMonth?: boolean;
};

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBefore(a: Date, b: Date) {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function isAfter(a: Date, b: Date) {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

function isInRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const time = startOfDay(date).getTime();
  return (
    time >= startOfDay(start).getTime() && time <= startOfDay(end).getTime()
  );
}

function formatDate(date: Date | null) {
  if (!date) return "--/--/----";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatRange(range: DateRange) {
  return `${formatDate(range.start)} - ${formatDate(range.end)}`;
}

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  // Convert Sunday=0 to Monday=0
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { date: Date; currentMonth: boolean }[] = [];

  for (let i = startWeekday - 1; i >= 0; i -= 1) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  let nextDay = 1;
  while (cells.length < 42) {
    cells.push({
      date: new Date(year, month + 1, nextDay),
      currentMonth: false,
    });
    nextDay += 1;
  }

  return cells;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type MonthCalendarProps = {
  year: number;
  month: number;
  range: DateRange;
  onSelect: (date: Date) => void;
  onPrev?: () => void;
  onNext?: () => void;
  showNav?: boolean;
};

function MonthCalendar({
  year,
  month,
  range,
  onSelect,
  onPrev,
  onNext,
  showNav = true,
}: MonthCalendarProps) {
  const cells = useMemo(() => getMonthMatrix(year, month), [year, month]);

  return (
    <div className="min-w-[280px] rounded-xl border border-[#e8ecf2] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-[#111827]">
          {MONTH_NAMES[month]} {year}
        </p>
        {showNav ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous month"
              onClick={onPrev}
              className="rounded-md p-1 text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={onNext}
              className="rounded-md p-1 text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="mb-2 grid grid-cols-7 gap-y-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-xs font-medium text-[#9ca3af]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map(({ date, currentMonth }) => {
          const selectedStart = isSameDay(date, range.start);
          const selectedEnd = isSameDay(date, range.end);
          const selected = selectedStart || selectedEnd;
          const inRange = isInRange(date, range.start, range.end) && !selected;

          const isRangeStart =
            range.start &&
            range.end &&
            isSameDay(date, range.start) &&
            !isSameDay(range.start, range.end);
          const isRangeEnd =
            range.start &&
            range.end &&
            isSameDay(date, range.end) &&
            !isSameDay(range.start, range.end);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onSelect(date)}
              className={cn(
                "relative flex h-9 items-center justify-center text-sm transition",
                !currentMonth && "text-[#d1d5db]",
                currentMonth && !selected && !inRange && "text-[#111827]",
                inRange && "bg-[#e8f0fe] text-[#111827]",
                isRangeStart && "rounded-l-full bg-[#e8f0fe]",
                isRangeEnd && "rounded-r-full bg-[#e8f0fe]"
              )}
            >
              <span
                className={cn(
                  "relative z-10 flex size-8 items-center justify-center rounded-full",
                  selected && "bg-[#2c4ecf] font-semibold text-white"
                )}
              >
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({
  value,
  onChange,
  className,
  dualMonth = true,
}: DateRangePickerProps) {
  const defaultStart = new Date(2025, 6, 1);
  const defaultEnd = new Date(2025, 6, 31);

  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange>(
    value ?? { start: defaultStart, end: defaultEnd }
  );
  const [viewDate, setViewDate] = useState(
    () => value?.start ?? defaultStart
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) setRange(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const leftYear = viewDate.getFullYear();
  const leftMonth = viewDate.getMonth();
  const rightDate = new Date(leftYear, leftMonth + 1, 1);

  function handleSelect(date: Date) {
    const selected = startOfDay(date);
    let next: DateRange;

    if (!range.start || (range.start && range.end)) {
      next = { start: selected, end: null };
    } else if (isBefore(selected, range.start)) {
      next = { start: selected, end: range.start };
    } else if (isAfter(selected, range.start) || isSameDay(selected, range.start)) {
      next = { start: range.start, end: selected };
    } else {
      next = { start: selected, end: null };
    }

    setRange(next);
    onChange?.(next);

    if (next.start && next.end) {
      setOpen(false);
    }
  }

  function shiftMonths(offset: number) {
    setViewDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1)
    );
  }

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-11 items-center gap-2.5 rounded-xl border border-[#e5e7eb] bg-white px-3.5 text-sm font-medium text-[#374151] shadow-sm transition hover:bg-[#f9fafb]"
      >
        <CalendarDays className="size-4 text-[#111827]" />
        <span>{formatRange(range)}</span>
      </button>

      {open ? (
        <div className="absolute top-[calc(100%+10px)] right-0 z-50 w-max rounded-2xl border border-[#e8ecf2] bg-white p-4 shadow-[0_16px_40px_rgba(16,24,40,0.14)]">
          <div className="mb-4 flex items-center gap-2.5 px-1 text-sm font-medium text-[#111827]">
            <CalendarDays className="size-4" />
            <span>{formatRange(range)}</span>
          </div>

          {dualMonth ? (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
              <MonthCalendar
                year={leftYear}
                month={leftMonth}
                range={range}
                onSelect={handleSelect}
                onPrev={() => shiftMonths(-1)}
                onNext={() => shiftMonths(1)}
              />
              <div className="hidden w-px bg-[#eef1f6] lg:block" />
              <MonthCalendar
                year={rightDate.getFullYear()}
                month={rightDate.getMonth()}
                range={range}
                onSelect={handleSelect}
                showNav={false}
              />
            </div>
          ) : (
            <MonthCalendar
              year={leftYear}
              month={leftMonth}
              range={range}
              onSelect={handleSelect}
              onPrev={() => shiftMonths(-1)}
              onNext={() => shiftMonths(1)}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
