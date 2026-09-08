"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminProduct, type Product } from "../../../../api/product.api";
import {
  DashboardHeading,
  DashboardPanel,
  PanelHeading,
  StatusPill,
} from "../../../../components/dashboard";

const money = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
});

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getAdminProduct(Number(id))
      .then(setProduct)
      .catch(() => setError("Unable to load this product."));
  }, [id]);
  return (
    <>
      {product ? (
        <>
          <DashboardHeading
            eyebrow="Product catalog"
            title={product.name}
            description="Product details and inventory."
            action={
              <Link
                href={`/dashboard/products/${product.productId}/edit`}
                className="meta-font bg-primary text-primary-foreground rounded px-3 py-2 text-xs"
              >
                Edit Product
              </Link>
            }
          />
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
            <DashboardPanel>
              <PanelHeading title="Product Images" />
              <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
                {product.productImages.map((image) => (
                  <div
                    key={image.id ?? image.url}
                    className="bg-surface-2 relative aspect-square overflow-hidden rounded"
                  >
                    {" "}
                    <Image
                      src={image.url}
                      alt={image.altText ?? product.name}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </DashboardPanel>
            <DashboardPanel>
              <PanelHeading title="Overview" />
              <dl className="space-y-3 px-4 pb-4 text-sm">
                <div>
                  <dt className="text-text-muted">Price</dt>
                  <dd className="text-foreground">
                    {money.format(product.price)}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-muted">Stock</dt>
                  <dd className="text-foreground">{product.stock}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Category</dt>
                  <dd className="text-foreground">
                    {product.category?.name ?? "Uncategorized"}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-muted">Status</dt>
                  <dd>
                    <StatusPill
                      status={product.isActive ? "Active" : "Inactive"}
                    />
                  </dd>
                </div>
              </dl>
            </DashboardPanel>
          </div>
          <DashboardPanel className="mt-3">
            <PanelHeading title="Description" />
            <p className="text-text-muted p-4 text-sm whitespace-pre-wrap">
              {product.description}
            </p>
          </DashboardPanel>
        </>
      ) : (
        <p role="alert" className="text-secondary">
          {error || "Loading product..."}
        </p>
      )}
    </>
  );
}
