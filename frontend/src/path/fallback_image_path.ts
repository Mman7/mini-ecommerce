export type DisplayProduct = {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  label: string;
  isFallback: boolean;
};
export const fallbackProducts2: DisplayProduct[] = [
  {
    id: "atelier-plush-2",
    name: "Velvet Bunny Companion",
    category: "Luxury Plush",
    price: "RM 68.00",
    image: "/homepage/kappa-plush-toy-holding-cucumber.png",
    label: "New",
    isFallback: true,
  },
  {
    id: "atelier-journal-2",
    name: "Floral Daybook",
    category: "Stationery Stories",
    price: "RM 42.00",
    image:
      "/homepage/blue-and-gold-mythical-creature-plush-toy-wooden-shelf.png",
    label: "Curated",
    isFallback: true,
  },
  {
    id: "atelier-charm-2",
    name: "Lucky Cat Trinket",
    category: "Designer Trinkets",
    price: "RM 36.00",
    image: "/homepage/blue-maneki-neko-figurine-display-case.png",
    label: "Limited",
    isFallback: true,
  },
  {
    id: "atelier-gift-2",
    name: "A Quiet Celebration",
    category: "Atelier Gift Sets",
    price: "RM 118.00",
    image: "/homepage/black-two-tailed-cat-plush-display-case.png",
    label: "Gift Set",
    isFallback: true,
  },
];
