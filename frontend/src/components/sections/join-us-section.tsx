import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

export function JoinUsSection() {
  return (
    <div className="rounded-3xl bg-neutral-50 px-2 py-16 lg:px-10">
      <section className="grid grid-cols-1 md:grid-cols-2">
        <article className="w-full">
          <AspectRatio ratio={1} className="relative">
            <Image
              src="/images/home/hosting-partner.png"
              fill
              className="object-contain"
              alt="hosting partner"
            />
          </AspectRatio>
        </article>
        <article className="flex flex-col justify-center px-4 py-16 md:px-8 lg:px-16">
          <h2 className="text-4xl font-semibold lg:text-6xl">
            Become a <br /> <span className="text-brand-400"> partner </span> an{" "}
            <br />
            earn more.
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Accompanying us, you have a trip full of experiences. With Chisfis,
            booking accommodation, resort villas, hotels, private houses,
            apartments... becomes fast, convenient and easy.
          </p>
          <div className="mt-8">
            <Link
              href="/hosting"
              className="flex w-fit items-center space-x-3 rounded-full bg-accent-500 px-6 py-4 text-negative"
            >
              <span className="text-nowrap">Host your home</span>
              <ArrowUpRightIcon className="size-6" />
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
