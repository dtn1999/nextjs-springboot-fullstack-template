import { SectionHero } from "@/components/sections/hero/section-hero";
import { JoinUsSection } from "@/components/sections/join-us-section";
import { BgGlassmorphism } from "@/components/sections/bg-glassmorphism";
import { SectionOurFeatures } from "@/components/sections/services-section";
import { ExperiencesSection } from "@/components/sections/experiences-section";

export default async function Page() {
  return (
    <main className="relative overflow-hidden">
      <BgGlassmorphism />
      <div className="relative mx-auto mb-24 max-w-7xl space-y-24 px-4 lg:mb-28 lg:space-y-28">
        <SectionHero className="pt-10 lg:pb-16 lg:pt-16" />
        <SectionOurFeatures />
        <JoinUsSection />
        <ExperiencesSection />
      </div>
    </main>
  );
}
