import { AtelierBackdrop } from "../ui/BackgroundImage";
import ProductsBreadcrumb from "./ProductsBreadcrumb";

export default function ProductsHero({
  heading,
  total,
}: {
  heading: string;
  total: number;
}) {
  return (
    <section className="relative flex items-center overflow-hidden">
      <AtelierBackdrop />
      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-black/90 via-black/60 to-transparent" />
      <div className="relative z-10 flex w-full flex-col items-start justify-between gap-3 px-4 py-8 min-[820px]:flex-row min-[820px]:items-end min-[820px]:gap-4 min-[820px]:px-16 min-[820px]:py-12">
        <div className="min-w-0">
          <ProductsBreadcrumb heading={heading} />
          <h1 className="font-display-lg text-on-surface mt-2 text-[28px] leading-9 font-semibold min-[820px]:text-3xl">
            {heading}
          </h1>
          <p className="text-body-md text-text-muted mt-1 max-w-2xl">
            A curated sanctuary of plush treasures, limited anime editions, and
            handcrafted figurines.
          </p>
        </div>
        <p className="text-on-surface/65 meta-font text-sm">
          Showing <span className="text-on-surface font-semibold">{total}</span>{" "}
          products
        </p>
      </div>
    </section>
  );
}
