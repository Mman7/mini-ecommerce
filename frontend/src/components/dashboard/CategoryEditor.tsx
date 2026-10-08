"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { categoryApi, type AdminCategoryDetail } from "../../api/category.api";
import { productApi, type Product } from "../../api/product.api";
import { DashboardPanel, PanelHeading, StatusPill } from "./index";
import { toast } from "@/components/ui/toast";
import { formatYen } from "@/src/lib/currency";

type CategoryEditorProps = { mode: "create" | "edit"; categoryId?: number };

export function CategoryEditor({ mode, categoryId }: CategoryEditorProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [category, setCategory] = useState<AdminCategoryDetail | null>(null);
  const [products, setProducts] = useState<AdminCategoryDetail["products"]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");
  const [assigning, setAssigning] = useState(false);
  const [removingProductId, setRemovingProductId] = useState<number | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !categoryId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    categoryApi.admin
      .get(categoryId)
      .then((result) => {
        if (cancelled) return;
        setCategory(result);
        setName(result.name);
        setActive(result.isActive);
        setProducts(result.products);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setNotice("Unable to load category.");
        setLoading(false);
      });

    productApi.admin
      .list({ page: 1, limit: 100, sortBy: "name", sortOrder: "asc" })
      .then((result) => {
        if (!cancelled) setCatalogProducts(result.items);
      })
      .catch(() => {
        if (!cancelled) {
          setNotice("Category loaded, but the product catalog is unavailable.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mode, categoryId]);

  const assignedProductIds = useMemo(
    () => new Set(products.map((product) => product.productId)),
    [products],
  );
  const availableProducts = useMemo(
    () =>
      catalogProducts.filter(
        (product) => !assignedProductIds.has(product.productId),
      ),
    [assignedProductIds, catalogProducts],
  );
  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query),
    );
  }, [productSearch, products]);

  async function refreshCategory() {
    if (!categoryId) return;
    const result = await categoryApi.admin.get(categoryId);
    setCategory(result);
    setProducts(result.products);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setNotice("Category name is required.");
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        await categoryApi.admin.create({ name: name.trim() });
        toast.add({
          title: "Category created",
          description: `${name.trim()} was added successfully.`,
          type: "success",
        });
        router.push("/dashboard/categories");
      } else if (categoryId) {
        await categoryApi.admin.update(categoryId, {
          name: name.trim(),
          isActive: active,
        });
        setCategory((current) =>
          current
            ? { ...current, name: name.trim(), isActive: active }
            : current,
        );
        toast.add({
          title: "Category updated",
          description: "Category changes were saved successfully.",
          type: "success",
        });
      }
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Unable to save category.";
      setNotice(description);
      toast.add({ title: "Category save failed", description, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function assignProduct() {
    const productId = Number(selectedProductId);
    if (!categoryId || !Number.isInteger(productId) || productId < 1) return;

    setAssigning(true);
    try {
      await categoryApi.admin.addProduct(categoryId, productId);
      await refreshCategory();
      setSelectedProductId("");
      toast.add({
        title: "Product assigned",
        description: "The product was added to this category.",
        type: "success",
      });
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Unable to assign product.";
      setNotice(description);
      toast.add({ title: "Assignment failed", description, type: "error" });
    } finally {
      setAssigning(false);
    }
  }

  async function removeProduct(productId: number) {
    if (!categoryId) return;
    setRemovingProductId(productId);
    try {
      await categoryApi.admin.removeProduct(categoryId, productId);
      await refreshCategory();
      toast.add({
        title: "Product removed",
        description: "The product was removed from this category.",
        type: "success",
      });
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Unable to remove product.";
      setNotice(description);
      toast.add({ title: "Removal failed", description, type: "error" });
    } finally {
      setRemovingProductId(null);
    }
  }

  async function remove() {
    if (
      !categoryId ||
      products.length > 0 ||
      !window.confirm("Delete this category? This action cannot be undone.")
    )
      return;
    setDeleting(true);
    try {
      await categoryApi.admin.delete(categoryId);
      toast.add({
        title: "Category deleted",
        description: "The category was removed successfully.",
        type: "success",
      });
      router.push("/dashboard/categories");
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Unable to delete category.";
      setNotice(description);
      toast.add({
        title: "Category deletion failed",
        description,
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <p className="text-text-muted py-8 text-sm">Loading category...</p>;
  }

  return (
    <form onSubmit={submit} className="w-full space-y-4">
      <header className="flex flex-col gap-4 border-b border-(--glass-border) pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard/categories"
            className="text-text-muted hover:text-primary-soft mb-3 inline-flex text-xs transition-colors"
          >
            Back to Categories
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading-font text-foreground text-2xl font-semibold">
              {mode === "create" ? "Create Category" : `Edit Category: ${name}`}
            </h1>
            {mode === "edit" && category && (
              <StatusPill status={active ? "Active" : "Inactive"} />
            )}
          </div>
          {category && (
            <p className="text-text-muted mt-2 text-xs">
              Category ID: {category.categoryId} · Created{" "}
              {new Date(category.createdAt).toLocaleDateString()} ·{" "}
              {products.length} products assigned
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/categories"
            className="text-text-muted rounded border border-(--glass-border) px-4 py-2 text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || (mode === "edit" && !category)}
            className="bg-primary text-primary-foreground rounded px-4 py-2 text-xs font-semibold disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create Category"
                : "Save Changes"}
          </button>
        </div>
      </header>
      {notice ? (
        <p role="alert" className="text-primary-soft mb-4 text-sm">
          {notice}
        </p>
      ) : null}
      <div
        className={
          mode === "edit"
            ? "grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
            : "grid gap-4"
        }
      >
        <div className="space-y-4">
          <DashboardPanel>
            <PanelHeading title="Category details" />
            <div className="space-y-5 p-4 sm:p-5">
              <label className="block text-sm">
                <span className="text-foreground mb-2 block font-medium">
                  Category name <span className="text-primary-soft">*</span>
                </span>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="form-input w-full"
                />
              </label>
              {mode === "edit" && (
                <label className="flex items-center justify-between gap-4 rounded border border-(--glass-border) p-4">
                  <span>
                    <span className="text-foreground block text-sm font-medium">
                      Active category
                    </span>
                    <span className="text-text-muted mt-1 block text-xs">
                      Active categories are available in the storefront.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(event) => setActive(event.target.checked)}
                    className="accent-primary size-4 shrink-0"
                  />
                </label>
              )}
            </div>
          </DashboardPanel>

          {mode === "edit" && (
            <DashboardPanel className="border-primary/25 border">
              <PanelHeading title="Danger zone" />
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Delete this category
                  </p>
                  <p className="text-text-muted mt-1 text-xs">
                    {products.length
                      ? "Remove all assigned products before deleting this category."
                      : "This action cannot be undone."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={remove}
                  disabled={products.length > 0 || deleting}
                  className="border-primary/50 text-primary-soft hover:bg-primary/10 inline-flex shrink-0 items-center justify-center gap-2 rounded border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 size={14} aria-hidden="true" />
                  {deleting ? "Deleting..." : "Delete Category"}
                </button>
              </div>
            </DashboardPanel>
          )}
        </div>

        {mode === "edit" && (
          <DashboardPanel className="min-w-0 overflow-hidden">
            <PanelHeading
              title="Products in category"
              action={
                <span className="text-primary-soft bg-primary/10 rounded px-2 py-1 text-xs">
                  {products.length} products
                </span>
              }
            />
            <div className="space-y-3 p-3 sm:p-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    aria-hidden="true"
                    size={14}
                    className="text-text-muted absolute top-1/2 left-3 -translate-y-1/2"
                  />
                  <input
                    aria-label="Filter category products"
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                    placeholder="Filter products by name or SKU..."
                    className="form-input w-full pl-9"
                  />
                </div>
                <div className="flex min-w-0 gap-2 sm:w-76">
                  <select
                    aria-label="Choose a product to assign"
                    value={selectedProductId}
                    onChange={(event) =>
                      setSelectedProductId(event.target.value)
                    }
                    className="form-input min-w-0 flex-1"
                    disabled={!availableProducts.length || assigning}
                  >
                    <option value="">
                      {availableProducts.length
                        ? "Choose a product..."
                        : "No products available"}
                    </option>
                    {availableProducts.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={assignProduct}
                    disabled={!selectedProductId || assigning}
                    aria-label="Assign selected product"
                    className="bg-primary text-primary-foreground inline-flex shrink-0 items-center gap-1.5 rounded px-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Plus size={14} aria-hidden="true" />
                    <span className="hidden sm:inline">
                      {assigning ? "Adding..." : "Assign"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-152 text-left text-xs">
                  <thead className="text-text-muted border-b border-(--glass-border) text-[10px] uppercase">
                    <tr>
                      <th className="px-3 py-3 font-medium">Product</th>
                      <th className="px-3 py-3 font-medium">SKU</th>
                      <th className="px-3 py-3 font-medium">Inventory</th>
                      <th className="px-3 py-3 text-right font-medium">
                        Price
                      </th>
                      <th className="px-3 py-3 text-right font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--glass-border)">
                    {filteredProducts.map((product) => (
                      <tr key={product.productId}>
                        <td className="px-3 py-3">
                          <Link
                            href={`/dashboard/products/${product.productId}`}
                            className="text-foreground hover:text-primary-soft font-medium transition-colors"
                          >
                            {product.name}
                          </Link>
                        </td>
                        <td className="text-text-muted px-3 py-3">
                          {product.sku || "—"}
                        </td>
                        <td className="px-3 py-3">
                          <span className="bg-surface-3 text-text-muted rounded px-2 py-1">
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="text-foreground px-3 py-3 text-right font-medium">
                          {formatYen(product.price)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            aria-label={`Remove ${product.name} from category`}
                            title="Remove from category"
                            disabled={removingProductId === product.productId}
                            onClick={() => removeProduct(product.productId)}
                            className="text-text-muted hover:bg-primary/10 hover:text-primary-soft inline-flex size-8 items-center justify-center rounded transition-colors disabled:opacity-50"
                          >
                            <X size={15} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <p className="text-text-muted px-3 py-8 text-center text-sm">
                    {products.length
                      ? "No products match this filter."
                      : "No products assigned to this category."}
                  </p>
                )}
              </div>
            </div>
          </DashboardPanel>
        )}
      </div>
    </form>
  );
}
