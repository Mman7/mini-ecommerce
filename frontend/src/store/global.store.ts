import { create } from "zustand";
import type { User } from "../api/user.api";
import { AuthStatus } from "../types/user";

interface GlobalStore {
  isLoggedIn: boolean;
  authStatus: AuthStatus;
  user: User | null;
  setUser: (user: User | null) => void;
  setAuthStatus: (authStatus: AuthStatus) => void;
  logout: () => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  isLoggedIn: false,
  // authStatus is initialized to Loading, and will be updated by the AuthInitializer component
  authStatus: AuthStatus.Loading,
  user: null,
  // setUser updates the user state and also sets isLoggedIn based on whether the user is null or not
  setUser: (user) => set({ user, isLoggedIn: user !== null }),
  setAuthStatus: (authStatus) => set({ authStatus }),
  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      authStatus: AuthStatus.Unauthenticated,
    }),
}));
