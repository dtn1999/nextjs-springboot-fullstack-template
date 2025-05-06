"use client";

import React, { Fragment, useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";

import { DateRange } from "@/features/listings/components/listing-date-range-section";
import { DatePicker } from "@/components/date-picker";
import { ClearDataButton } from "@/components/ui/button";

export interface Props {
  className?: string;
  inline?: boolean;
  fieldClassName?: string;
  defaultDates?: DateRange;
  variant?: "mobile" | "desktop";
  onDatesChange?: (date: DateRange) => void;
}

export function DateRangeInput(props: Props) {
  const {
    className = "lg:nc-flex-2 ",
    fieldClassName = "nc-hero-field-padding",
    defaultDates,
    onDatesChange,
  } = props;

  const [dates, setDates] = useState<DateRange | undefined>(defaultDates);

  const startDate = dates?.start;
  const endDate = dates?.end;

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    setDates({
      start,
      end,
    });

    if (onDatesChange) {
      onDatesChange({
        start,
        end,
      });
    }
  };

  if (props.variant === "mobile") {
    return (
      <div>
        <div className="p-5">
          <span className="block text-xl font-semibold sm:text-2xl">
            {"When's your trip?"}
          </span>
        </div>
        <div
          className={`relative z-10 flex flex-shrink-0 justify-center py-5 ${className} `}
        >
          <DatePicker
            selectsRange
            endDate={endDate}
            selected={startDate}
            startDate={startDate}
            inline={props.inline}
            onChange={onChangeDate}
          />
        </div>
      </div>
    );
  }

  return (
    <Popover className={`StayDatesRangeInput relative z-10 flex ${className}`}>
      {({ open }) => (
        <>
          <PopoverButton
            className={`relative z-10 flex flex-1 ${fieldClassName} items-center gap-x-3 focus:outline-none ${
              open ? "nc-hero-field-focused" : ""
            }`}
          >
            <>
              <div className="text-neutral-300">
                <CalendarIcon className="h-5 w-5 lg:h-7 lg:w-7" />
              </div>
              <div className="flex-grow text-start">
                <span className="block font-semibold xl:text-lg">
                  {startDate?.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                  }) || "Add dates"}
                  {endDate
                    ? " - " +
                      endDate?.toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                      })
                    : ""}
                </span>
                <span className="mt-1 block text-sm font-light leading-none text-neutral-400">
                  {"CheckIn"} - {"CheckOut"}
                </span>
              </div>
            </>
            {startDate && open && (
              <ClearDataButton onClick={() => onChangeDate([null, null])} />
            )}
          </PopoverButton>

          {open && (
            <div className="absolute -inset-x-0.5 top-1/2 z-0 h-full -translate-y-1/2 self-center rounded-full bg-white dark:bg-neutral-800"></div>
          )}

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel className="absolute left-1/2 top-full z-10 mt-3 w-screen max-w-sm -translate-x-1/2 px-4 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-800">
                <DatePicker
                  selectsRange
                  endDate={endDate}
                  selected={startDate}
                  onChange={onChangeDate}
                  startDate={startDate}
                />
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
