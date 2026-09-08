"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminCategory } from "../../../../api/category.api";
import {
  DashboardHeading,
  DashboardPanel,
  PanelHeading,
  StatusPill,
} from "../../../../components/dashboard";

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Awaited<
    ReturnType<typeof getAdminCategory>
  > | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getAdminCategory(Number(id))
      .then(setCategory)
      .catch(() => setError("Unable to load this category."));
  }, [id]);
  return (
    <>
      {category ? (
        <>
          <DashboardHeading
            eyebrow="Product organization"
            title={category.name}
            description="Products assigned to this category."
            action={
              <Link
                href={`/dashboard/categories/${category.categoryId}/edit`}
                className="meta-font bg-primary text-primary-foreground rounded px-3 py-2 text-xs"
              >
                Edit Category
              </Link>
            }
          />
          <DashboardPanel>
            <PanelHeading title={`Products (${category.products.length})`} />
            {category.products.length ? (
              <div className="divide-y divide-(--glass-border)">
                {category.products.map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <p className="text-foreground text-sm">{product.name}</p>
                      <p className="text-text-muted text-xs">
                        Stock: {product.stock}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/products/${product.productId}`}
                      className="text-primary-soft text-xs"
                    >
                      View Product
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted p-5 text-sm">
                No products are assigned to this category.
              </p>
            )}
          </DashboardPanel>
          <div className="mt-3">
            <StatusPill status={category.isActive ? "Active" : "Inactive"} />
          </div>
        </>
      ) : (
        <p role="alert" className="text-secondary">
          {error || "Loading category..."}
        </p>
      )}
    </>
  );
}
