"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/src/components/reui/stepper";
import {
  CheckIcon,
  CreditCard,
  LoaderCircleIcon,
  Lock,
  MapPin,
  Truck,
  Wallet,
} from "lucide-react";

const checkoutSteps = [
  { title: "Shipping" },
  { title: "Payment" },
  { title: "Review" },
];

const productThumbnails = [
  {
    id: "thumb-1",
    src: "/homepage/pink-plush-bunny.jpg",
    alt: "Starry plush bunny preview",
  },
  {
    id: "thumb-2",
    src: "/homepage/acrylic-figurines-display.jpg",
    alt: "Golden figurine preview",
  },
];

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(2);

  return (
    <main className="pb-16">
      <section className="padding-inline relative mt-17 flex h-[410px] items-end overflow-hidden py-10 sm:h-[512px] sm:py-16">
        <Image
          src="/Shared/Atelier Interior.png"
          alt="Warm boutique interior"
          fill
          priority
          className="object-cover"
        />
        <div className="from-background/35 via-background/55 to-background absolute inset-0 bg-linear-to-b" />
        <div className="from-background/80 absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t to-transparent" />

        <div className="relative z-10 w-full max-w-4xl">
          <span className="meta-font bg-surface-3/70 text-primary-soft mb-4 inline-flex rounded-full border border-(--outline-strong) px-3 py-1 text-xs tracking-[0.16em] uppercase">
            Checkout Session
          </span>
          <h1 className="heading-font text-foreground text-4xl font-semibold sm:text-5xl">
            Review Your Order
          </h1>
        </div>
      </section>

      <section className="padding-inline mt-8">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:items-start">
          <div className="space-y-6">
            <Stepper
              value={currentStep}
              onValueChange={setCurrentStep}
              indicators={{
                completed: <CheckIcon className="size-3.5" />,
                loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
              }}
              className="w-full space-y-8"
            >
              <StepperNav className="max-w-lg gap-10">
                {checkoutSteps.map((step, index) => (
                  <StepperItem
                    key={step.title}
                    step={index + 1}
                    className="relative min-w-0 flex-1 items-start"
                  >
                    <StepperTrigger className="flex flex-col gap-2.5">
                      <StepperIndicator className="data-[state=completed]:bg-primary-soft data-[state=active]:bg-surface-2 data-[state=active]:text-primary-soft data-[state=completed]:text-primary-foreground size-8 border-2 data-[state=inactive]:border-(--outline-strong) data-[state=inactive]:bg-transparent data-[state=inactive]:text-(--outline)">
                        {index + 1}
                      </StepperIndicator>
                      <StepperTitle className="heading-font text-primary-soft text-base font-semibold group-data-[state=inactive]/step:text-(--outline)">
                        {step.title}
                      </StepperTitle>
                    </StepperTrigger>
                    {checkoutSteps.length > index + 1 ? (
                      <StepperSeparator className="group-data-[state=completed]/step:bg-primary-soft absolute top-3 right-[calc(50%+15rem)] left-[calc(50%+1.5rem)] m-0 w-9/10 group-data-[orientation=horizontal]/stepper-nav:flex-none" />
                    ) : null}
                  </StepperItem>
                ))}
              </StepperNav>

              <StepperPanel className="text-sm">
                <StepperContent value={1} className="space-y-6">
                  <section className="glass-panel relative overflow-hidden rounded-xl p-5 sm:p-6">
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="heading-font text-primary-soft flex items-center gap-2 text-2xl">
                          <Truck className="size-5" />
                          Shipping Details
                        </h2>
                        <p className="text-text-muted mt-1 text-sm">
                          Confirmed delivery location
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-tertiary text-sm hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="relative z-10 mt-6 grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="meta-font text-xs tracking-wider text-(--outline) uppercase">
                          Recipient
                        </p>
                        <p className="text-foreground">Minato Arisato</p>
                        <p className="text-text-muted text-sm">
                          minato.a@komorebi.com
                        </p>
                        <p className="text-text-muted text-sm">
                          +81 90-1234-5678
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="meta-font text-xs tracking-wider text-(--outline) uppercase">
                          Address
                        </p>
                        <p className="text-foreground">
                          2-1-1 Nihonbashi-Muromachi
                        </p>
                        <p className="text-foreground">
                          Chuo-ku, Tokyo 103-0022
                        </p>
                        <p className="text-foreground">Japan</p>
                      </div>
                    </div>
                  </section>
                </StepperContent>

                <StepperContent value={2} className="space-y-6">
                  <section>
                    <h2 className="heading-font text-foreground mb-4 text-3xl">
                      Payment Method
                    </h2>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        className="glass-panel focus-amber text-foreground flex items-center justify-center gap-2 rounded-lg border border-(--primary-soft)/35 px-4 py-3 text-sm transition hover:border-(--primary-soft)/80"
                      >
                        <Wallet size={16} className="text-primary-soft" />
                        Google Pay
                      </button>
                      <button
                        type="button"
                        className="glass-panel focus-amber text-foreground flex items-center justify-center gap-2 rounded-lg border border-(--glass-border) px-4 py-3 text-sm transition hover:border-(--outline)"
                      >
                        <Wallet size={16} className="text-text-muted" />
                        Apple Pay
                      </button>
                    </div>

                    <div className="my-5 flex items-center gap-4">
                      <div className="h-px flex-1 bg-(--outline-strong)/50" />
                      <span className="meta-font text-[11px] tracking-[0.2em] text-(--outline) uppercase">
                        Or pay with card
                      </span>
                      <div className="h-px flex-1 bg-(--outline-strong)/50" />
                    </div>

                    <form
                      className="glass-panel rounded-xl p-5 sm:p-6"
                      action="#"
                    >
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <span className="meta-font text-foreground text-sm">
                          Credit / Debit Card
                        </span>
                        <div className="flex items-center gap-2 text-xs text-(--outline)">
                          <span className="rounded border border-(--outline-strong) px-1.5 py-0.5">
                            VISA
                          </span>
                          <span className="rounded border border-(--outline-strong) px-1.5 py-0.5">
                            MC
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <label className="block">
                          <span className="meta-font text-text-muted mb-2 block text-xs">
                            Cardholder Name
                          </span>
                          <input
                            type="text"
                            placeholder="Hanae Mori"
                            className="focus-amber bg-surface-1 text-foreground w-full rounded-md border border-(--outline-strong)/70 px-3 py-3 text-sm placeholder:text-(--outline)"
                          />
                        </label>

                        <label className="block">
                          <span className="meta-font text-text-muted mb-2 block text-xs">
                            Card Number
                          </span>
                          <div className="relative">
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="0000 0000 0000 0000"
                              className="focus-amber bg-surface-1 text-foreground w-full rounded-md border border-(--outline-strong)/70 px-3 py-3 pr-11 text-sm placeholder:text-(--outline)"
                            />
                            <CreditCard
                              size={16}
                              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-(--outline)"
                            />
                          </div>
                        </label>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <label className="block">
                            <span className="meta-font text-text-muted mb-2 block text-xs">
                              Expiry Date
                            </span>
                            <input
                              type="text"
                              placeholder="MM / YY"
                              className="focus-amber bg-surface-1 text-foreground w-full rounded-md border border-(--outline-strong)/70 px-3 py-3 text-sm placeholder:text-(--outline)"
                            />
                          </label>
                          <label className="block">
                            <span className="meta-font text-text-muted mb-2 block text-xs">
                              CVC
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="123"
                              className="focus-amber bg-surface-1 text-foreground w-full rounded-md border border-(--outline-strong)/70 px-3 py-3 text-sm placeholder:text-(--outline)"
                            />
                          </label>
                        </div>

                        <label className="mt-1 flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="accent-primary-soft h-4 w-4 rounded border border-(--outline-strong) bg-transparent"
                          />
                          <span className="text-text-muted text-xs sm:text-sm">
                            Securely save card for future purchases
                          </span>
                        </label>
                      </div>
                    </form>
                  </section>

                  <section className="glass-panel flex items-center justify-between gap-4 rounded-xl px-4 py-4 sm:px-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-surface-3 text-primary-soft flex h-9 w-9 items-center justify-center rounded-full">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="meta-font text-foreground text-sm">
                          Billing Address
                        </p>
                        <p className="text-text-muted text-xs sm:text-sm">
                          Same as shipping address
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="meta-font text-primary-soft focus-amber rounded px-2 py-1 text-xs transition hover:underline sm:text-sm"
                    >
                      Edit
                    </button>
                  </section>
                </StepperContent>

                <StepperContent value={3} className="space-y-6">
                  <section className="glass-panel rounded-xl p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="heading-font text-primary-soft flex items-center gap-2 text-2xl">
                          <Truck className="size-5" />
                          Shipping Details
                        </h2>
                        <p className="text-text-muted mt-1 text-sm">
                          Minato Arisato · Tokyo, Japan
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-tertiary text-sm hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </section>

                  <section className="glass-panel rounded-xl p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="heading-font text-primary-soft flex items-center gap-2 text-2xl">
                          <CreditCard className="size-5" />
                          Payment Method
                        </h2>
                        <p className="text-text-muted mt-1 text-sm">
                          Visa ending in •••• 4242 · Expires 12/26
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-tertiary text-sm hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h2 className="heading-font text-foreground px-1 text-2xl">
                      Artisanal Selections
                    </h2>
                    {productThumbnails.map((thumb, index) => (
                      <article
                        key={thumb.id}
                        className="glass-panel flex items-center gap-4 rounded-xl p-4"
                      >
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-(--glass-border)">
                          <Image
                            src={thumb.src}
                            alt={thumb.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="heading-font text-foreground text-lg">
                            {index === 0
                              ? "Starry Hope Bunny"
                              : "Golden Path Maneki"}
                          </h3>
                          <p className="text-text-muted text-sm">
                            {index === 0
                              ? "Limited Edition Curation"
                              : "Kyoto Hand-Painted"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="title-font text-primary-soft text-lg font-semibold">
                            {index === 0 ? "¥4,800" : "¥12,500"}
                          </p>
                          <p className="text-xs text-(--outline)">Qty: 1</p>
                        </div>
                      </article>
                    ))}
                  </section>
                </StepperContent>
              </StepperPanel>
            </Stepper>
          </div>

          <aside className="lg:sticky lg:top-24">
            <section className="glass-panel rounded-xl p-5 sm:p-6">
              <div className="flex items-center gap-3 border-b border-(--outline-strong)/55 pb-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-md border border-(--glass-border)">
                  <Image
                    src="/homepage/pink-plush-bunny.jpg"
                    alt="Selection preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="heading-font text-primary-soft text-xl">
                    Your Selection
                  </h3>
                  <p className="text-text-muted text-xs">3 items in cart</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="text-text-muted flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span>¥17,800</span>
                </div>
                <div className="text-text-muted flex items-center justify-between text-sm">
                  <span>Shipping (Atelier Standard)</span>
                  <span>¥500</span>
                </div>
                <div className="text-text-muted flex items-center justify-between text-sm">
                  <span>Gift Wrap</span>
                  <span className="text-primary-soft">Free</span>
                </div>

                <div className="my-2 border-t border-(--outline-strong)/45" />

                <div className="flex items-end justify-between gap-3">
                  <span className="heading-font text-foreground text-2xl">
                    Total
                  </span>
                  <span className="title-font text-primary-soft text-4xl leading-none">
                    ¥18,300
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  className="focus-amber meta-font bg-primary-soft hover:bg-primary text-primary-foreground w-full rounded-lg px-4 py-3 text-sm font-semibold transition"
                >
                  Review Order
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-(--outline)">
                  <Lock size={12} />
                  SSL Encrypted Secure Payment
                </div>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
