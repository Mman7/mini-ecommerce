type MockProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: { categoryId: number; name: string };
  brand: string;
  rating: number;
  label?: string;
  variant?: string;
};

export const mockProducts: MockProduct[] = [
  {
    id: "totoro-velour",
    name: "Totoro Velour Edition",
    price: 4500,
    image: "/homepage/plush-toys-on-wooden-shelf.png",
    category: {
      categoryId: 1,
      name: "Plush Toys",
    },
    brand: "Studio Ghibli",
    rating: 4.9,
    label: "New Arrival",
    variant: "new",
  },
  {
    id: "sakura-bunbun",
    name: "Sakura Bun-Bun",
    price: 3200,
    image: "/homepage/blue-maneki-neko-figurine-display-case.png",
    category: { categoryId: 1, name: "Plush Toys" },
    brand: "Harajuku Artisans",
    rating: 5.0,
  },
  {
    id: "anya-star",
    name: "Anya Star Edition",
    price: 12800,
    image: "/homepage/komorebi-gift-atelier-wrapped-boxes.png",
    category: { categoryId: 2, name: "Anime Figurines" },
    brand: "Good Smile Company",
    rating: 4.8,
    label: "Limited",
    variant: "limited",
  },
  {
    id: "tea-ritual-mini",
    name: "Tea Ritual Mini Set",
    price: 5900,
    image: "/homepage/komorebi-stationery-fountain-pen.png",
    category: { categoryId: 3, name: "Stationery" },
    brand: "Kyoto Traditions",
    rating: 4.7,
  },
  {
    id: "soot-sprite-fluff",
    name: "Soot Sprite Fluff",
    price: 1800,
    image: "/homepage/plush-toys-on-wooden-shelf.png",
    category: { categoryId: 1, name: "Plush Toys" },
    brand: "Studio Ghibli",
    rating: 4.9,
  },
  {
    id: "neo-shogun-neko",
    name: "Neo-Shogun Neko",
    price: 22500,
    image: "/homepage/blue-maneki-neko-figurine-display-case.png",
    category: { categoryId: 4, name: "Vinyl Art" },
    brand: "Art Toy Lab",
    rating: 5.0,
    label: "Collector's Choice",
    variant: "collector",
  },
];
