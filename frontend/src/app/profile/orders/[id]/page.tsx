"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Home, RotateCcw, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { cancelOrder, getOrder, type Order } from "@/src/api/order.api";

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
  const steps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
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
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`text-center text-xs ${index <= currentStep ? "text-primary" : "text-text-muted"}`}
            >
              <div className="bg-surface-4 mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full">
                {index === 0 ? (
                  <Check size={14} />
                ) : index === 2 ? (
                  <Truck size={14} />
                ) : index === 3 ? (
                  <Home size={14} />
                ) : (
                  <RotateCcw size={14} />
                )}
              </div>
              {step}
            </div>
          ))}
        </div>
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
          className="meta-font border-error/30 text-error hover:bg-error/10 rounded-md border px-5 py-3 text-xs font-semibold"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
}
