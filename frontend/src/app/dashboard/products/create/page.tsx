"use client";

import {
  ChevronDown,
  CloudUpload,
  Image as ImageIcon,
  Save,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ChangeEvent, DragEvent, FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { DashboardShell } from "../../../../components/dashboard";

type ProductStatus = "Draft" | "Active" | "Archived";

export default function CreateProductPage() {
  const [productName, setProductName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [stock, setStock] = useState("");
  const [threshold, setThreshold] = useState("5");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<ProductStatus>("Draft");
  const [visible, setVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function generateSlug() {
    setSlug(
      productName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    );
  }

  function setImage(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    setImagePreview((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setImage(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setImage(event.dataTransfer.files?.[0]);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    nextStatus = status,
  ) {
    event.preventDefault();
    setStatus(nextStatus);
    setMessage(
      nextStatus === "Draft"
        ? "Product saved as draft."
        : "Product ready to publish.",
    );
  }

  return (
    <DashboardShell activeSection="products">
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="mb-6 flex flex-col gap-4 border-b border-(--glass-border) pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="meta-font text-text-muted mb-2 flex items-center gap-2 text-xs">
              <Link
                href="/dashboard/products"
                className="hover:text-primary-soft transition"
              >
                Products
              </Link>
              <span>/</span>
              <span className="text-foreground">Create Product</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
              <h1 className="heading-font text-foreground text-2xl font-semibold sm:text-3xl">
                Create Product
              </h1>
              <p className="text-text-muted text-sm">
                Add a new treasure to your collection.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/products"
              className="meta-font text-text-muted hover:text-foreground flex h-9 items-center rounded-md border border-(--glass-border) px-4 text-xs transition hover:bg-(--glass-bg)"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => {
                setStatus("Draft");
                setMessage("Product saved as draft.");
              }}
              className="meta-font border-primary/40 text-primary-soft hover:bg-primary/10 flex h-9 items-center gap-2 rounded-md border px-4 text-xs transition"
            >
              <Save size={13} /> Save as Draft
            </button>
            <button
              type="submit"
              className="meta-font bg-primary hover:bg-primary-soft flex h-9 items-center rounded-md px-5 text-xs font-semibold text-(--primary-ink) shadow-(--glow) transition"
            >
              Create Product
            </button>
          </div>
        </div>

        {message ? (
          <div className="meta-font border-tertiary/30 bg-tertiary/10 text-tertiary mb-5 rounded-md border px-4 py-3 text-xs">
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <section className="glass-panel rounded-lg p-5 sm:p-6">
              <SectionTitle title="Basic Information" />
              <div className="space-y-4">
                <Field label="Product Name">
                  <input
                    required
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    placeholder="e.g. Midnight Sakurajima Plush"
                    className="form-input"
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Slug">
                    <div className="flex gap-2">
                      <input
                        value={slug}
                        onChange={(event) => setSlug(event.target.value)}
                        placeholder="midnight-sakurajima-plush"
                        className="form-input min-w-0 flex-1"
                      />
                      <button
                        type="button"
                        onClick={generateSlug}
                        className="meta-font bg-surface-4 text-foreground hover:bg-surface-3 shrink-0 rounded-md px-3 text-xs transition"
                      >
                        Generate
                      </button>
                    </div>
                  </Field>
                  <Field label="SKU">
                    <input
                      value={sku}
                      onChange={(event) => setSku(event.target.value)}
                      placeholder="PLSH-MDNT-001"
                      className="form-input"
                    />
                  </Field>
                </div>
              </div>
            </section>

            <section className="glass-panel rounded-lg p-5 sm:p-6">
              <SectionTitle title="Description" />
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Write an enchanting editorial description..."
                rows={6}
                className="form-input resize-y"
              />
              <p className="meta-font text-text-muted mt-2 text-right text-[11px]">
                Markdown supported
              </p>
            </section>

            <section className="glass-panel rounded-lg p-5 sm:p-6">
              <SectionTitle title="Product Images" />
              <label
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                className="group bg-surface-2/70 hover:border-primary hover:bg-surface-3 relative flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-(--outline) p-8 text-center transition"
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    className="object-cover opacity-55"
                    unoptimized
                  />
                ) : null}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="bg-surface-1/90 text-primary mb-4 flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-sm transition group-hover:scale-105">
                    <CloudUpload size={26} />
                  </span>
                  <span className="text-foreground text-sm">
                    Upload Product Images
                  </span>
                  <span className="meta-font text-text-muted mt-1 text-[11px]">
                    Drag &amp; drop or browse files (PNG, JPG, WEBP)
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="glass-panel rounded-lg p-5 sm:p-6">
                <SectionTitle title="Pricing" />
                <div className="space-y-4">
                  <CurrencyField
                    label="Price (RM)"
                    value={price}
                    onChange={setPrice}
                  />
                  <CurrencyField
                    label="Compare-at Price (RM)"
                    value={compareAtPrice}
                    onChange={setCompareAtPrice}
                  />
                </div>
              </section>
              <section className="glass-panel rounded-lg p-5 sm:p-6">
                <SectionTitle title="Inventory" />
                <div className="space-y-4">
                  <Field label="Stock Quantity">
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(event) => setStock(event.target.value)}
                      placeholder="0"
                      className="form-input"
                    />
                  </Field>
                  <Field label="Low Stock Threshold">
                    <input
                      type="number"
                      min="0"
                      value={threshold}
                      onChange={(event) => setThreshold(event.target.value)}
                      placeholder="5"
                      className="form-input"
                    />
                  </Field>
                </div>
              </section>
            </div>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="bg-surface-3 rounded-lg border border-(--glass-border) p-5">
              <AsideTitle title="Status" />
              <div className="bg-surface-1 flex gap-1 rounded-md border border-(--glass-border) p-1">
                {(["Draft", "Active", "Archived"] as ProductStatus[]).map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStatus(item)}
                      className={`meta-font flex-1 rounded px-2 py-2 text-[11px] transition ${status === item ? "bg-surface-4 text-foreground shadow-sm" : "text-text-muted hover:text-foreground"}`}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </section>

            <section className="bg-surface-3 rounded-lg border border-(--glass-border) p-5">
              <AsideTitle title="Category" />
              <div className="relative">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="form-input appearance-none pr-10"
                >
                  <option value="">Select category...</option>
                  <option>Plushies</option>
                  <option>Collectibles</option>
                  <option>Accessories</option>
                  <option>Stationery</option>
                  <option>Home Decor</option>
                </select>
                <ChevronDown
                  className="text-text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
                  size={15}
                />
              </div>
            </section>

            <section className="bg-surface-3 rounded-lg border border-(--glass-border) p-5">
              <AsideTitle title="Visibility" />
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-foreground text-sm">
                  Visible in Store
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={visible}
                  onClick={() => setVisible((current) => !current)}
                  className={`relative h-6 w-11 rounded-full transition ${visible ? "bg-primary" : "bg-surface-4"}`}
                >
                  <span
                    className={`bg-foreground absolute top-1 h-4 w-4 rounded-full transition ${visible ? "left-6" : "left-1"}`}
                  />
                </button>
              </label>
            </section>

            <section className="bg-surface-3 rounded-lg border border-(--glass-border) p-5">
              <AsideTitle title="Product Preview" />
              <div className="bg-surface-1 overflow-hidden rounded-lg border border-(--glass-border)">
                <div className="bg-surface-2 relative flex aspect-square items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <ImageIcon className="text-text-muted/40" size={48} />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-foreground truncate text-sm">
                    {productName || "Product Name"}
                  </p>
                  <p className="meta-font text-primary mt-1 text-sm">
                    RM {price || "0.00"}
                  </p>
                </div>
              </div>
            </section>
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

function AsideTitle({ title }: { title: string }) {
  return (
    <h2 className="meta-font text-foreground mb-4 text-xs font-medium tracking-[0.12em] uppercase">
      {title}
    </h2>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="meta-font text-text-muted block text-xs">{label}</span>
      {children}
    </label>
  );
}

function CurrencyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="relative">
        <span className="meta-font text-text-muted absolute top-1/2 left-3 -translate-y-1/2 text-xs">
          RM
        </span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0.00"
          className="form-input pl-10"
        />
      </div>
    </Field>
  );
}
