import { create } from "zustand";
import { User } from "../api/user.api";

interface GlobalStore {
  isLoggedIn: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  isLoggedIn: false,
  user: null,
  // setUser updates the user state and also sets isLoggedIn based on whether the user is null or not
  setUser: (user) => set({ user, isLoggedIn: user !== null }),
  logout: () => set({ user: null, isLoggedIn: false }),
}));
