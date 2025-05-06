import { PlayIcon as HeroPlayIcon } from "@heroicons/react/24/solid";
import React from "react";

export interface NcPlayIconProps {
  className?: string;
}

export function PlayIcon({ className = "" }: NcPlayIconProps) {
  return (
    <div
      className={`nc-NcPlayIcon h-20 w-20 rounded-full bg-white bg-opacity-30 p-3 backdrop-blur backdrop-filter lg:h-52 lg:w-52 lg:p-12 ${className}`}
    >
      <div className="relative h-full w-full rounded-full bg-white text-brand-500">
        <span className="absolute inset-0 flex items-center justify-center">
          <HeroPlayIcon className="h-8 w-8 md:h-12 md:w-12 rtl:rotate-180" />
        </span>
      </div>
    </div>
  );
}

export interface Props {
  className?: string;
  iconClass?: string;
}

export function NcPlayIcon2(props: Props) {
  const { className = "w-8 h-8 md:w-10 md:h-10", iconClass = "w-5 h-5" } =
    props;

  return (
    <div
      className={`nc-NcPlayIcon2 relative rounded-full bg-white shadow-inner ${className}`}
    >
      <span className="absolute inset-0 flex items-center justify-center text-brand-500">
        <HeroPlayIcon className={iconClass + " rtl:rotate-180"} />
      </span>
    </div>
  );
}
