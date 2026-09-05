import { create } from "zustand";
import {
  getCart,
  normalizeCart,
  type Cart,
  type CartItem,
} from "../api/cart.api";

type CartStore = {
  userId: string;
  items: CartItem[];
  hasLoaded: boolean;
  isLoading: boolean;
  error: string;
  setCart: (cart: Cart) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
};

let cartRequest: Promise<void> | null = null;

export const useCartStore = create<CartStore>((set) => ({
  userId: "",
  items: [],
  hasLoaded: false,
  isLoading: false,
  error: "",
  setCart: (cart) =>
    set({ userId: cart.userId, items: cart.items, hasLoaded: true, error: "" }),
  clearCart: () =>
    set({
      userId: "",
      items: [],
      hasLoaded: false,
      isLoading: false,
      error: "",
    }),
  refreshCart: () => {
    if (useCartStore.getState().hasLoaded) return Promise.resolve();
    if (cartRequest) return cartRequest;

    set({ isLoading: true, error: "" });
    cartRequest = (async () => {
      try {
        const cart = normalizeCart(await getCart());
        set({
          userId: cart.userId,
          items: cart.items,
          hasLoaded: true,
          isLoading: false,
        });
      } catch (error) {
        set({
          isLoading: false,
          error:
            (error as { status?: number }).status === 401
              ? "unauthorized"
              : "Unable to load your bag.",
        });
      } finally {
        cartRequest = null;
      }
    })();

    return cartRequest;
  },
}));
