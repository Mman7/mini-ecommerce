"use client";

import {
  Bold,
  CheckCircle2,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Save,
  Star,
  Trash2,
  Underline,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteAdminProduct,
  getAdminProduct,
  updateAdminProductInventory,
  updateAdminProduct,
} from "../../../../../api/product.api";
import { getCategories } from "../../../../../api/category.api";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

type ProductImage = { id: string; src: string; primary?: boolean };
type ProductFormSnapshot = {
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  threshold: string;
  category: string;
  visible: boolean;
  images: ProductImage[];
};

const initialImages: ProductImage[] = [
  {
    id: "hero",
    src: "/homepage/white-plush-rabbit-on-shelf.png",
    primary: true,
  },
  { id: "detail", src: "/homepage/plush-toys-on-wooden-shelf.png" },
  { id: "lifestyle", src: "/homepage/komorebi-gift-atelier-wrapped-boxes.png" },
];

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState("Sakura Fox Plush");
  const [slug, setSlug] = useState("sakura-fox-plush");
  const [sku, setSku] = useState("PLUSH-SAK-001");
  const [description, setDescription] = useState(
    "A soft and adorable bunny plush inspired by Japanese kawaii gift culture. Made with premium minky fabric and filled with hypoallergenic stuffing. Features delicate embroidered sakura blossoms on the ears and tail. Perfect as a comforting companion or a collector's display piece.",
  );
  const [price, setPrice] = useState("48.00");
  const [compareAtPrice, setCompareAtPrice] = useState("55.00");
  const [stock, setStock] = useState("12");
  const [threshold, setThreshold] = useState("3");
  const [category, setCategory] = useState("Plushies");
  const [categories, setCategories] = useState<
    Array<{ categoryId: number; name: string }>
  >([]);
  const [visible, setVisible] = useState(true);
  const [images, setImages] = useState(initialImages);
  const [initialForm, setInitialForm] = useState<ProductFormSnapshot | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const currentForm: ProductFormSnapshot = {
    name,
    slug,
    sku,
    description,
    price,
    compareAtPrice,
    stock,
    threshold,
    category,
    visible,
    images,
  };
  const hasChanges =
    initialForm !== null &&
    JSON.stringify(currentForm) !== JSON.stringify(initialForm);

  useEffect(() => {
    Promise.all([getAdminProduct(Number(id)), getCategories()])
      .then(([product, categoryList]) => {
        setName(product.name);
        setSlug(product.slug ?? "");
        setSku(product.sku ?? "");
        setDescription(product.description);
        setPrice(String(product.price));
        setVisible(product.isActive);
        setStock(String(product.stock));
        setCategory(String(product.category?.categoryId ?? ""));
        setCategories(categoryList);
        setImages(
          product.productImages.map((image) => ({
            id: String(image.id),
            src: image.url,
            primary: image.isThumbnail,
          })),
        );
        setInitialForm({
          name: product.name,
          slug: product.slug ?? "",
          sku: product.sku ?? "",
          description: product.description,
          price: String(product.price),
          compareAtPrice,
          stock: String(product.stock),
          threshold,
          category: String(product.category?.categoryId ?? ""),
          visible: product.isActive,
          images: product.productImages.map((image) => ({
            id: String(image.id),
            src: image.url,
            primary: image.isThumbnail,
          })),
        });
      })
      .catch(() => setMessage("Unable to load this product."));
  }, [id]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await updateAdminProduct(Number(id), {
        name,
        slug,
        sku,
        description,
        price: Number(price),
        isActive: visible,
        categoryId: category ? Number(category) : null,
      });
      await updateAdminProductInventory(
        Number(id),
        Number(stock),
        Number(threshold),
      );
      setInitialForm(currentForm);
      setMessage("Changes saved successfully.");
      toast.add({
        title: "Product updated",
        description: "Product changes were saved successfully.",
        type: "success",
      });
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Unable to save changes.";
      setMessage(description);
      toast.add({ title: "Product save failed", description, type: "error" });
    }
  }

  function handleMedia(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImages((current) => [
      ...current,
      { id: `${file.name}-${Date.now()}`, src: URL.createObjectURL(file) },
    ]);
  }

  function removeImage(id: string) {
    setImages((current) => current.filter((image) => image.id !== id));
    toast.add({
      title: "Image removed",
      description: "The image was removed from this product draft.",
      type: "info",
    });
  }

  function makePrimary(id: string) {
    setImages((current) =>
      current.map((image) => ({ ...image, primary: image.id === id })),
    );
    toast.add({
      title: "Primary image changed",
      description: "The selected image is now the product thumbnail.",
      type: "success",
    });
  }

  async function deleteProduct() {
    try {
      await deleteAdminProduct(Number(id));
      toast.add({
        title: "Product deleted",
        description: "The product was removed successfully.",
        type: "success",
      });
      setDeleteDialogOpen(false);
      router.push("/dashboard/products");
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Unable to delete product.";
      setMessage(description);
      toast.add({
        title: "Product deletion failed",
        description,
        type: "error",
      });
    }
  }

  return (
    <>
      <form onSubmit={handleSave}>
        <header className="bg-background/95 sticky top-0 z-20 mb-6 flex flex-col gap-4 border-b border-(--glass-border) py-2 pb-6 backdrop-blur-xl md:flex-row md:items-end md:justify-between">
          <div>
            <nav className="meta-font text-text-muted mb-2 flex items-center gap-2 text-[11px]">
              <Link
                href="/dashboard/products"
                className="hover:text-primary-soft transition"
              >
                Products
              </Link>
              <span>/</span>
              <span>Sakura Fox Plush</span>
              <span>/</span>
              <span className="text-foreground">Edit</span>
            </nav>
            <h1 className="heading-font text-foreground text-2xl font-semibold sm:text-3xl">
              Edit Product
            </h1>
            <p className="text-text-muted mt-1 text-sm">
              Update this product&apos;s information and availability.
            </p>
          </div>
          {hasChanges ? (
            <div className="flex gap-2">
              <Link
                href="/dashboard/products"
                className="meta-font text-foreground hover:bg-surface-3 flex h-9 items-center rounded-md border border-(--outline) px-4 text-xs transition"
              >
                Discard
              </Link>
              <button
                type="submit"
                className="meta-font bg-primary hover:bg-primary-soft text-primary-foreground flex h-9 items-center gap-2 rounded-md px-5 text-xs font-semibold shadow-(--glow) transition"
              >
                <Save size={13} /> Save Changes
              </button>
            </div>
          ) : (
            <Link
              href="/dashboard/products"
              className="meta-font text-foreground hover:bg-surface-3 flex h-9 items-center rounded-md border border-(--outline) px-4 text-xs transition"
            >
              Back to Product List
            </Link>
          )}
        </header>

        {message ? (
          <div className="meta-font border-tertiary/30 bg-tertiary/10 text-tertiary mb-5 flex items-center gap-2 rounded-md border px-4 py-3 text-xs">
            <CheckCircle2 size={14} /> {message}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <section className="glass-panel rounded-lg p-5 sm:p-6">
              <SectionTitle
                icon={<span className="text-primary">ⓘ</span>}
                title="Basic Information"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Product Name" className="md:col-span-2">
                  <input
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="form-input"
                  />
                </Field>
                <Field label="Slug">
                  <div className="relative">
                    <span className="meta-font text-text-muted absolute top-1/2 left-3 -translate-y-1/2 text-xs">
                      /products/
                    </span>
                    <input
                      value={slug}
                      onChange={(event) => setSlug(event.target.value)}
                      className="form-input pl-20"
                    />
                  </div>
                </Field>
                <Field label="SKU">
                  <input
                    value={sku}
                    onChange={(event) => setSku(event.target.value)}
                    className="form-input font-mono text-xs"
                  />
                </Field>
              </div>
            </section>

            <section className="glass-panel rounded-lg p-5 sm:p-6">
              <SectionTitle
                icon={<List size={18} className="text-primary" />}
                title="Description"
              />
              <div className="bg-surface-2 flex gap-1 rounded-t-md border border-b-0 border-(--glass-border) p-2">
                <ToolbarButton label="Bold">
                  <Bold size={14} />
                </ToolbarButton>
                <ToolbarButton label="Italic">
                  <Italic size={14} />
                </ToolbarButton>
                <ToolbarButton label="Underline">
                  <Underline size={14} />
                </ToolbarButton>
                <span className="mx-1 w-px bg-(--glass-border)" />
                <ToolbarButton label="Bulleted list">
                  <List size={14} />
                </ToolbarButton>
                <ToolbarButton label="Numbered list">
                  <ListOrdered size={14} />
                </ToolbarButton>
              </div>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={6}
                className="form-input resize-y rounded-t-none"
              />
            </section>

            <section className="glass-panel rounded-lg p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <SectionTitle
                  icon={<ImageIcon size={18} className="text-primary" />}
                  title="Product Images"
                />
                <label className="meta-font text-primary-soft hover:text-primary cursor-pointer text-xs underline">
                  Add Media
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleMedia}
                    className="sr-only"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((image) => (
                  <ImageTile
                    key={image.id}
                    image={image}
                    onRemove={removeImage}
                    onPrimary={makePrimary}
                  />
                ))}
                <label className="bg-surface-2/60 hover:border-primary hover:bg-surface-3 text-text-muted relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-(--outline) transition">
                  <Upload size={22} />
                  <span className="meta-font text-xs">Upload</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleMedia}
                    className="sr-only"
                  />
                </label>
              </div>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="glass-panel rounded-lg p-5 sm:p-6">
                <SectionTitle
                  icon={<span className="text-primary">RM</span>}
                  title="Pricing"
                />
                <div className="space-y-4">
                  <CurrencyField
                    label="Price"
                    value={price}
                    onChange={setPrice}
                  />
                  <CurrencyField
                    label="Compare-at Price"
                    value={compareAtPrice}
                    onChange={setCompareAtPrice}
                  />
                </div>
              </section>
              <section className="glass-panel rounded-lg p-5 sm:p-6">
                <SectionTitle
                  icon={<span className="text-primary">▥</span>}
                  title="Inventory"
                />
                <div className="space-y-4">
                  <Field label="Stock Quantity">
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(event) => setStock(event.target.value)}
                      className="form-input"
                    />
                  </Field>
                  <Field label="Low Stock Threshold">
                    <input
                      type="number"
                      min="0"
                      value={threshold}
                      onChange={(event) => setThreshold(event.target.value)}
                      className="form-input"
                    />
                  </Field>
                </div>
              </section>
            </div>

            <section className="flex flex-col gap-4 rounded-lg border border-[#ffb4ab]/20 bg-[#2b1b1c]/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="heading-font flex items-center gap-2 text-xl font-medium text-[#ffb4ab]">
                  <Trash2 size={18} /> Danger Zone
                </h2>
                <p className="text-text-muted mt-1 text-sm">
                  This action cannot be undone. It will permanently remove the
                  product from the store.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(true)}
                className="meta-font shrink-0 rounded-md border border-[#ffb4ab]/50 px-4 py-2 text-xs text-[#ffb4ab] transition hover:bg-[#ffb4ab]/10"
              >
                Delete Product
              </button>
            </section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="glass-panel rounded-lg p-5">
              <AsideTitle title="Status" />
              <Select
                value={visible ? "Active" : "Inactive"}
                onValueChange={(value) => setVisible(value === "Active")}
              >
                <SelectTrigger
                  aria-label="Product status"
                  className="bg-surface-1 text-foreground h-10 w-full rounded-md border-(--glass-border) px-3 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="my-5 border-t border-(--glass-border)" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground text-sm">Store Visibility</p>
                  <p className="meta-font text-text-muted text-[11px]">
                    Show on storefront
                  </p>
                </div>
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
              </div>
              <div className="my-5 border-t border-(--glass-border)" />
              <Field label="Category">
                <Select
                  value={category || null}
                  onValueChange={(value) => setCategory(value ?? "")}
                >
                  <SelectTrigger
                    aria-label="Product category"
                    className="form-input h-auto w-full"
                  >
                    <SelectValue placeholder="Uncategorized" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem
                        key={item.categoryId}
                        value={String(item.categoryId)}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </section>
            <section className="glass-panel rounded-lg p-5">
              <AsideTitle title="Storefront Preview" />
              <div className="bg-background overflow-hidden rounded-md border border-(--glass-border)">
                <div className="bg-surface-2 relative aspect-square">
                  <Image
                    src={
                      images.find((image) => image.primary)?.src ??
                      images[0]?.src ??
                      "/homepage/white-plush-rabbit-on-shelf.png"
                    }
                    alt="Sakura Fox Plush preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <span className="meta-font bg-primary/15 text-primary border-primary/30 absolute top-2 left-2 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                    SALE
                  </span>
                </div>
                <div className="p-4">
                  <p className="meta-font text-tertiary mb-1 text-[10px] font-bold tracking-wider uppercase">
                    {category}
                  </p>
                  <h2 className="heading-font text-foreground truncate text-base">
                    {name}
                  </h2>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="meta-font text-primary text-sm">
                      RM {price}
                    </span>
                    <span className="meta-font text-text-muted text-[11px] line-through">
                      RM {compareAtPrice}
                    </span>
                  </div>
                  <p className="meta-font mt-3 flex items-center gap-1 text-[11px] text-[#4ade80]">
                    <CheckCircle2 size={13} /> In Stock ({stock})
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </form>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="text-foreground bg-surface-2! border border-[#ffb4ab]/20">
          <DialogHeader>
            <DialogTitle className="text-[#ffb4ab]">
              Delete product?
            </DialogTitle>
            <DialogDescription className="text-text-muted">
              This action cannot be undone. The product will be permanently
              removed from the store.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-surface-2!">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={deleteProduct}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h2 className="heading-font text-foreground mb-5 flex items-center gap-2 text-xl font-medium">
      {icon}
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
function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block space-y-2 ${className}`}>
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
          className="form-input pl-10 text-right"
        />
      </div>
    </Field>
  );
}
function ToolbarButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="text-text-muted hover:bg-surface-3 hover:text-foreground rounded p-2 transition"
    >
      {children}
    </button>
  );
}
function ImageTile({
  image,
  onRemove,
  onPrimary,
}: {
  image: ProductImage;
  onRemove: (id: string) => void;
  onPrimary: (id: string) => void;
}) {
  return (
    <div
      className={`group bg-surface-2 relative aspect-square overflow-hidden rounded-md ${image.primary ? "border-primary border-2" : "border border-(--glass-border)"}`}
    >
      <Image
        src={image.src}
        alt="Product media"
        fill
        className="object-cover"
        unoptimized
      />
      <div className="bg-background/70 absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition group-hover:opacity-100">
        <button
          type="button"
          title="Set as primary"
          aria-label="Set as primary"
          onClick={() => onPrimary(image.id)}
          className="bg-surface-4 text-primary-soft rounded-full p-2 hover:cursor-pointer"
        >
          <Star size={14} />
        </button>
        <button
          type="button"
          title="Remove image"
          aria-label="Remove image"
          onClick={() => onRemove(image.id)}
          className="bg-surface-4 rounded-full p-2 text-[#ffb4ab] hover:cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
      {image.primary ? (
        <span className="meta-font bg-primary text-primary-foreground absolute top-2 left-2 rounded px-2 py-1 text-[10px] font-bold">
          ★ Primary
        </span>
      ) : null}
    </div>
  );
}
