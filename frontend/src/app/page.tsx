import {
  type CollectionItem,
  CollectionsSection,
} from "@/src/components/sections/CollectionsSection";
import { FooterSection } from "@/src/components/sections/FooterSection";
import { HeroSection } from "@/src/components/sections/HeroSection";
import { SeasonalEditSection } from "@/src/components/sections/SeasonalEditSection";
import { NewsletterSection } from "@/src/components/sections/NewsletterSection";
import {
  type Testimonial,
  TestimonialsSection,
} from "@/src/components/sections/TestimonialsSection";
import { AtelierIntroductionSection } from "@/src/components/sections/AtelierIntroductionSection";
import {
  AtelierPhilosophySection,
  FinalCtaSection,
  GiftGuideSection,
  GiftMomentsSection,
  TokyoBoutiqueStorySection,
  VisualGallerySection,
  WhyShopSection,
} from "@/src/components/sections/EditorialHomepageSections";
import {
  KomorebiEditSection,
  NewArrivalsSection,
} from "@/src/components/sections/ProductDiscoverySections";

const collections: CollectionItem[] = [
  {
    id: "1",
    title: "Luxury Plush",
    subtitle: "Soft companions with artisan details and velvety finishes.",
    image: "/homepage/plush-toys-on-wooden-shelf.png",
  },
  {
    id: "2",
    title: "Stationery Stories",
    subtitle: "Illustrated notebooks, inks, and thoughtful letter sets.",
    image: "/homepage/komorebi-stationery-fountain-pen.png",
  },
  {
    id: "3",
    title: "Designer Trinkets",
    subtitle: "Pocket charms and shelf accents for your little sanctuary.",
    image: "/homepage/blue-maneki-neko-figurine-display-case.png",
  },
  {
    id: "4",
    title: "Atelier Gift Sets",
    subtitle: "Curated bundles wrapped for meaningful celebrations.",
    image: "/homepage/komorebi-gift-atelier-wrapped-boxes.png",
  },
];

const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Emilia",
    role: "Collector",
    quote:
      "The attention to detail in every plushie is simply breathtaking. It's not just a gift store; it's a curated experience of joy.",
  },
  {
    id: "t2",
    name: "Sora",
    role: "Gift Hunter",
    quote:
      "Finally, a place that treats stationery with the respect it deserves. The glass pens are a dream to use for my sketches.",
  },
  {
    id: "t3",
    name: "Milo",
    role: "Artist",
    quote:
      "The packaging alone is worth the visit. Every order feels like a personal treasure being handed over in Tokyo.",
  },
];

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CollectionsSection items={collections} />
      <AtelierIntroductionSection />
      <KomorebiEditSection />
      <GiftMomentsSection />
      <SeasonalEditSection />
      <AtelierPhilosophySection />
      <NewArrivalsSection />
      <TokyoBoutiqueStorySection />
      <WhyShopSection />
      <GiftGuideSection />
      <VisualGallerySection />
      <TestimonialsSection entries={testimonials} />
      <NewsletterSection />
      <FinalCtaSection />
    </main>
  );
}
