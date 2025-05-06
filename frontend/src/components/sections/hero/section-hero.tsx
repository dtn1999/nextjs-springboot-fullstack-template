import React from "react";
import Image from "next/image";
import { HeroSearchForm } from "./hero-search-form";

export interface Props {
  className?: string;
}

export function SectionHero({ className = "" }: Props) {
  return (
    <div className={`nc-SectionHero relative flex flex-col ${className}`}>
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        <div className="flex max-w-[527px] flex-shrink-0 flex-col items-start space-y-8 pb-14 pt-12 sm:space-y-10 lg:me-10 lg:pb-64 xl:me-0 xl:pe-14">
          <h2 className="text-4xl font-medium !leading-[114%] md:text-5xl xl:text-7xl">
            Votre sejour parfait,{" "}
            <span className="text-brand-500">Simplifie</span>
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 md:text-lg">
            Louez des logements uniques pour une durée déterminée, que ce soit
            pour une escapade rapide ou un long séjour, avec Cozi Stay – où le
            confort rencontre la flexibilité.
          </p>
        </div>
        <div className="relative h-[320px] w-full flex-grow lg:h-[687px]">
          <Image
            className="w-full"
            src="/images/hero/image.png"
            alt="hero"
            fill
            priority
            sizes="(max-width: 639px) 100vw, (max-width: 767px) 80vw, (max-width: 1023px) 50vw, 527px"
          />
        </div>
      </div>

      <div className="z-10 mb-3 hidden w-full md:block lg:mb-0 xl:-mt-40">
        <HeroSearchForm />
      </div>
    </div>
  );
}
