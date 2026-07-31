import Image from "next/image";
import { ChevronDown, ChevronRight } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  image: string;
  quantity: number;
};

type GiftAddon = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  image: string;
};

type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
};

const cartItems: CartItem[] = [
  {
    id: "cart-1",
    name: "Sakura Fox Plush",
    subtitle: "Handcrafted Plush",
    price: "\u00a54,800",
    image: "/homepage/pink-plush-bunny.jpg",
    quantity: 1,
  },
  {
    id: "cart-2",
    name: "Totoro Velour Edition",
    subtitle: "High quality Edition",
    price: "\u00a512,500",
    image: "/homepage/acrylic-figurines-display.jpg",
    quantity: 1,
  },
];

const giftAddons: GiftAddon[] = [
  {
    id: "gift-1",
    name: "Premium Gift Wrapping",
    subtitle: "Premium Paper",
    price: "\u00a51,200",
    image: "/homepage/gift-wrap-display.jpg",
  },
  {
    id: "gift-2",
    name: "Small Greeting Cards",
    subtitle: "Small Greeting Card",
    price: "\u00a5500",
    image: "/homepage/floral-envelope-desk.jpg",
  },
];

const testimonials: Testimonial[] = [
  {
    id: "ts-1",
    name: "Emi Sato",
    role: "Collector",
    quote:
      "The attention to detail in every plushie is simply breathtaking. It's not just a gift store, it's a curated experience of joy.",
  },
  {
    id: "ts-2",
    name: "Kenji Tanaka",
    role: "Art Director",
    quote:
      "Finally, a place that treats stationery with the respect it deserves. The glass pens are a dream to use for my sketches.",
  },
  {
    id: "ts-3",
    name: "Mia Chen",
    role: "Gifting Expert",
    quote:
      "The packaging alone is worth the cost. Every order feels like a personal treasure being handed over in Tokyo.",
  },
];

export default function ShoppingCartPage() {
  return (
    <main className="pb-16">
      <section className="padding-inline relative mb-12 flex h-[40vh] items-center overflow-hidden md:h-[50vh]">
        <Image
          src="/Shared/Atelier Interior.png"
          alt="Shopping cart hero"
          fill
          priority
          className="object-cover"
        />
        <div className="from-background/95 via-background/78 pointer-events-none absolute inset-0 bg-linear-to-r to-transparent" />
        <div className="relative z-10 w-full py-12 md:py-20">
          <nav className="mb-3 flex items-center gap-2">
            <span className="title-font text-md font-semibold tracking-wide text-(--outline)">
              Home
            </span>
            <ChevronRight className="h-3 w-3 stroke-current text-(--outline)" />
            <span className="title-font text-primary-soft text-md font-semibold tracking-wide">
              Cart
            </span>
          </nav>
          <h1 className="heading-font text-foreground text-4xl font-semibold md:text-6xl">
            Shopping Cart
          </h1>
          <p className="text-text-muted mt-4 max-w-xl text-base leading-relaxed md:text-lg">
            Discover an exquisite collection of luxury plushies, handcrafted
            stationery, and artisanal treasures from the heart of Tokyo&apos;s
            boutique culture.
          </p>
        </div>
      </section>

      <section className="padding-inline mt-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:items-start">
          <div>
            <div className="border-surface-3 mb-5 flex items-baseline gap-2 border-b pb-4">
              <h2 className="heading-font text-foreground text-3xl font-semibold">
                Shopping Cart
              </h2>
              <span className="meta-font text-text-muted text-sm">
                (2 items)
              </span>
            </div>

            <div className="space-y-1">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="border-surface-3/70 grid gap-5 border-b py-7 sm:grid-cols-[120px_minmax(0,1fr)]"
                >
                  <div className="shelf-surface relative h-28 overflow-hidden rounded-lg border border-(--glass-border) sm:h-30 sm:w-30">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="heading-font text-foreground text-xl font-medium">
                          {item.name}
                        </h3>
                        <p className="text-text-muted text-sm">
                          {item.subtitle}
                        </p>
                      </div>
                      <p className="meta-font text-primary-soft text-lg font-semibold">
                        {item.price}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="bg-surface-2 inline-flex items-center rounded-md border border-(--outline-strong)">
                        <button
                          aria-label={`Decrease quantity for ${item.name}`}
                          className="focus-amber text-text-muted hover:text-foreground px-3 py-1 text-sm transition"
                        >
                          -
                        </button>
                        <span className="meta-font text-foreground w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          aria-label={`Increase quantity for ${item.name}`}
                          className="focus-amber text-text-muted hover:text-foreground px-3 py-1 text-sm transition"
                        >
                          +
                        </button>
                      </div>

                      <button className="meta-font focus-amber hover:text-primary-soft text-xs text-(--outline) underline decoration-(--outline-strong) underline-offset-4 transition">
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <form className="mt-6 flex flex-col gap-3 sm:flex-row" action="#">
              <input
                className="focus-amber bg-surface-2 text-foreground w-full rounded-md border border-(--outline-strong) px-4 py-3 text-sm placeholder:text-(--outline)"
                type="text"
                name="promoCode"
                placeholder="Gift Code / Promotional Code"
              />
              <button
                type="submit"
                className="focus-amber meta-font text-foreground hover:bg-surface-3 rounded-md border border-(--outline) px-5 py-3 text-sm transition"
              >
                Apply
              </button>
            </form>
          </div>

          <aside className="space-y-5">
            <section className="glass-panel rounded-xl p-6">
              <h3 className="heading-font border-surface-3 text-foreground border-b pb-4 text-2xl">
                Order Summary
              </h3>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm">Subtotal:</span>
                  <span className="meta-font text-foreground">
                    \u00a517,300
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-text-muted text-sm">Shipping:</span>
                  <div className="text-right">
                    <p className="meta-font text-foreground">Free</p>
                    <p className="text-xs text-(--outline)">
                      (Orders over \u00a515,000)
                    </p>
                  </div>
                </div>
              </div>

              <button className="focus-amber meta-font bg-primary-soft hover:bg-primary mt-6 w-full rounded-lg px-4 py-3 text-sm font-semibold text-(--primary-ink) transition">
                Secure Checkout
              </button>
            </section>

            <section className="glass-panel rounded-xl p-6">
              <h3 className="heading-font text-foreground text-2xl">
                Complete the Gift
              </h3>
              <p className="text-text-muted mt-1 text-sm">
                Choose an item to complete your gift.
              </p>

              <div className="mt-5 space-y-5">
                {giftAddons.map((addon) => (
                  <article key={addon.id} className="group cursor-pointer">
                    <div className="relative mb-3 h-28 overflow-hidden rounded-lg border border-(--glass-border)">
                      <Image
                        src={addon.image}
                        alt={addon.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="meta-font text-foreground group-hover:text-primary-soft text-sm font-semibold transition">
                          {addon.name}
                        </h4>
                        <p className="mt-1 text-xs text-(--outline)">
                          {addon.subtitle}
                        </p>
                      </div>
                      <span className="meta-font text-primary-soft text-sm">
                        {addon.price}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <button className="focus-amber meta-font text-text-muted hover:text-foreground mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-(--outline-strong) px-4 py-2.5 text-sm transition hover:border-(--outline)">
                Add to cart
                <ChevronDown className="h-4 w-4" />
              </button>
            </section>
          </aside>
        </div>
      </section>

      <section className="padding-inline mt-20">
        <div className="glass-panel mx-auto grid max-w-5xl overflow-hidden rounded-xl md:grid-cols-2">
          <div className="relative min-h-62">
            <Image
              src="/homepage/bookstore-cozy-chairs.jpg"
              alt="Join our Atelier Circle"
              fill
              className="object-cover"
            />
          </div>

          <div className="p-7 md:p-10">
            <h3 className="heading-font text-foreground text-4xl leading-tight">
              Join our Atelier Circle
            </h3>
            <p className="text-text-muted mt-4 text-sm leading-relaxed">
              Receive early access to seasonal collections, artisan stories, and
              exclusive gift-gifting guides directly from Tokyo.
            </p>
            <form className="mt-6 space-y-3" action="#">
              <input
                type="email"
                placeholder="Your email address"
                className="focus-amber bg-surface-1 text-foreground w-full rounded-md border border-(--outline-strong) px-4 py-3 text-sm placeholder:text-(--outline)"
              />
              <button
                type="submit"
                className="focus-amber meta-font bg-secondary w-full rounded-md px-5 py-3 text-sm font-semibold text-(--primary-ink) transition hover:brightness-95"
              >
                Subscribe to Joy
              </button>
            </form>
            <p className="mt-4 text-[11px] text-(--outline)">
              By joining, you agree to our privacy policy and terms of service.
            </p>
          </div>
        </div>
      </section>

      <section className="padding-inline mt-20">
        <h2 className="heading-font text-foreground text-center text-4xl">
          Cherished Moments
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.id} className="glass-panel rounded-xl p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-surface-3 text-primary-soft flex h-10 w-10 items-center justify-center rounded-full text-xs">
                  {item.name
                    .split(" ")
                    .map((entry) => entry[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="meta-font text-foreground text-sm">
                    {item.name}
                  </p>
                  <p className="text-xs text-(--outline)">{item.role}</p>
                </div>
              </div>
              <p className="text-text-muted text-sm leading-relaxed italic">
                &quot;{item.quote}&quot;
              </p>
              <p className="meta-font text-primary-soft mt-4 text-xs tracking-[0.18em]">
                *****
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
