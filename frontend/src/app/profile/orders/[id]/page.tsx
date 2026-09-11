"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Home,
  RotateCcw,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cancelOrder, getOrder, type Order } from "@/src/api/order.api";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/src/components/reui/stepper";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    params
      .then(({ id }) => getOrder(id))
      .then((response) => setOrder(response.order))
      .catch((requestError) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load this order.",
        ),
      );
  }, [params]);

  const handleCancel = async () => {
    if (!order) return;
    try {
      setOrder((await cancelOrder(order.id)).order);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to cancel this order.",
      );
    }
  };
  const steps = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStep = order ? steps.indexOf(order.status) : -1;

  if (error)
    return (
      <div className="space-y-6">
        <Link
          href="/profile/orders"
          className="meta-font text-text-muted inline-flex items-center gap-2 text-xs"
        >
          <ArrowLeft size={14} />
          Back to My Orders
        </Link>
        <p className="text-error text-sm">{error}</p>
      </div>
    );
  if (!order)
    return <p className="text-text-muted text-sm">Loading order...</p>;

  return (
    <div className="space-y-8">
      <Link
        href="/profile/orders"
        className="meta-font text-text-muted inline-flex items-center gap-2 text-xs"
      >
        <ArrowLeft size={14} />
        Back to My Orders
      </Link>
      <header>
        <h1 className="heading-font text-foreground text-2xl font-semibold sm:text-3xl">
          Order #{order.id}
        </h1>
        <p className="text-text-muted mt-1 text-sm">
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <span className="bg-primary/15 text-primary mt-4 inline-flex rounded-full px-4 py-2 text-xs font-semibold">
          {order.status}
        </span>
      </header>
      <section className="bg-surface-1 rounded-lg border border-(--glass-border) p-5 sm:p-7">
        <h2 className="heading-font mb-8 text-xl font-medium">Order Status</h2>
        {order.status === "CANCELLED" ? (
          <div className="text-error flex items-center gap-3 text-sm font-semibold">
            <RotateCcw size={18} />
            This order was cancelled.
          </div>
        ) : (
          <Stepper
            value={Math.max(currentStep + 1, 1)}
            onValueChange={() => undefined}
            className="w-full"
          >
            <StepperNav className="w-full gap-0">
              {steps.map((step, index) => (
                <StepperItem
                  key={step}
                  step={index + 1}
                  completed={index < currentStep}
                  className="relative min-w-0 flex-1 items-start"
                >
                  <StepperTrigger className="pointer-events-none flex min-h-11 flex-col gap-2.5">
                    <StepperIndicator className="data-[state=completed]:bg-primary data-[state=active]:bg-primary data-[state=inactive]:bg-surface-4 size-8 border-2 border-(--glass-border) text-xs">
                      {index === 0 ? (
                        <Check size={14} />
                      ) : index === 1 ? (
                        <CreditCard size={14} />
                      ) : index === 3 ? (
                        <Truck size={14} />
                      ) : index === 4 ? (
                        <Home size={14} />
                      ) : (
                        <RotateCcw size={14} />
                      )}
                    </StepperIndicator>
                    <StepperTitle className="text-center text-[10px] font-semibold uppercase sm:text-xs">
                      {step}
                    </StepperTitle>
                  </StepperTrigger>
                  {index < steps.length - 1 && (
                    <StepperSeparator className="group-data-[state=completed]/step:bg-primary absolute top-4 right-[calc(-50%+1rem)] left-[calc(50%+1rem)] z-0 m-0 h-0.5" />
                  )}
                </StepperItem>
              ))}
            </StepperNav>
          </Stepper>
        )}
      </section>
      <section>
        <h2 className="heading-font mb-4 text-xl font-medium">
          Items in Your Order
        </h2>
        <div className="space-y-3">
          {order.orderItems.map((item) => {
            const image =
              item.product.productImages.find((entry) => entry.isThumbnail)
                ?.url || item.product.productImages[0]?.url;
            return (
              <article
                key={item.id}
                className="bg-surface-1 flex items-center gap-4 rounded-lg border border-(--glass-border) p-4"
              >
                {image ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={image}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-surface-3 h-20 w-20 shrink-0 rounded-md" />
                )}
                <div className="flex-1">
                  <h3 className="meta-font text-sm font-semibold">
                    {item.product.name}
                  </h3>
                  <p className="text-text-muted mt-1 text-xs">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="meta-font text-sm font-semibold">
                  RM {(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="bg-surface-3 flex items-center justify-between rounded-lg p-6">
        <span className="heading-font text-lg">Total</span>
        <span className="heading-font text-primary text-2xl font-semibold">
          RM {Number(order.total).toFixed(2)}
        </span>
      </section>
      {(order.status === "PENDING" || order.status === "PROCESSING") && (
        <button
          type="button"
          onClick={handleCancel}
          className="meta-font border-error/30 hover:bg-accent text-error hover:bg-error/10 rounded-md border px-5 py-3 text-xs font-semibold hover:cursor-pointer"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
}
