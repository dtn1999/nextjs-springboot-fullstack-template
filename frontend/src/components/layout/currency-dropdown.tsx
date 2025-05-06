"use client";

import {
  BanknotesIcon,
  CurrencyDollarIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useGlobalStore } from "@/store";
import { Currency } from "@/i18n/types";

export const SUPPORTED_CURRENCIES = [
  {
    id: "EUR",
    name: "EUR",
    icon: CurrencyEuroIcon,
    active: true,
  },
  {
    id: "USD",
    name: "USD Dollar",
    icon: CurrencyDollarIcon,
  },
];

export function CurrencyDropdown() {
  const [open, setOpen] = useState(false);
  const { setActiveCurrency } = useGlobalStore();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={`relative flex items-center justify-center space-x-1 self-center text-caption ring-0 ring-transparent hover:text-title focus:outline-none focus:ring-transparent`}
      >
        <BanknotesIcon className="size-5" />
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
        {SUPPORTED_CURRENCIES.map((item, index) => (
          <DropdownMenuItem
            key={index}
            className={`flex items-center space-x-2 rounded-md px-4 py-2 text-sm text-body hover:bg-gray-50 ${
              item.active ? "bg-gray-100 hover:bg-gray-100" : "opacity-80"
            }`}
            onClick={() => setActiveCurrency(item.id as Currency)}
          >
            <item.icon className="size-[18px]" />
            <span className="text-sm font-medium">{item.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
