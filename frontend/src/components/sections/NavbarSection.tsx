"use client";

import { Search, Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useGlobalStore } from "@/src/store/global.store";
import { AuthStatus } from "@/src/types/user";
import { useCartStore } from "@/src/store/cart.store";

const navLinks = [
  { label: "About Us", link: "/about" },
  { label: "Shop All", link: "/products" },
  { label: "New Arrivals", link: "/products?sortBy=createdAt&sortOrder=desc" },
];

export function NavbarSection() {
  const pathname = usePathname();
  const isProductsPage =
    pathname === "/products" || pathname.startsWith("/products/");
  const router = useRouter();
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [productSearch, setProductSearch] = useState("");
  const [debouncedProductSearch] = useDebounce(productSearch, 350);
  const lastSubmittedSearch = useRef("");
  const navbarRef = useRef<HTMLElement>(null);
  const user = useGlobalStore((state) => state.user);
  const authStatus = useGlobalStore((state) => state.authStatus);
  const isAuthenticated = authStatus === AuthStatus.Authenticated;
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  useLayoutEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;

    const updateNavbarHeight = () => {
      setNavbarHeight(navbar.getBoundingClientRect().height);
    };

    updateNavbarHeight();
    const observer = new ResizeObserver(updateNavbarHeight);
    observer.observe(navbar);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = debouncedProductSearch.trim();
    if (query === lastSubmittedSearch.current) return;

    lastSubmittedSearch.current = query;
    router.replace(
      query ? `/products?name=${encodeURIComponent(query)}` : "/products",
      { scroll: false },
    );
  }, [debouncedProductSearch, router]);

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <>
      <div aria-hidden="true" style={{ height: navbarHeight }} />
      <header ref={navbarRef} className="fixed top-0 z-100 w-full">
        <nav className="bg-surface-1 border-surface-3 border-b">
          <div className="mx-auto flex max-w-330 items-center justify-between gap-4 px-4 py-3 sm:px-5">
            <Link
              href="/"
              aria-label="Komorebi Gift Atelier home"
              className="flex items-center gap-2"
            >
              <Image
                src="/Shared/logo.png"
                alt=""
                width={40}
                height={40}
                priority
                className="h-10 w-10 object-contain"
              />
              <span className="title-font text-primary-soft! text-lg font-semibold tracking-wide">
                Komorebi Gift Atelier
              </span>
            </Link>

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

              {!isProductsPage && (
                <div className="ml-6 w-85">
                  <div className="bg-surface-3 flex items-center gap-3 rounded-full px-3 py-2">
                    <Search size={16} className="text-text-muted" />
                    <input
                      type="search"
                      aria-label="Search products"
                      placeholder="Search treasures..."
                      value={productSearch}
                      onChange={(event) => setProductSearch(event.target.value)}
                      className="placeholder:text-text-muted text-foreground w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
              )}
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
                aria-label={`Bag${cartCount ? `, ${cartCount} items` : ""}`}
                className="text-text-muted hover:text-primary relative flex items-center justify-center rounded-full bg-transparent transition"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="bg-primary text-primary-ink absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
                    {cartCount}
                  </span>
                )}
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
    </>
  );
}
