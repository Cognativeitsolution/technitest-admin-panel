"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

type DateRangePickerProps = {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  onDateChange?: (dateFrom: string | null, dateTo: string | null) => void;
  className?: string;
  dualMonth?: boolean;
  placeholder?: string;
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

function formatRange(range: DateRange, placeholder = "Select dates") {
  if (!range.start && !range.end) return placeholder;
  if (range.start && !range.end) return `${formatDate(range.start)} — Select end`;
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
    <div className="w-64 max-w-full rounded-xl border border-[#e8ecf2] p-3 sm:p-4">
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
  onDateChange,
  className,
  dualMonth = true,
  placeholder,
}: DateRangePickerProps) {
  const today = new Date();

  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange>(
    value ?? { start: null, end: null },
  );
  const [viewDate, setViewDate] = useState(
    () => value?.start ?? today,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<"start" | "end">("start");

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

  useLayoutEffect(() => {
    if (!open) return;

    function updatePlacement() {
      const trigger = containerRef.current;
      const popover = popoverRef.current;
      if (!trigger || !popover) return;

      const triggerRect = trigger.getBoundingClientRect();
      const width = popover.offsetWidth;
      const margin = 16;
      const overflowsRight = triggerRect.left + width > window.innerWidth - margin;
      const fitsLeft = triggerRect.right - width >= margin;
      setPlacement(overflowsRight && fitsLeft ? "end" : "start");
    }

    const frame = window.requestAnimationFrame(updatePlacement);
    window.addEventListener("resize", updatePlacement);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePlacement);
    };
  }, [open, dualMonth, range.start, range.end]);

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

    if (!next.start || !next.end) {
      return;
    }

    const dateFromStr = next.start.toISOString().split("T")[0];
    const dateToStr = next.end.toISOString().split("T")[0];
    onDateChange?.(dateFromStr, dateToStr);
    setOpen(false);
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
        className="inline-flex h-10 items-center gap-2.5 rounded-xl border border-[#e5e7eb] bg-white px-3.5 text-sm font-medium text-[#374151] shadow-sm transition hover:bg-[#f9fafb]"
      >
        <CalendarDays className="size-4 text-[#111827]" />
        <span>
          {!range.start && !range.end && placeholder
            ? placeholder
            : formatRange(range, placeholder)}
        </span>
      </button>

      {open ? (
        <div
          ref={popoverRef}
          className={cn(
            "absolute top-[calc(100%+10px)] z-50 max-h-[min(36rem,calc(100vh-8rem))] w-max max-w-[calc(100vw-1.5rem)] overflow-auto rounded-2xl border border-[#e8ecf2] bg-white p-3 shadow-[0_16px_40px_rgba(16,24,40,0.14)] sm:p-4",
            placement === "end" ? "right-0" : "left-0",
          )}
        >
          <div className="mb-3 flex items-center gap-2.5 px-1 text-sm font-medium text-[#111827] sm:mb-4">
            <CalendarDays className="size-4 shrink-0" />
            <span className="truncate">{formatRange(range, placeholder ?? "Select dates")}</span>
          </div>

          {dualMonth ? (
            <div className="flex flex-col gap-3 xl:flex-row xl:items-stretch">
              <MonthCalendar
                year={leftYear}
                month={leftMonth}
                range={range}
                onSelect={handleSelect}
                onPrev={() => shiftMonths(-1)}
                onNext={() => shiftMonths(1)}
              />
              <div className="hidden w-px bg-[#eef1f6] xl:block" />
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
