"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../../api/category.api";
import ProductsAside from "../../components/sections/ProductsAside";
import ProductsBreadcrumb from "../../components/sections/ProductsBreadcrumb";
import { AtelierBackdrop } from "../../components/ui/BackgroundImage";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="padding-inline py-40" />}>
      <ProductsLayoutContent>{children}</ProductsLayoutContent>
    </Suspense>
  );
}

function ProductsLayoutContent({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const categoryId = Number(searchParams.get("categoryId"));
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.list,
  });

  const categories = categoriesQuery.data ?? [];
  const selectedCategory = categories.find(
    (category) => category.categoryId === categoryId,
  );
  const heading = selectedCategory?.name ?? "Collectibles";

  return (
    <main className="pb-15">
      <section className="padding-inline mb-xl relative flex h-[40vh] items-center overflow-hidden md:h-[50vh]">
        <AtelierBackdrop />
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-black/90 via-black/60 to-transparent" />
        <div className="px-margin-mobile md:px-margin-desktop relative z-10 w-full py-12 text-left md:py-20">
          <ProductsBreadcrumb heading={heading} />
          <h1 className="font-display-lg text-on-surface my-4 text-4xl font-semibold">
            {heading}
          </h1>
          <p className="text-body-lg font-body-lg mt-base text-text-muted max-w-2xl">
            A curated sanctuary of plush treasures, limited anime editions, and
            handcrafted figurines from the heart of Tokyo&apos;s artisan scene.
          </p>
        </div>
      </section>
      <div className="padding-inline mt-10 grid grid-cols-1 gap-4 md:grid-cols-12">
        <ProductsAside categories={categories} />
        <div className="md:col-span-9">{children}</div>
      </div>
    </main>
  );
}
