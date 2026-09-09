"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategory,
  updateAdminCategory,
} from "../../api/category.api";
import { DashboardPanel, PanelHeading, StatusPill } from "./index";
import { toast } from "@/components/ui/toast";

type CategoryEditorProps = { mode: "create" | "edit"; categoryId?: number };

export function CategoryEditor({ mode, categoryId }: CategoryEditorProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [products, setProducts] = useState<
    Array<{ productId: number; name: string; stock: number }>
  >([]);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (mode === "edit" && categoryId)
      getAdminCategory(categoryId)
        .then((category) => {
          setName(category.name);
          setActive(category.isActive);
          setProducts(category.products);
        })
        .catch(() => setNotice("Unable to load category."));
  }, [mode, categoryId]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setNotice("Category name is required.");
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        await createAdminCategory({ name: name.trim() });
        toast.add({
          title: "Category created",
          description: `${name.trim()} was added successfully.`,
          type: "success",
        });
        router.push("/dashboard/categories");
      } else if (categoryId) {
        await updateAdminCategory(categoryId, {
          name: name.trim(),
          isActive: active,
        });
        setNotice("Category changes saved.");
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
  async function remove() {
    if (
      !categoryId ||
      !window.confirm(
        "Delete this category? Categories with products cannot be deleted.",
      )
    )
      return;
    try {
      await deleteAdminCategory(categoryId);
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
    }
  }
  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl">
      <header className="mb-6 flex flex-col gap-4 border-b border-(--glass-border) pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard/categories"
            className="text-text-muted mb-3 inline-flex text-xs"
          >
            Back to Categories
          </Link>
          <h1 className="heading-font text-foreground text-2xl font-semibold">
            {mode === "create" ? "Create Category" : "Edit Category"}
          </h1>
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
            disabled={saving}
            className="bg-primary text-primary-foreground rounded px-4 py-2 text-xs disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Category"}
          </button>
        </div>
      </header>
      {notice ? (
        <p role="alert" className="text-secondary mb-4 text-sm">
          {notice}
        </p>
      ) : null}
      <DashboardPanel>
        <PanelHeading title="Category details" />
        <div className="space-y-4 p-5">
          <label className="block text-sm">
            <span className="text-foreground mb-2 block">Name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="form-input w-full"
            />
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
            />
            <span className="text-foreground">Active category</span>
          </label>
          {mode === "edit" ? (
            <>
              <StatusPill status={active ? "Active" : "Inactive"} />
              <div className="border-t border-(--glass-border) pt-4">
                <h2 className="text-foreground mb-3 text-sm">
                  Products in category
                </h2>
                {products.length ? (
                  <ul className="space-y-2">
                    {products.map((product) => (
                      <li
                        key={product.productId}
                        className="flex justify-between text-xs"
                      >
                        <span className="text-text-muted">{product.name}</span>
                        <span className="text-(--outline)">
                          Stock {product.stock}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-text-muted text-xs">
                    No products assigned.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={remove}
                className="border-secondary/50 text-secondary rounded border px-3 py-2 text-xs"
              >
                Delete Category
              </button>
            </>
          ) : null}
        </div>
      </DashboardPanel>
    </form>
  );
}
