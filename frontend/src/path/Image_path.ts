export type EditorialTile = {
  title: string;
  description?: string;
  image: string;
  href?: string;
};

export const moments: EditorialTile[] = [
  {
    title: "For Someone Special",
    image: "/homepage/woman-holding-gift-in-cafe.png",
  },
  {
    title: "Just Because",
    image: "/homepage/photo-woman-writing-notebook-desk.png",
  },
  {
    title: "Little Celebrations",
    image: "/homepage/komorebi-gift-atelier-wrapped-boxes.png",
  },
];

export const guides: EditorialTile[] = [
  {
    title: "Under RM50",
    image: "/homepage/blue-maneki-neko-figurine-display-case.png",
    href: "/products?maxPrice=50",
  },
  {
    title: "Under RM100",
    image: "/homepage/komorebi-stationery-fountain-pen.png",
    href: "/products?maxPrice=100",
  },
  {
    title: "Little Luxuries",
    image: "/homepage/white-plush-rabbit-on-shelf.png",
    href: "/products",
  },
  {
    title: "For Slow Sundays",
    image: "/homepage/cozy-bookstore-interior-armchairs-lamp-books.png",
    href: "/products",
  },
  {
    title: "For a Fresh Page",
    image: "/homepage/photo-stationery-notebooks-quill-candle.png",
    href: "/products",
  },
  {
    title: "For the Big Reveal",
    image: "/homepage/opening-blue-gift-box.png",
    href: "/products",
  },
];

export const gallery = [
  ["/homepage/plush-toys-on-wooden-shelf.png", "Plush companions"],
  [
    "/homepage/photo-stationery-notebooks-quill-candle.png",
    "A note worth keeping",
  ],
  ["/homepage/lamp-on-desk-with-books-and-notebook.png", "Quiet corners"],
  ["/homepage/blue-maneki-neko-figurine-display-case.png", "Tiny treasures"],
  ["/homepage/opening-blue-gift-box.png", "The unwrapping"],
  [
    "/homepage/cozy-bookstore-interior-armchairs-lamp-books.png",
    "Tokyo shelves",
  ],
  [
    "/homepage/black-two-tailed-cat-plush-display-case.png",
    "Soft friends, curious faces",
  ],
  [
    "/homepage/blue-and-gold-mythical-creature-plush-toy-wooden-shelf.png",
    "A little mythical magic",
  ],
  [
    "/homepage/kappa-plush-toy-holding-cucumber.png",
    "A cheerful little companion",
  ],
];
