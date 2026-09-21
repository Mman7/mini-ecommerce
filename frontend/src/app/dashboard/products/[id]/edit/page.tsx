"use client";

import {
  CheckCircle2,
  Image as ImageIcon,
  List,
  Save,
  Star,
  Trash2,
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
import { DEFAULT_PRODUCT_IMAGE } from "@/src/path/product_image_path";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productApi } from "../../../../../api/product.api";
import { categoryApi } from "../../../../../api/category.api";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

type ProductImage = { id: string; src: string; primary?: boolean };
type ProductFormSnapshot = {
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: string;
  stock: string;
  threshold: string;
  category: string;
  visible: boolean;
  images: ProductImage[];
};

const initialImages: ProductImage[] = [
  {
    id: "hero",
    src: DEFAULT_PRODUCT_IMAGE,
    primary: true,
  },
  { id: "detail", src: "/homepage/plush-toys-on-wooden-shelf.png" },
  { id: "lifestyle", src: "/homepage/komorebi-gift-atelier-wrapped-boxes.png" },
];

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState("Sakura Fox Plush");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("PLUSH-SAK-001");
  const [description, setDescription] = useState(
    "A soft and adorable bunny plush inspired by Japanese kawaii gift culture. Made with premium minky fabric and filled with hypoallergenic stuffing. Features delicate embroidered sakura blossoms on the ears and tail. Perfect as a comforting companion or a collector's display piece.",
  );
  const [price, setPrice] = useState("48.00");
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
  const [imageAction, setImageAction] = useState<string | null>(null);

  const currentForm: ProductFormSnapshot = {
    name,
    slug,
    sku,
    description,
    price,
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
    Promise.all([productApi.admin.get(Number(id)), categoryApi.list()])
      .then(([product, categoryList]) => {
        setName(product.name);
        setSlug(product.slug);
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
          slug: product.slug,
          sku: product.sku ?? "",
          description: product.description,
          price: String(product.price),
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
      await productApi.admin.update(Number(id), {
        name,
        slug,
        sku,
        description,
        price: Number(price),
        isActive: visible,
        categoryId: category ? Number(category) : null,
      });
      await productApi.admin.updateInventory(
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

  async function uploadImage(file: File) {
    setImageAction("upload");
    try {
      const data = new FormData();
      data.append("image", file);
      const response = await productApi.admin.createImage(Number(id), data);
      const image = response.item;
      setImages((current) => [
        ...current,
        {
          id: String(image.id),
          src: image.url,
          primary: image.isThumbnail,
        },
      ]);
      toast.add({
        title: "Image uploaded",
        description: "The product image was added successfully.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Image upload failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setImageAction(null);
    }
  }

  async function replaceImage(imageId: string, file: File) {
    setImageAction(imageId);
    try {
      const data = new FormData();
      data.append("image", file);
      const response = await productApi.admin.updateImage(
        Number(id),
        Number(imageId),
        data,
      );
      setImages((current) =>
        current.map((image) =>
          image.id === imageId ? { ...image, src: response.item.url } : image,
        ),
      );
      toast.add({
        title: "Image replaced",
        description: "The product image was updated successfully.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Image update failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setImageAction(null);
    }
  }

  async function setPrimaryImage(imageId: string) {
    setImageAction(imageId);
    try {
      const data = new FormData();
      data.append("isThumbnail", "true");
      await productApi.admin.updateImage(Number(id), Number(imageId), data);
      setImages((current) =>
        current.map((image) => ({ ...image, primary: image.id === imageId })),
      );
      toast.add({
        title: "Primary image updated",
        description: "This image is now the storefront thumbnail.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Primary image update failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setImageAction(null);
    }
  }

  async function removeImage(imageId: string) {
    setImageAction(imageId);
    try {
      await productApi.admin.deleteImage(Number(id), Number(imageId));
      setImages((current) => current.filter((image) => image.id !== imageId));
      toast.add({
        title: "Image removed",
        description: "The product image was deleted successfully.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Image removal failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setImageAction(null);
    }
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void uploadImage(file);
  }

  async function deleteProduct() {
    try {
      await productApi.admin.delete(Number(id));
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
              <span>{name || "Product"}</span>
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
          <div className="meta-font bg-surface-2 text-primary-soft mb-5 flex items-center gap-2 rounded-md px-4 py-3 text-xs">
            <CheckCircle2 size={14} /> {message}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <section className="bg-surface-2 rounded-lg p-5 sm:p-6">
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
                <Field label="Public URL" className="md:col-span-2">
                  <div className="flex items-center">
                    <span className="bg-surface-2 text-text-muted rounded-l-md border border-r-0 border-(--glass-border) px-3 py-2.5 text-sm">
                      /products/
                    </span>
                    <input
                      value={slug}
                      onChange={(event) => setSlug(event.target.value)}
                      aria-label="Product slug"
                      className="form-input rounded-l-none text-sm"
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

            <section className="bg-surface-2 rounded-lg p-5 sm:p-6">
              <SectionTitle
                icon={<List size={18} className="text-primary" />}
                title="Description"
              />
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={6}
                className="form-input resize-y"
              />
            </section>

            <section className="bg-surface-2 rounded-lg p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <SectionTitle
                  icon={<ImageIcon size={18} className="text-primary" />}
                  title="Product Images"
                />
                <label className="meta-font text-primary-soft hover:text-primary cursor-pointer text-xs underline">
                  <Upload size={13} className="mr-1 inline" />
                  Add image
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleUpload}
                    disabled={imageAction !== null}
                    className="sr-only"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((image) => (
                  <ImageTile
                    key={image.id}
                    image={image}
                    busy={imageAction === image.id}
                    onReplace={(file) => void replaceImage(image.id, file)}
                    onPrimary={() => void setPrimaryImage(image.id)}
                    onRemove={() => void removeImage(image.id)}
                  />
                ))}
              </div>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="bg-surface-2 rounded-lg p-5 sm:p-6">
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
                </div>
              </section>
              <section className="bg-surface-2 rounded-lg p-5 sm:p-6">
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

            <section className="bg-surface-2 flex flex-col gap-4 rounded-lg p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="heading-font text-primary-soft flex items-center gap-2 text-xl font-medium">
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
                className="meta-font border-primary/50 text-primary-soft hover:bg-primary/10 shrink-0 rounded-md border px-4 py-2 text-xs transition"
              >
                Delete Product
              </button>
            </section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="bg-surface-2 rounded-lg p-5">
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
              <div className="my-5" />
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
              <div className="my-5" />
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
            <section className="bg-surface-2 rounded-lg p-5">
              <AsideTitle title="Storefront Preview" />
              <div className="bg-background overflow-hidden rounded-md">
                <div className="bg-surface-2 relative aspect-square">
                  <Image
                    src={
                      images.find((image) => image.primary)?.src ??
                      images[0]?.src ??
                      DEFAULT_PRODUCT_IMAGE
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
                  <p className="meta-font text-text-muted mb-1 text-[10px] font-bold tracking-wider uppercase">
                    {category}
                  </p>
                  <h2 className="heading-font text-foreground truncate text-base">
                    {name}
                  </h2>
                  <div className="mt-2">
                    <span className="meta-font text-primary text-sm">
                      RM {price}
                    </span>
                  </div>
                  <p className="meta-font text-text-muted mt-3 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 size={13} /> In Stock ({stock})
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </form>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="text-foreground bg-surface-2! border-primary/20 border">
          <DialogHeader>
            <DialogTitle className="text-primary-soft">
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
function ImageTile({
  image,
  busy,
  onReplace,
  onPrimary,
  onRemove,
}: {
  image: ProductImage;
  busy: boolean;
  onReplace: (file: File) => void;
  onPrimary: () => void;
  onRemove: () => void;
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
      <div className="bg-background/75 absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <label
          title="Replace image"
          aria-label="Replace image"
          className="bg-surface-4 text-primary-soft cursor-pointer rounded-full p-2"
        >
          <Upload size={14} />
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) onReplace(file);
            }}
            className="sr-only"
          />
        </label>
        {!image.primary && (
          <button
            type="button"
            title="Set as primary"
            aria-label="Set as primary"
            disabled={busy}
            onClick={onPrimary}
            className="bg-surface-4 text-primary-soft rounded-full p-2 disabled:opacity-50"
          >
            <Star size={14} />
          </button>
        )}
        <button
          type="button"
          title="Remove image"
          aria-label="Remove image"
          disabled={busy}
          onClick={onRemove}
          className="bg-surface-4 text-primary-soft rounded-full p-2 disabled:opacity-50"
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
