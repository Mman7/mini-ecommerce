import ProductGrid from "../../components/sections/ProductGrid";
import FiltersSidebar from "../../components/sections/FiltersSidebar";
import SortingBar from "../../components/sections/SortingBar";
import Pagination from "../../components/ui/Pagination";
import { mockProducts } from "../../lib/mock-products";
import { AtelierBackdrop } from "../../components/ui/BackgroundImage";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ProductsPage() {
  return (
    <main className="pb-15">
      <section className="padding-inline mb-xl relative flex h-[40vh] items-center overflow-hidden md:h-[50vh]">
        <div className="">
          <AtelierBackdrop />
          <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-black/90 via-black/60 to-transparent" />
        </div>
        <div className="px-margin-mobile md:px-margin-desktop relative z-10 w-full py-12 text-left md:py-20">
          <Breadcrumb className="text-label-sm font-label-sm text-on-surface/50 mb-xs">
            <BreadcrumbList className="gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="title-font text-md font-semibold tracking-wide text-(--outline)"
                  render={<Link href="/" />}
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="title-font text-md font-semibold tracking-wide text-(--outline)"
                  render={<Link href="/products" />}
                >
                  Shop
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="title-font text-primary-soft! text-md font-semibold tracking-wide">
                  Collectibles
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="font-display-lg text-on-surface my-4 text-4xl font-semibold">
            Collectibles
          </h1>
          <p className="text-body-lg font-body-lg mt-base text-text-muted max-w-2xl">
            A curated sanctuary of plush treasures, limited anime editions, and
            handcrafted figurines from the heart of Tokyo's artisan scene.
          </p>
        </div>
      </section>

      <div className="padding-inline mt-10 grid grid-cols-1 gap-4 md:grid-cols-12">
        <aside className="md:col-span-3">
          <FiltersSidebar />
        </aside>
        <div className="md:col-span-9">
          <SortingBar />
          <ProductGrid products={mockProducts} />
          <Pagination />
        </div>
      </div>
    </main>
  );
}
