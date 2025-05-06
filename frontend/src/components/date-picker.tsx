import React, { useEffect, useRef, useState } from "react";
import ReactDatePicker, {
  DatePickerProps as ReactDatePickerProps,
  ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DatePickerProps {
  containerClassName?: string;
  className?: string;
}

export function DatePicker(props: DatePickerProps & ReactDatePickerProps) {
  const [showClearDates, setShowClearDates] = useState<boolean>(false);
  const reactDatePickerRef = useRef<ReactDatePicker | null>(null);

  const handleClearDates = () => {
    if (reactDatePickerRef.current) {
      reactDatePickerRef.current.clear();
      setShowClearDates(false);
    }
  };

  useEffect(() => {
    if (props.startDate || props.endDate) {
      setShowClearDates(true);
    }
  }, [props.startDate, props.endDate]);

  return (
    <div
      className={cn(
        "StayDatesRangeInput addListingDatePickerExclude",
        props.containerClassName
      )}
    >
      {/*@ts-ignore*/}
      <ReactDatePicker
        {...props}
        ref={reactDatePickerRef}
        selectsRange={props.selectsRange ?? true}
        monthsShown={props.monthsShown ?? 2}
        showPopperArrow={props.showPopperArrow ?? false}
        inline={props.inline ?? true}
        renderCustomHeader={(p) => {
          if (props.renderCustomHeader) {
            return props.renderCustomHeader(p);
          }
          return <DatePickerCustomHeaderTwoMonth {...p} />;
        }}
        renderDayContents={(day, date) => {
          if (props.renderDayContents) {
            return props.renderDayContents(day, date);
          }
          return <DatePickerCustomDay dayOfMonth={day} />;
        }}
      />
      {showClearDates && (
        <div className="flex items-center justify-end">
          <Button
            variant="link"
            onClick={handleClearDates}
            className="underline"
          >
            clear dates
          </Button>
        </div>
      )}
    </div>
  );
}

interface DatePickerCustomDayProps {
  dayOfMonth: number;
  date?: Date | undefined;
}

export function DatePickerCustomDay({ dayOfMonth }: DatePickerCustomDayProps) {
  return <span className="react-datepicker__day_span">{dayOfMonth}</span>;
}

export function DatePickerCustomHeaderTwoMonth(
  props: ReactDatePickerCustomHeaderProps
) {
  const { monthDate, customHeaderCount, decreaseMonth, increaseMonth } = props;

  return (
    <div>
      <button
        aria-label="Previous Month"
        className={
          "react-datepicker__navigation react-datepicker__navigation--previous absolute -top-1 left-0 flex items-center justify-center rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        }
        style={customHeaderCount === 1 ? { visibility: "hidden" } : {}}
        onClick={decreaseMonth}
        type="button"
      >
        <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">
          <ChevronLeftIcon className="h-5 w-5" />
        </span>
      </button>
      <span className="react-datepicker__current-month">
        {monthDate.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </span>
      <button
        aria-label="Next Month"
        className="react-datepicker__navigation react-datepicker__navigation--next absolute -right-0 -top-1 flex items-center justify-center rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        style={customHeaderCount === 0 ? { visibility: "hidden" } : {}}
        type="button"
        onClick={increaseMonth}
      >
        <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next">
          <ChevronRightIcon className="h-5 w-5" />
        </span>
      </button>
    </div>
  );
}
