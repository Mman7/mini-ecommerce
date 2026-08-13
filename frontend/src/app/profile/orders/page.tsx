import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const orders = [
  {
    id: "KMB-8924",
    title: "Midnight Totoro Plush",
    date: "Oct 24, 2024",
    status: "Processing",
    image: "/homepage/pink-plush-bunny.jpg",
    tone: "pink",
  },
  {
    id: "KMB-8810",
    title: "Sakura Wind Chime",
    date: "Oct 18, 2024",
    status: "Shipped",
    image: "/homepage/acrylic-figurines-display.jpg",
    tone: "cyan",
  },
];

export default function MyOrdersPage() {
  return (
    <div className="space-y-8">
      <header className="pt-2">
        <h1 className="heading-font text-primary text-3xl font-semibold sm:text-4xl">
          My Orders
        </h1>
        <p className="text-text-muted mt-2 text-base">
          Keep track of your Komorebi treasures.
        </p>
      </header>

      <div className="space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="bg-surface-1 hover:border-primary/30 group flex flex-col gap-5 rounded-lg border border-(--glass-border) p-5 transition hover:shadow-[0_4px_20px_rgba(233,139,44,0.15)] sm:flex-row sm:items-center sm:p-6"
          >
            <div className="bg-surface-3 relative h-28 w-full shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-32">
              <Image
                src={order.image}
                alt={order.title}
                fill
                sizes="(min-width: 640px) 128px, 100vw"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    order.tone === "pink"
                      ? "bg-secondary/20 text-secondary"
                      : "bg-tertiary/20 text-tertiary"
                  }`}
                >
                  {order.status}
                </span>
                <span className="meta-font text-text-muted text-xs font-semibold">
                  Ord #{order.id}
                </span>
              </div>
              <h2 className="heading-font text-foreground text-xl font-medium sm:text-2xl">
                {order.title}
              </h2>
              <p className="text-text-muted text-base">
                Placed on {order.date}
              </p>
            </div>

            <Link
              href={`/profile/orders/${order.id}`}
              className="meta-font bg-surface-3 hover:bg-primary hover:text-primary-ink flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-(--glass-border) px-6 py-3 text-sm font-semibold transition sm:w-auto"
            >
              View Order
              <ArrowRight size={15} className="sm:hidden" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
