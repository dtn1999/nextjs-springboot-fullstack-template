import React from "react";
import Image, { StaticImageData } from "next/image";
import { Heading } from "./heading";
import { Badge } from "@/components/ui/badge";

export interface SectionOurFeaturesProps {
  className?: string;
  rightImg?: StaticImageData;
  type?: "type1" | "type2";
}

export function SectionOurFeatures({}: SectionOurFeaturesProps) {
  return (
    <div className="">
      <div className="flex w-full items-center justify-center">
        <Heading
          className="text-nowrap text-center"
          desc="Let's travel around the world to experience and preserve life's best moments"
        >
          Your Gateway to Cameroon
        </Heading>
      </div>
      <div className={`relative grid grid-cols-1 md:grid-cols-2`}>
        <div className="flex-grow">
          <Image
            src="/images/home/bro.png"
            alt="Our Features"
            width={800}
            height={800}
          />
        </div>
        <div className={`mt-10 max-w-[413px] flex-shrink-0 py-14 lg:mt-0`}>
          <span className="text-sm uppercase tracking-widest text-gray-400">
            Benefits
          </span>
          <h2 className="mt-5 text-4xl font-semibold">Happening cities </h2>

          <ul className="mt-16 space-y-10">
            <li className="space-y-4">
              <Badge name="Advertising" />
              <span className="block text-xl font-semibold">
                Cost-effective advertising
              </span>
              <span className="mt-5 block text-neutral-500 dark:text-neutral-400">
                With a free listing, you can advertise your rental with no
                upfront costs
              </span>
            </li>
            <li className="space-y-4">
              <Badge color="green" name="Exposure " />
              <span className="block text-xl font-semibold">
                Reach millions with Chisfis
              </span>
              <span className="mt-5 block text-neutral-500 dark:text-neutral-400">
                Millions of people are searching for unique places to stay
                around the world
              </span>
            </li>
            <li className="space-y-4">
              <Badge color="red" name="Secure" />
              <span className="block text-xl font-semibold">
                Secure and simple
              </span>
              <span className="mt-5 block text-neutral-500 dark:text-neutral-400">
                A Holiday Lettings listing gives you a secure and easy way to
                take bookings and payments online
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
