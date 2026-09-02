import { SectionHeading } from "@/src/components/ui/SectionHeading";
import {
  SlideInBackground,
  type SlideDirection,
} from "../motion/SlideInBackground";
import { TextInView } from "../motion/TextInView";
import type { CSSProperties } from "react";

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
  config: CollectionLayoutConfig;
};

type CollectionLayoutConfig = {
  wrapperClass: string;
  objectPosition: CSSProperties["objectPosition"];
  direction: SlideDirection;
  delay: number;
};

const collectionLayout: CollectionLayoutConfig[] = [
  {
    wrapperClass: "col-span-4",
    objectPosition: "center",
    direction: "left",
    delay: 0.5,
  },
  {
    wrapperClass: "col-span-2",
    objectPosition: "top",
    direction: "right",
    delay: 0.5,
  },
  {
    wrapperClass: "col-span-2",
    objectPosition: "bottom",
    direction: "top",
    delay: 0.5,
  },
  {
    wrapperClass: "col-span-4",
    objectPosition: "center",
    direction: "bottom",
    delay: 0.5,
  },
];

function CollectionCard({ item, config }: CollectionCardProps) {
  return (
    <article
      className={`${config.wrapperClass} relative h-70 overflow-hidden rounded-sm`}
    >
      <SlideInBackground
        alt={item.title}
        direction={config.direction}
        delay={config.delay}
        image={item.image}
        objectPosition={config.objectPosition}
      />

      <div className="absolute inset-0 z-20 bg-linear-to-t from-black/50 via-black/30 to-transparent" />

      <div className="relative z-30 flex h-full items-end p-4">
        <TextInView className="space-y-1">
          <h3 className="heading-font text-lg font-medium text-white">
            {item.title}
          </h3>
          <p className="text-sm text-white">{item.subtitle}</p>
        </TextInView>
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
      <div className="grid-cols-6 grid-rows-2 flex-col gap-8 lg:grid">
        {items.map((item, index) => {
          const config = collectionLayout[index % collectionLayout.length];

          return <CollectionCard key={item.id} item={item} config={config} />;
        })}
      </div>
    </section>
  );
}
