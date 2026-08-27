"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyOrders, type Order } from "@/src/api/order.api";

const getImage = (order: Order) =>
  order.orderItems[0]?.product.productImages.find((image) => image.isThumbnail)
    ?.url || order.orderItems[0]?.product.productImages[0]?.url;

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrders()
      .then((response) => setOrders(response.orders))
      .catch((requestError) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load your orders.",
        ),
      );
  }, []);

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
      {error && <p className="text-error text-sm">{error}</p>}
      {!error && orders.length === 0 ? (
        <p className="text-text-muted text-sm">
          You have not placed any orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const firstItem = order.orderItems[0];
            const image = getImage(order);
            return (
              <article
                key={order.id}
                className="bg-surface-1 flex flex-col gap-5 rounded-lg border border-(--glass-border) p-5 sm:flex-row sm:items-center sm:p-6"
              >
                {image ? (
                  <div className="bg-surface-3 relative h-28 w-full shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-32">
                    <Image
                      src={image}
                      alt={firstItem?.product.name || "Order item"}
                      fill
                      sizes="(min-width: 640px) 128px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-surface-3 h-28 w-full shrink-0 rounded-md sm:h-24 sm:w-32" />
                )}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-primary/15 text-primary rounded-full px-2 py-1 text-xs font-semibold">
                      {order.status}
                    </span>
                    <span className="meta-font text-text-muted text-xs font-semibold">
                      Order #{order.id}
                    </span>
                  </div>
                  <h2 className="heading-font text-foreground text-xl font-medium sm:text-2xl">
                    {firstItem?.product.name || "Order"}
                    {order.orderItems.length > 1
                      ? ` + ${order.orderItems.length - 1} more`
                      : ""}
                  </h2>
                  <p className="text-text-muted text-base">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} ·
                    RM {Number(order.total).toFixed(2)}
                  </p>
                </div>
                <Link
                  href={`/profile/orders/${order.id}`}
                  className="meta-font bg-surface-3 hover:bg-primary hover:text-primary-ink flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-(--glass-border) px-6 py-3 text-sm font-semibold transition sm:w-auto"
                >
                  View Order
                  <ArrowRight size={15} />
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
