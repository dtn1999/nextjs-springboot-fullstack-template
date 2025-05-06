import { cn } from "@/lib/utils";
import React, { HTMLAttributes, ReactNode } from "react";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  fontClass?: string;
  desc?: ReactNode;
  isCenter?: boolean;
  descClass?: string;
}

export function Heading({
  children,
  desc = "Discover the most outstanding articles in all topics of life. ",
  className = "mb-10 text-neutral-900 dark:text-neutral-50",
  isCenter = false,
  descClass,
  ...args
}: HeadingProps) {
  return (
    <div className={`nc-Section-Heading relative ${className}`}>
      <div
        className={
          isCenter ? "mx-auto mb-4 w-full max-w-2xl text-center" : "max-w-2xl"
        }
      >
        <div className={`text-2xl font-semibold md:text-4xl`} {...args}>
          {children || `Section Heading`}
        </div>
        {desc && (
          <span
            className={cn(
              "mt-2 block text-wrap text-base font-normal text-neutral-500 dark:text-neutral-400 sm:text-lg md:mt-3 lg:text-nowrap",
              descClass
            )}
          >
            {desc}
          </span>
        )}
      </div>
    </div>
  );
}
