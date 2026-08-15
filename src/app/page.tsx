import { LandingHero } from "@/components/landing-hero";
import { LandingMission } from "@/components/landing/mission";
import { FeatureGrid } from "@/components/feature-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingCtaFooter } from "@/components/landing/cta-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StackSync — Master Production Code & On-Chain Apps",
  description:
    "A gamified learning platform bridging modern web engineering and blockchain development.",
  openGraph: {
    title: "StackSync — Master Production Code & On-Chain Apps",
    description:
      "A gamified learning platform bridging modern web engineering and blockchain development.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackSync — Master Production Code & On-Chain Apps",
    description:
      "A gamified learning platform bridging modern web engineering and blockchain development.",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <LandingHero />
      <LandingMission />
      <HowItWorks />
      <FeatureGrid />
      <LandingCtaFooter />
    </main>
  );
}
