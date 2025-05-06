import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

export interface Props {
  className?: string;
  rightImg: string;
  heading: ReactNode;
  subHeading: string;
  btnText: string;
}

export function SectionHero(props: Props) {
  const { className = "", rightImg, heading, subHeading, btnText } = props;

  return (
    <div className={`nc-SectionHero relative ${className}`}>
      <div className="relative flex flex-col items-center space-y-14 text-center lg:flex-row lg:gap-x-10 lg:space-y-0 lg:text-left">
        <div className="w-screen max-w-full space-y-5 lg:space-y-7 xl:max-w-lg">
          <h2 className="text-3xl font-semibold !leading-tight text-neutral-900 dark:text-neutral-100 md:text-4xl xl:text-5xl">
            {heading}
          </h2>
          <span className="block text-base text-neutral-600 dark:text-neutral-400 xl:text-lg">
            {subHeading}
          </span>
          {!!btnText && <Link href="/login">{btnText}</Link>}
        </div>
        <div className="relative aspect-square w-full flex-grow overflow-hidden rounded-lg md:aspect-[2/1]">
          <Image className="w-full object-cover" src={rightImg} alt="" fill />
        </div>
      </div>
    </div>
  );
}
