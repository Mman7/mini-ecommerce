import { Heart } from "lucide-react";
import { WishlistProductCard } from "../../../components/profile/WishlistProductCard";

const wishlistProducts = [
  {
    id: "kitsune-spirit",
    name: "Kitsune Spirit Plush",
    variant: "Snow White - Large",
    price: "RM 149.00",
    image: "/homepage/pink-plush-bunny.jpg",
    availability: "in-stock" as const,
  },
  {
    id: "sakura-bunny",
    name: "Sakura Dream Bunny",
    variant: "Blush - Medium",
    price: "RM 89.00",
    image: "/homepage/plush-toy-lineup.jpg",
    availability: "limited" as const,
  },
  {
    id: "midnight-figurine",
    name: "Midnight Bear Figurine",
    variant: "Matte Black - Standard",
    price: "RM 210.00",
    image: "/homepage/acrylic-figurines-display.jpg",
    availability: "out-of-stock" as const,
  },
  {
    id: "momiji-drop",
    name: "Momiji Amber Drop",
    variant: "Resin - Petite",
    price: "RM 45.00",
    image: "/homepage/gift-wrap-display.jpg",
    availability: "in-stock" as const,
  },
];

export default function WishlistPage() {
  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-3">
          <h1 className="heading-font text-foreground text-3xl font-semibold sm:text-4xl">
            My Wishlist
          </h1>
          <Heart className="text-secondary" size={24} fill="currentColor" />
        </div>
        <p className="text-text-muted mt-2 text-sm sm:text-base">
          A little collection of things you&apos;ve fallen in love with. (
          {wishlistProducts.length} items)
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {wishlistProducts.map((product) => (
          <WishlistProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
