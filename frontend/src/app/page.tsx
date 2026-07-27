import {
  type CollectionItem,
  CollectionsSection,
} from "@/src/components/sections/CollectionsSection";
import { FooterSection } from "@/src/components/sections/FooterSection";
import { HeroSection } from "@/src/components/sections/HeroSection";
import {
  type SeasonalItem,
  SeasonalEditSection,
} from "@/src/components/sections/SeasonalEditSection";
import { NewsletterSection } from "@/src/components/sections/NewsletterSection";
import {
  type Testimonial,
  TestimonialsSection,
} from "@/src/components/sections/TestimonialsSection";

// TODO add smooth scrolling

const collections: CollectionItem[] = [
  {
    id: "1",
    title: "Luxury Plush",
    subtitle: "Soft companions with artisan details and velvety finishes.",
    image: "homepage/plush-toy-lineup.jpg",
  },
  {
    id: "2",
    title: "Stationery Stories",
    subtitle: "Illustrated notebooks, inks, and thoughtful letter sets.",
    image: "homepage/floral-journal-pen.jpg",
  },
  {
    id: "3",
    title: "Designer Trinkets",
    subtitle: "Pocket charms and shelf accents for your little sanctuary.",
    image: "homepage/acrylic-figurines-display.jpg",
  },
  {
    id: "4",
    title: "Atelier Gift Sets",
    subtitle: "Curated bundles wrapped for meaningful celebrations.",
    image: "homepage/gift-wrap-display.jpg",
  },
];

const seasonalItems: SeasonalItem[] = [
  {
    id: "s1",
    name: "Sakura Bunny Plush",
    label: "New",
    price: "$52.00",
    image: "",
  },
  {
    id: "s2",
    name: "Golden Koi Music Box",
    label: "Limited",
    price: "$64.00",
    image: "",
  },
  {
    id: "s3",
    name: "Moonlit Journal Set",
    label: "Bestseller",
    price: "$38.00",
    image: "",
  },
  {
    id: "s4",
    name: "Amber Glow Lamp",
    label: "Cozy",
    price: "$89.00",
    image: "",
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
      <SeasonalEditSection products={seasonalItems} />
      <NewsletterSection />
      <TestimonialsSection entries={testimonials} />
      <FooterSection />
    </main>
  );
}
