import { SectionHeading } from "@/src/components/ui/SectionHeading";

export type CollectionItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

type CollectionsSectionProps = {
  items: CollectionItem[];
};

type CollectionCardProps = {
  item: CollectionItem;
  cfg?: { wrapperClass?: string; imageStyle?: React.CSSProperties };
  wrapperClasses: string;
};

const gridConfig: Array<{
  wrapperClass?: string;
  imageStyle?: React.CSSProperties;
}> = [
  {
    wrapperClass: "col-span-4",
    imageStyle: { backgroundPosition: "center" },
  },
  {
    wrapperClass: "col-span-2",
    imageStyle: { backgroundPosition: "top" },
  },
  {
    wrapperClass: "col-span-2",
    imageStyle: { backgroundPosition: "bottom" },
  },
  {
    wrapperClass: "col-span-4",
    imageStyle: { backgroundPosition: "center" },
  },
];

function CollectionCard({ item, cfg, wrapperClasses }: CollectionCardProps) {
  return (
    <article className={`${wrapperClasses} relative h-70 overflow-hidden`}>
      {/* subtle primary glow behind the card */}
      <div
        className="absolute -inset-3 rounded-sm opacity-10 blur-xl"
        style={{ background: "var(--primary)" }}
        aria-hidden
      />

      {/* background image */}
      <div
        className="absolute inset-0 z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url(${item.image})`,
          ...(cfg?.imageStyle || {}),
        }}
        aria-hidden
      />

      <div className="absolute inset-0 z-20 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

      <div className="relative z-30 flex h-full items-end p-4">
        <div className="space-y-1">
          <h3 className="heading-font text-lg font-medium text-white">
            {item.title}
          </h3>
          <p className="text-sm text-white">{item.subtitle}</p>
        </div>
      </div>
    </article>
  );
}

export function CollectionsSection({ items }: CollectionsSectionProps) {
  return (
    <section className="padding-inline mt-16 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading
          description="Each collection is a shelf of stories, textures, and tiny details designed to feel handcrafted and precious."
          title="Our Artisanal Collections"
        />
        <a
          className="meta-font text-primary-soft hidden text-xs sm:block"
          href="/products"
        >
          View All Collections
        </a>
      </div>
      <div className="grid grid-cols-6 grid-rows-2 gap-8">
        {items.map((item, index) => {
          const rowSPanClass = gridConfig[index]?.wrapperClass;
          const wrapperClasses = `${rowSPanClass} rounded-sm`;

          return (
            <CollectionCard
              key={item.id}
              item={item}
              cfg={gridConfig[index]}
              wrapperClasses={wrapperClasses}
            />
          );
        })}
      </div>
    </section>
  );
}
