import type { Metadata } from "next";
import { Hero } from "@/components/sasehacks/Hero";
import { WhatIs } from "@/components/sasehacks/WhatIs";
import { Tracks } from "@/components/sasehacks/Tracks";
import { Schedule } from "@/components/sasehacks/Schedule";
import { Prizes } from "@/components/sasehacks/Prizes";
import { SponsorCta } from "@/components/sasehacks/SponsorCta";
import { Faq } from "@/components/sasehacks/Faq";
import { FinalCta } from "@/components/sasehacks/FinalCta";

export const metadata: Metadata = {
  title: "SASEHacks",
  description:
    "SASEHacks is OU SASE's student hackathon — build something in a weekend with people you just met. Dates and venue coming soon.",
};

export default function SaseHacksPage() {
  return (
    <>
      <Hero />
      <WhatIs />
      <Tracks />
      <Schedule />
      <Prizes />
      <SponsorCta />
      <Faq />
      <FinalCta />
    </>
  );
}
