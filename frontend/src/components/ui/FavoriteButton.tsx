"use client";

import { Heart } from "lucide-react";
import {
  addFavourite,
  getFavourites,
  removeFavourite,
} from "@/src/api/favourite.api";
import { useEffect, useState } from "react";

type FavoriteButtonProps = {
  productId: number | string;
  productName: string;
};

export function FavoriteButton({
  productId,
  productName,
}: FavoriteButtonProps) {
  const numericProductId = Number(productId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getFavourites()
      .then(({ favourites }) => {
        if (isMounted) {
          setIsFavorite(
            favourites.some(
              (favourite) => favourite.productId === numericProductId,
            ),
          );
        }
      })
      .catch(() => {
        // Guests and expired sessions simply start with an unselected button.
      });

    return () => {
      isMounted = false;
    };
  }, [numericProductId]);

  async function handleToggle() {
    if (
      isPending ||
      !Number.isInteger(numericProductId) ||
      numericProductId < 1
    ) {
      return;
    }

    const nextValue = !isFavorite;
    setIsFavorite(nextValue);
    setIsPending(true);

    try {
      if (nextValue) {
        await addFavourite(numericProductId);
      } else {
        await removeFavourite(numericProductId);
      }
    } catch {
      setIsFavorite(!nextValue);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={`${isFavorite ? "Remove" : "Add"} ${productName} ${isFavorite ? "from" : "to"} favorites`}
      aria-pressed={isFavorite}
      aria-busy={isPending}
      data-product-id={productId}
      disabled={isPending}
      onClick={handleToggle}
      className="bg-surface-2/80 text-on-surface hover:text-primary absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-colors"
    >
      <Heart fill={isFavorite ? "currentColor" : "none"} />
    </button>
  );
}
