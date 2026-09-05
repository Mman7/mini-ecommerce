"use client";

import { useEffect } from "react";
import { getCurrentUser } from "@/src/api/user.api";
import { useGlobalStore } from "@/src/store/global.store";
import { useCartStore } from "@/src/store/cart.store";
import { AuthStatus } from "@/src/types/user";

// The AuthInitializer component is responsible for initializing the authentication state of the application.
// It checks if the user is currently authenticated by calling the getCurrentUser API function.
// Based on the response, it updates the global store with the user's information and authentication status.
export function AuthInitializer() {
  const setUser = useGlobalStore((state) => state.setUser);
  const setAuthStatus = useGlobalStore((state) => state.setAuthStatus);
  const refreshCart = useCartStore((state) => state.refreshCart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    let cancelled = false;

    getCurrentUser()
      .then(({ user }) => {
        if (!cancelled) {
          setUser(user);
          setAuthStatus(AuthStatus.Authenticated);
          void refreshCart();
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setAuthStatus(AuthStatus.Unauthenticated);
          clearCart();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clearCart, refreshCart, setAuthStatus, setUser]);

  return null;
}
