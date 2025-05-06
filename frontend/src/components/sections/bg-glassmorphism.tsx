import React from "react";
import { cn } from "@/lib/utils";

export interface Props {
  className?: string;
}

export function BgGlassmorphism({ className }: Props) {
  return (
    <div
      className={cn(
        "nc-BgGlassmorphism absolute inset-x-0 z-0 flex min-h-0 overflow-hidden py-24 pl-20 md:top-10 xl:top-40",
        className
      )}
      data-nc-id="BgGlassmorphism"
    >
      <span className="block h-72 w-72 rounded-full bg-brand-500 opacity-10 mix-blend-multiply blur-3xl filter lg:h-96 lg:w-96" />
      <span className="nc-animation-delay-2000 -ml-20 mt-40 block h-72 w-72 rounded-full bg-accent-500 opacity-10 mix-blend-multiply blur-3xl filter lg:h-96 lg:w-96"></span>
    </div>
  );
}
