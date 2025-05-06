import {
  DebouncedInput,
  DebounceInputProps,
} from "@/components/ui/debounce-input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React from "react";
import { cn } from "@/lib/utils";

export function SearchInput(props: DebounceInputProps) {
  return (
    <div
      className={cn(
        "group my-4 flex h-10 w-full items-center rounded-full border border-border px-2 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500",
        props.className
      )}
    >
      <MagnifyingGlassIcon className="size-5 text-gray-400" />
      <DebouncedInput
        {...props}
        className="w-full rounded-md border-transparent text-body shadow-none focus:outline-none focus:ring-0 focus-visible:border-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent"
      />
    </div>
  );
}
