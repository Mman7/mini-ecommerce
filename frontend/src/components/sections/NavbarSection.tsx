"use client";

import { Search, Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { useGlobalStore } from "@/src/store/global.store";
import { AuthStatus } from "@/src/types/user";
import { useCartStore } from "@/src/store/cart.store";
import { productApi, type Product } from "@/src/api/product.api";
import { yenCurrency } from "@/src/lib/currency";

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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

  const suggestionsQuery = useQuery({
    queryKey: ["product-search-suggestions", debouncedProductSearch.trim()],
    queryFn: () => productApi.search(debouncedProductSearch.trim()),
    enabled: showSuggestions,
    staleTime: 30_000,
  });

  useEffect(() => {
    const closeSearch = (event: PointerEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeSearch);
    return () => document.removeEventListener("pointerdown", closeSearch);
  }, []);

  function openProductSearch(query: string) {
    const normalizedQuery = query.trim();
    setShowSuggestions(false);
    setMobileSearchOpen(false);
    router.push(
      normalizedQuery
        ? `/products?name=${encodeURIComponent(normalizedQuery)}`
        : "/products",
    );
  }

  function renderSuggestions() {
    const suggestions = suggestionsQuery.data ?? [];
    return (
      <div className="bg-surface-1 border-surface-3 absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-md border shadow-xl">
        <p className="text-text-muted px-4 pt-3 pb-2 text-xs font-semibold">
          {debouncedProductSearch.trim()
            ? "Matching products"
            : "Popular picks"}
        </p>
        {suggestionsQuery.isFetching ? (
          <p className="text-text-muted px-4 py-3 text-sm">Searching...</p>
        ) : suggestions.length ? (
          <ul>
            {suggestions.map((product: Product) => (
              <li key={product.productId}>
                <button
                  type="button"
                  onClick={() => openProductSearch(product.name)}
                  className="hover:bg-surface-2 flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors"
                >
                  <span className="min-w-0">
                    <span className="text-foreground block truncate text-sm font-medium">
                      {product.name}
                    </span>
                    <span className="text-text-muted block truncate text-xs">
                      {product.category?.name ?? "Atelier selection"}
                    </span>
                  </span>
                  <span className="text-text-muted shrink-0 text-sm">
                    {yenCurrency.format(product.price)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-muted px-4 py-3 text-sm">
            No matching products
          </p>
        )}
        {productSearch.trim() && (
          <button
            type="button"
            onClick={() => openProductSearch(productSearch)}
            className="text-primary-soft border-surface-3 w-full border-t px-4 py-3 text-left text-sm font-semibold"
          >
            Search for “{productSearch.trim()}”
          </button>
        )}
      </div>
    );
  }

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
                <div className="relative ml-6 w-85">
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      openProductSearch(productSearch);
                    }}
                    className="bg-surface-3 flex items-center gap-3 rounded-full px-3 py-2"
                  >
                    <Search size={16} className="text-text-muted" />
                    <input
                      type="search"
                      aria-label="Search products"
                      placeholder="Search treasures..."
                      value={productSearch}
                      onFocus={() => setShowSuggestions(true)}
                      onChange={(event) => {
                        setProductSearch(event.target.value);
                        setShowSuggestions(true);
                      }}
                      className="placeholder:text-text-muted text-foreground w-full bg-transparent outline-none"
                    />
                  </form>
                  {showSuggestions && renderSuggestions()}
                </div>
              )}
            </div>

            <div className="relative flex items-center gap-6">
              <button
                type="button"
                aria-label="Search products"
                onClick={() => {
                  setMobileSearchOpen((open) => !open);
                  setShowSuggestions(true);
                }}
                className="text-text-muted hover:text-primary flex items-center justify-center rounded-full bg-transparent transition lg:hidden"
              >
                <Search size={18} />
              </button>
              {mobileSearchOpen && (
                <div className="bg-surface-1 border-surface-3 absolute top-full right-0 z-50 mt-4 w-[min(90vw,24rem)] rounded-md border p-3 shadow-xl lg:hidden">
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      openProductSearch(productSearch);
                    }}
                    className="bg-surface-3 flex items-center gap-3 rounded-full px-3 py-2"
                  >
                    <Search size={16} className="text-text-muted" />
                    <input
                      type="search"
                      aria-label="Search products"
                      placeholder="Search treasures..."
                      value={productSearch}
                      onFocus={() => setShowSuggestions(true)}
                      onChange={(event) => {
                        setProductSearch(event.target.value);
                        setShowSuggestions(true);
                      }}
                      className="placeholder:text-text-muted text-foreground w-full bg-transparent outline-none"
                    />
                  </form>
                  {showSuggestions && renderSuggestions()}
                </div>
              )}
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
