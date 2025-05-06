"use client";

import React, { ReactNode, useMemo, useState } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { Icon as IconData, icons, LucideProps } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DebouncedInput } from "@/components/ui/debounce-input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";

export type IconType = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

export interface IconData {
  name: string;
  Icon: IconType | ReactNode;
}

interface Props {
  className?: string;
  value?: IconData;
  onChange?: (data: IconData) => void;
}

export function IconPicker({ value, onChange, className }: Props) {
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const iconList = useMemo(() => {
    const map = new Map();
    Array.from(map, ([name, Icon]) => ({ name, Icon }));

    return Object.entries(icons)
      .filter(([name]) => {
        if (search) {
          return name.toLowerCase().includes(search.toLowerCase());
        }
        return true;
      })
      .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
      .map(([name, Icon]) => ({ name, Icon }));
  }, [search]);

  return (
    <ResponsiveDialog open={pickerOpen} onOpenChange={setPickerOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("flex h-12 w-full items-center space-x-2", className)}
        >
          {selectedIcon ? (
            <div className="flex items-center space-x-4">
              {/* @ts-ignore*/} {/* TODO: Fix the error here */}
              <selectedIcon.Icon className="size-6" />
              <span>Change Icon</span>
            </div>
          ) : (
            <>
              <span>Pick an icon</span>
            </>
          )}
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="h-full max-h-[456px] w-[400px] pb-0">
        <div className="h-fit space-y-3 py-0">
          <ResponsiveDialogTitle className="text-center">
            Pick an icon
          </ResponsiveDialogTitle>
          <div className="group my-4 flex h-12 w-full items-center rounded-xl border border-border px-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500">
            <MagnifyingGlassIcon className="size-8 text-gray-400" />
            <DebouncedInput
              type="text"
              placeholder="Search icons"
              className="w-full rounded-md border-transparent text-body shadow-none focus:outline-none focus:ring-0 focus-visible:border-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent"
              value={search}
              onChange={(e) => setSearch(e as string)}
            />
          </div>
        </div>
        <div className="h-fit overflow-y-auto py-0">
          <RadioGroup
            onValueChange={(value) => {
              const data = {
                name: value,
                Icon: icons[value as keyof typeof icons],
              };
              setSelectedIcon(data);
            }}
            defaultValue={value?.name}
            value={value?.name}
            className="w-full"
          >
            <Grid
              columnCount={6}
              height={250}
              rowCount={iconList.length}
              rowHeight={56}
              columnWidth={56}
              width={456}
            >
              {({ columnIndex, rowIndex, style }) => {
                const index = rowIndex * 6 + columnIndex;
                const item = iconList[index];

                if (!item) {
                  return null;
                }

                const { Icon } = item;
                return (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div style={style} className="relative">
                          <RadioGroupItem
                            value={item.name}
                            id={item.name}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={item.name}
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:cursor-pointer hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-500 [&:has([data-state=checked])]:border-brand-500"
                          >
                            <Icon className="size-6" />
                          </Label>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>{item.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }}
            </Grid>
          </RadioGroup>
          <ResponsiveDialogFooter>
            <div className="flex w-full justify-between py-4">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (onChange) {
                    onChange(selectedIcon as IconData);
                    setPickerOpen(false);
                  }
                }}
                className="rounded-full bg-accent-500 px-6 text-negative"
              >
                Confirm
              </Button>
            </div>
          </ResponsiveDialogFooter>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
