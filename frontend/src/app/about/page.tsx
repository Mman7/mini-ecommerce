"use client";

import { MotionConfig } from "motion/react";
import {
  CollectionCtaSection,
  CommitmentSection,
  CuratedWorldSection,
  FounderSection,
  GallerySection,
  HeroSection,
  KomorebiSection,
  PackagingSection,
  PhilosophySection,
  StorySection,
} from "./sections";

export default function AboutPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="overflow-hidden">
        <HeroSection />
        <StorySection />
        <KomorebiSection />
        <CuratedWorldSection />
        <PhilosophySection />
        <PackagingSection />
        <FounderSection />
        <GallerySection />
        <CommitmentSection />
        <CollectionCtaSection />
      </main>
    </MotionConfig>
  );
}
