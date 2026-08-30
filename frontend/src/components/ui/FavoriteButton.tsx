"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

type FavoriteButtonProps = {
  productId: string;
  productName: string;
};
// TODO implement this feature with backend integration and user authentication
export function FavoriteButton({
  productId,
  productName,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <button
      type="button"
      aria-label={`${isFavorite ? "Remove" : "Add"} ${productName} ${isFavorite ? "from" : "to"} favorites`}
      aria-pressed={isFavorite}
      data-product-id={productId}
      onClick={() => setIsFavorite((current) => !current)}
      className="bg-surface-2/80 text-on-surface hover:text-primary absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-colors"
    >
      <Heart fill={isFavorite ? "currentColor" : "none"} />
    </button>
  );
}
