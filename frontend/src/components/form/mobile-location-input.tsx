"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search01Icon } from "../icons";
import { ListingLocation } from "@/server/types/domain";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MapIcon } from "@heroicons/react/24/outline";

interface Props {
  onClick?: () => void;
  onChange?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  headingText?: string;
  locations: ListingLocation[];
}

export function MobileLocationInput(props: Props) {
  const {
    onChange = () => {},
    locations = [],
    className = "",
    defaultValue = "United States",
    headingText = "Where to?",
  } = props;

  const [value, setValue] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className={`${className}`} ref={containerRef}>
      <div className="p-5">
        <span className="block text-xl font-semibold sm:text-2xl">
          {headingText}
        </span>
        <div className="relative mt-5">
          <input
            className="focus:ring-primary-200 dark:focus:ring-primary-600 block w-full truncate rounded-xl border border-neutral-800 bg-transparent px-4 py-3 pe-12 text-base font-medium leading-none placeholder-neutral-500 placeholder:truncate focus:border-brand-300 focus:ring focus:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder-neutral-300 dark:focus:ring-opacity-25"
            placeholder={"Search destinations"}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            ref={inputRef}
          />
          <span className="absolute end-2.5 top-1/2 -translate-y-1/2">
            <Search01Icon className="h-5 w-5 text-neutral-700 dark:text-neutral-400" />
          </span>
        </div>
        <div className="mt-7">
          {locations.map((location) => (
            <button
              key={location.id}
              // onClick={() => handleLocationChange(location)}
              className={cn(
                "flex w-full items-center space-x-4 px-6 py-4 hover:cursor-pointer hover:rounded-md hover:bg-gray-100"
                // {
                //   "bg-gray-100 rounded-md":
                //     selectedLocation?.id === location.id,
                // },
              )}
            >
              <div className="relative size-10 overflow-hidden rounded-full">
                {location.monumentImageUrl ? (
                  <Image
                    src={location.monumentImageUrl}
                    alt={`Image of a monument in ${location.country}, ${location.city}`}
                    fill
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <MapIcon className="size-5" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-title">
                  {location.city}
                </span>
                <p className="font-light text-body">{location.country}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
