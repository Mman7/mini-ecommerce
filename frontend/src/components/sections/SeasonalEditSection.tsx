import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { Heart } from "lucide-react";
// TODO fetch data from database

export type SeasonalItem = {
  id: string;
  name: string;
  price: string;
  label: string;
  image: string;
};

type SeasonalEditSectionProps = {
  products: SeasonalItem[];
};

type SeasonalCardProps = {
  product: SeasonalItem;
};

function SeasonalCard({ product }: SeasonalCardProps) {
  return (
    <article className="group relative aspect-square overflow-hidden">
      <section className="relative overflow-hidden rounded-sm">
        <div
          className="size-80 rounded-sm bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.05]"
          style={{ backgroundImage: `url(${product.image})` }}
        />
        <button
          aria-label={`View ${product.name}`}
          className="bg-primary absolute bottom-4 left-1/2 z-20 -translate-x-1/2 translate-y-4 rounded-sm px-4 py-2 text-sm font-medium text-[var(--outline-strong)] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Quick Add
        </button>
      </section>

      <button
        aria-label="Add to favorites"
        className="bg-surface-2/80 text-on-surface hover:text-primary absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-colors"
      >
        <Heart />
      </button>
      <div className="space-y-2 p-4 text-center">
        <div className="flex items-baseline justify-center gap-4">
          <h3 className="heading-font text-base leading-tight">
            {product.name}
          </h3>
          <p className="meta-font text-primary-soft text-sm font-semibold">
            {product.price}
          </p>
        </div>
        <p className="meta-font text-secondary mx-auto inline-flex items-center rounded-full border border-[var(--outline-strong)] bg-[rgba(255,174,218,0.15)] px-2 py-0.5 text-[11px]">
          {product.label}
        </p>
      </div>
    </article>
  );
}

export function SeasonalEditSection({ products }: SeasonalEditSectionProps) {
  return (
    <section className="padding-inline mt-16 space-y-6">
      <SectionHeading title="The Seasonal Edit" />
      <div className="flex gap-6">
        {products.map((product) => (
          <SeasonalCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
