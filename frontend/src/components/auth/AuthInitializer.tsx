"use client";

import { useEffect } from "react";
import { getCurrentUser } from "@/src/api/user.api";
import { useGlobalStore } from "@/src/store/global.store";
import { AuthStatus } from "@/src/types/user";

// The AuthInitializer component is responsible for initializing the authentication state of the application.
// It checks if the user is currently authenticated by calling the getCurrentUser API function.
// Based on the response, it updates the global store with the user's information and authentication status.
export function AuthInitializer() {
  const setUser = useGlobalStore((state) => state.setUser);
  const setAuthStatus = useGlobalStore((state) => state.setAuthStatus);

  useEffect(() => {
    let cancelled = false;

    getCurrentUser()
      .then(({ user }) => {
        if (!cancelled) {
          setUser(user);
          setAuthStatus(AuthStatus.Authenticated);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setAuthStatus(AuthStatus.Unauthenticated);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [setAuthStatus, setUser]);

  return null;
}
