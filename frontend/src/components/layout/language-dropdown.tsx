"use client";

import { LanguageIcon } from "@heroicons/react/24/outline";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useLanguageSwitch } from "@/i18n/use-language-switch";
import { Locale } from "@/i18n/types";
import { useGlobalStore } from "@/store";
import { useLocale } from "@/i18n/use-local";
import { cn } from "@/lib/utils";

export const SUPPORTED_LANGUAGES = [
  {
    id: "en",
    name: "English",
    description: "United State",
  },
  {
    id: "fr",
    name: "Francais",
    description: "France",
  },
];

export function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const { setLoading, setActiveLocale } = useGlobalStore();
  const { activeLocale } = useLocale();
  const { isPending, onSelectChange } = useLanguageSwitch();

  const handleSelectChange = (nextLocale: Locale) => {
    onSelectChange(nextLocale);
    setActiveLocale(nextLocale);
  };

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={`relative flex items-center justify-center space-x-1 self-center text-caption ring-0 ring-transparent hover:text-title focus:outline-none focus:ring-transparent`}
      >
        <LanguageIcon className="size-5" />
        {open ? (
          <ChevronUpIcon
            className={`size-4 transition duration-150 ease-in-out group-hover:text-opacity-80`}
            aria-hidden="true"
          />
        ) : (
          <ChevronDownIcon
            className={`size-4 transition duration-150 ease-in-out group-hover:text-opacity-80`}
            aria-hidden="true"
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-fit space-y-2 rounded-[20px] bg-white px-2 py-4"
        align="end"
      >
        {SUPPORTED_LANGUAGES.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => handleSelectChange(item.id as Locale)}
            className={cn(
              `flex items-center space-x-2 rounded-md px-4 py-2 text-sm text-body opacity-80 hover:cursor-pointer hover:bg-gray-50`,
              {
                "bg-gray-100 hover:bg-gray-100": item.id === activeLocale,
              }
            )}
          >
            <span className="text-sm font-medium">{item.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
