"use client";

import { Search, Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGlobalStore } from "@/src/store/global.store";
import { AuthStatus } from "@/src/types/user";

const navLinks = [
  { label: "Shop All", link: "/products" },
  { label: "New Arrivals", link: "/products" },
  { label: "Collectibles", link: "/products" },
];

export function NavbarSection() {
  const pathname = usePathname();
  const user = useGlobalStore((state) => state.user);
  const authStatus = useGlobalStore((state) => state.authStatus);
  const isAuthenticated = authStatus === AuthStatus.Authenticated;

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <header className="fixed top-0 z-100 w-full">
      <nav className="bg-surface-1 border-surface-3 border-b">
        <div className="mx-auto flex max-w-330 items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <div className="flex items-center">
            <Link
              href="/"
              className="title-font text-primary-soft! text-lg font-semibold tracking-wide"
            >
              Komorebi Gift Atelier
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            <ul className="flex items-center gap-6 text-sm">
              {navLinks.map((link, i) => (
                <li key={link.label}>
                  <Link
                    href={link.link || "#"}
                    className={`meta-font border-b-2 border-transparent pb-1 transition-colors duration-200 ${"text-text-muted hover:text-primary-soft hover:border-primary"}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="ml-6 w-85">
              <div className="bg-surface-3 flex items-center gap-3 rounded-full px-3 py-2">
                <Search size={16} className="text-text-muted" />
                <input
                  type="search"
                  placeholder="Search treasures..."
                  className="placeholder:text-text-muted text-foreground w-full bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/profile/wishlist"
              aria-label="Favorites"
              className="text-text-muted hover:text-primary hidden items-center justify-center rounded-full bg-transparent transition sm:flex"
            >
              <Heart size={18} />
            </Link>
            <Link
              href="/cart"
              aria-label="Bag"
              className="text-text-muted hover:text-primary items-center justify-center rounded-full bg-transparent transition"
            >
              <ShoppingBag size={18} />
            </Link>
            <Link
              href={isAuthenticated ? "/profile" : "/login"}
              aria-label={isAuthenticated ? "Profile" : "Sign in"}
              className="text-text-muted hover:text-primary flex items-center justify-center rounded-full bg-transparent transition"
            >
              {isAuthenticated ? (
                <span className="bg-primary text-primary-ink flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              ) : (
                <User size={18} />
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
