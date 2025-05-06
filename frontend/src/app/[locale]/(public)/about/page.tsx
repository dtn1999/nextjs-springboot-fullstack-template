import { BgGlassmorphism } from "@/components/sections/bg-glassmorphism";
import { SectionHero } from "@/components/sections/hero/about-section-hero";
import { FounderSection } from "@/components/sections/founder-section";

export default function Page() {
  return (
    <main className="mx-auto max-w-7xl px-4">
      <BgGlassmorphism />
      <div className="container space-y-16 py-16 lg:space-y-28 lg:py-28">
        <SectionHero
          rightImg="https://res.cloudinary.com/danyngongang/image/upload/v1740948915/dig/acgxpz0lxctdga7m6bcg.jpg"
          heading="👋 About Us."
          btnText=""
          subHeading="We’re impartial and independent, and every day we create distinctive, world-class programmes and content which inform, educate and entertain millions of people in the around the world."
        />
        <FounderSection />
      </div>
    </main>
  );
}
