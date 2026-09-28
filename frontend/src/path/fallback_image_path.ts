export type DisplayProduct = {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  label: string;
  isFallback: boolean;
  slug: string;
};
export const fallbackProducts2: DisplayProduct[] = [
  {
    id: "atelier-plush-2",
    name: "Velvet Bunny Companion",
    category: "Luxury Plush",
    price: "¥68",
    image: "/homepage/kappa-plush-toy-holding-cucumber.png",
    label: "New",
    isFallback: true,
    slug: "atelier-plush-2",
  },
  {
    id: "atelier-journal-2",
    name: "Floral Daybook",
    category: "Stationery Stories",
    price: "¥42",
    image:
      "/homepage/blue-and-gold-mythical-creature-plush-toy-wooden-shelf.png",
    isFallback: true,
    slug: "atelier-journal-2",
    label: "Curated",
  },
  {
    id: "atelier-charm-2",
    name: "Lucky Cat Trinket",
    category: "Designer Trinkets",
    price: "¥36",
    image: "/homepage/blue-maneki-neko-figurine-display-case.png",
    isFallback: true,
    slug: "atelier-charm-2",
    label: "Limited",
  },
  {
    id: "atelier-gift-2",
    name: "A Quiet Celebration",
    category: "Atelier Gift Sets",
    price: "¥118",
    image: "/homepage/black-two-tailed-cat-plush-display-case.png",
    label: "Gift Set",
    isFallback: true,
    slug: "atelier-gift-2",
  },
];
