"use client";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  CloudUpload,
  Image as ImageIcon,
  Save,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { DashboardShell } from "./DashboardShell";

type CategoryEditorProps = {
  mode: "create" | "edit";
};

type CategoryProduct = {
  name: string;
  image: string;
  status: "Active" | "Draft";
  price: string;
  id: string;
};

const categoryProducts: CategoryProduct[] = [
  {
    id: "tsuki-bear-plush",
    name: "Tsuki Bear Plush",
    image: "/homepage/pink-plush-bunny.jpg",
    status: "Active",
    price: "RM 45.00",
  },
  {
    id: "hoshi-rabbit-plush",
    name: "Hoshi Rabbit Plush",
    image: "/homepage/plush-toy-lineup.jpg",
    status: "Active",
    price: "RM 38.00",
  },
  {
    id: "kumo-cloud-cushion",
    name: "Kumo Cloud Cushion",
    image: "/homepage/cozy-reading-lamp-desk.jpg",
    status: "Draft",
    price: "RM 55.00",
  },
];

export function CategoryEditor({ mode }: CategoryEditorProps) {
  const isEdit = mode === "edit";
  const [name, setName] = useState(isEdit ? "Plushies" : "");
  const [slug, setSlug] = useState(isEdit ? "plushies" : "");
  const [description, setDescription] = useState(
    isEdit
      ? "Curated collection of ultra-soft, premium Japanese plushies designed for warmth and comfort. Perfect for gifting or personal collection."
      : "",
  );
  const [active, setActive] = useState(true);
  const [cover, setCover] = useState<string | null>(
    isEdit ? "/homepage/plush-toy-lineup.jpg" : null,
  );
  const [notice, setNotice] = useState("");

  function handleNameChange(value: string) {
    setName(value);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      );
    }
  }

  function handleCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setCover(URL.createObjectURL(file));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(
      isEdit
        ? "Category changes saved successfully."
        : "Category created successfully.",
    );
  }

  function deleteCategory() {
    if (window.confirm("Delete this category permanently?")) {
      setNotice("Category deletion requested.");
    }
  }

  return (
    <DashboardShell activeSection="categories">
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-(--glass-border) pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/dashboard/categories"
              className="meta-font text-text-muted hover:text-primary-soft mb-3 inline-flex items-center gap-1.5 text-xs transition"
            >
              <ArrowLeft size={14} /> Back to Categories
            </Link>
            <h1 className="heading-font text-foreground text-2xl font-semibold sm:text-3xl">
              {isEdit ? "Edit Category" : "Create Category"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard/categories"
              className="meta-font text-text-muted hover:text-foreground flex h-9 items-center rounded-md border border-(--glass-border) px-4 text-xs transition hover:bg-(--glass-bg)"
            >
              {isEdit ? "Discard Changes" : "Cancel"}
            </Link>
            <button
              type="submit"
              className="meta-font bg-primary hover:bg-primary-soft flex h-9 items-center gap-2 rounded-md px-5 text-xs font-semibold text-(--primary-ink) shadow-(--glow) transition"
            >
              <Save size={13} /> {isEdit ? "Save Category" : "Create Category"}
            </button>
          </div>
        </header>

        {notice ? (
          <div className="meta-font border-tertiary/30 bg-tertiary/10 text-tertiary mb-5 flex items-center gap-2 rounded-md border px-4 py-3 text-xs">
            <CheckCircle2 size={14} /> {notice}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="space-y-6">
            <section className="glass-panel rounded-lg p-5 sm:p-6">
              <SectionTitle title="Category Information" />
              <div className="space-y-5">
                <Field label={isEdit ? "Category Name" : "Name"}>
                  <input
                    required
                    value={name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    placeholder="e.g. Traditional Ceramics"
                    className="form-input"
                  />
                </Field>
                <Field label="Slug">
                  <div className="flex min-w-0">
                    {isEdit ? (
                      <span className="meta-font bg-surface-1 text-text-muted flex shrink-0 items-center rounded-l-md border border-r-0 border-(--glass-border) px-3 text-xs">
                        komorebi.com/category/
                      </span>
                    ) : null}
                    <input
                      required
                      value={slug}
                      onChange={(event) => setSlug(event.target.value)}
                      placeholder="traditional-ceramics"
                      className={`form-input ${isEdit ? "rounded-l-none" : ""}`}
                    />
                  </div>
                  {!isEdit ? (
                    <p className="meta-font text-text-muted mt-1 text-[11px]">
                      Auto-generated from name if left blank.
                    </p>
                  ) : null}
                </Field>
                <Field label="Description">
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={isEdit ? 5 : 4}
                    placeholder="Describe the atmosphere and types of items in this category..."
                    className="form-input resize-y"
                  />
                  <p className="meta-font text-text-muted mt-1 text-[11px]">
                    Brief description for search engines and category index.
                  </p>
                </Field>
              </div>
            </section>

            <section className="glass-panel rounded-lg p-5 sm:p-6">
              <SectionTitle
                title={isEdit ? "Category Cover" : "Category Image"}
              />
              <label className="group bg-surface-2/60 hover:border-primary hover:bg-surface-3 relative flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-(--outline) p-8 text-center transition">
                {cover ? (
                  <Image
                    src={cover}
                    alt="Category cover preview"
                    fill
                    className="object-cover opacity-45"
                    unoptimized
                  />
                ) : null}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="bg-surface-1/90 text-primary mb-4 flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-sm transition group-hover:scale-105">
                    <CloudUpload size={26} />
                  </span>
                  <span className="text-foreground text-sm">
                    {isEdit
                      ? "Click to replace or drag and drop"
                      : "Click to upload or drag and drop"}
                  </span>
                  <span className="meta-font text-text-muted mt-1 max-w-xs text-[11px]">
                    {isEdit
                      ? "SVG, PNG, JPG or GIF (MAX. 800x400px)"
                      : "High-resolution atmospheric image. PNG, JPG up to 5MB."}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleCover}
                  className="sr-only"
                />
              </label>
            </section>

            {isEdit ? <ProductsInCategory /> : null}
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="glass-panel rounded-lg p-5 sm:p-6">
              <SectionTitle title={isEdit ? "Visibility Status" : "Status"} />
              <button
                type="button"
                onClick={() => setActive((current) => !current)}
                className={`flex w-full items-center justify-between gap-3 rounded-md border p-3 text-left transition ${active ? "border-primary/50 bg-primary/5" : "bg-surface-3 border-(--glass-border)"}`}
              >
                <span>
                  <span className="text-foreground block text-sm">
                    {active ? (isEdit ? "Published" : "Active") : "Hidden"}
                  </span>
                  <span className="meta-font text-text-muted block text-[11px]">
                    {active
                      ? "Visible in store navigation"
                      : "Hidden from new selections"}
                  </span>
                </span>
                <span
                  className={`relative h-5 w-10 rounded-full transition ${active ? "bg-primary" : "bg-surface-4"}`}
                >
                  <span
                    className={`bg-foreground absolute top-0.5 h-4 w-4 rounded-full transition ${active ? "left-5" : "left-0.5"}`}
                  />
                </span>
              </button>
            </section>

            <section className="glass-panel rounded-lg p-5 sm:p-6">
              <SectionTitle title="Card Preview" />
              <div className="bg-surface-3 overflow-hidden rounded-md border border-(--glass-border)">
                <div className="bg-surface-2 relative flex aspect-[1.8] items-center justify-center overflow-hidden">
                  {cover ? (
                    <Image
                      src={cover}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <ImageIcon className="text-text-muted/40" size={36} />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="heading-font text-foreground text-lg">
                    {name || "Category Name"}
                  </h2>
                  <p className="text-text-muted mt-1 line-clamp-2 text-sm">
                    {description || "Description will appear here..."}
                  </p>
                </div>
              </div>
            </section>

            {isEdit ? (
              <section className="rounded-lg border border-[#ffb4ab]/20 bg-[#2b1b1c]/50 p-5 sm:p-6">
                <h2 className="heading-font mb-2 text-xl font-medium text-[#ffb4ab]">
                  Danger Zone
                </h2>
                <p className="text-text-muted mb-4 text-sm">
                  Once you delete a category, there is no going back. Please be
                  certain.
                </p>
                <button
                  type="button"
                  onClick={deleteCategory}
                  className="meta-font flex w-full items-center justify-center gap-2 rounded-md border border-[#ffb4ab]/50 py-2 text-xs text-[#ffb4ab] transition hover:bg-[#ffb4ab]/10"
                >
                  <Trash2 size={14} /> Delete Category
                </button>
              </section>
            ) : null}
          </aside>
        </div>
      </form>
    </DashboardShell>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="heading-font text-foreground mb-5 text-xl font-medium">
      {title}
    </h2>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="meta-font text-text-muted block text-xs">{label}</span>
      {children}
    </label>
  );
}
function ProductsInCategory() {
  return (
    <section className="glass-panel rounded-lg p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="heading-font text-foreground text-xl font-medium">
          Products in Category{" "}
          <span className="meta-font bg-surface-3 text-text-muted ml-1 rounded-full px-2 py-1 text-[10px]">
            24
          </span>
        </h2>
        <Link
          href="/dashboard/products"
          className="meta-font text-primary-soft hover:text-primary text-xs underline"
        >
          Manage Products
        </Link>
      </div>
      <div className="overflow-hidden rounded-md border border-(--glass-border)">
        <table className="w-full min-w-150 text-left">
          <thead className="meta-font bg-surface-3 text-text-muted text-[10px] tracking-wider uppercase">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="py-2">Status</th>
              <th className="py-2">Price</th>
              <th className="py-2 pr-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {categoryProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t border-(--glass-border) hover:bg-(--glass-bg)"
              >
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src={product.image}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded object-cover"
                    />
                    <span className="text-foreground text-xs">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="py-2">
                  <span
                    className={`meta-font rounded-full px-2 py-1 text-[10px] ${product.status === "Active" ? "bg-tertiary/15 text-tertiary" : "text-text-muted bg-(--glass-bg)"}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="meta-font text-text-muted py-2 text-xs">
                  {product.price}
                </td>
                <td className="py-2 pr-3 text-right">
                  <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="text-text-muted hover:text-primary-soft"
                    aria-label={`Edit ${product.name}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link
          href="/dashboard/products"
          className="meta-font bg-surface-3 text-text-muted hover:text-primary-soft block border-t border-(--glass-border) p-2 text-center text-[11px]"
        >
          View All 24 Products
        </Link>
      </div>
    </section>
  );
}
