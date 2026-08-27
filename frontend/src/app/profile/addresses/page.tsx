"use client";

import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
  type SavedAddress,
} from "@/src/api/user.api";

type AddressForm = Pick<SavedAddress, "address">;
const emptyForm: AddressForm = {
  address: "",
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const startEditing = (savedAddress: SavedAddress) => {
    setEditingId(String(savedAddress.id));
    setForm({ address: savedAddress.address });
    setShowForm(true);
    setError("");
  };

  useEffect(() => {
    getAddresses()
      .then((response) => setAddresses(response.addresses))
      .catch((requestError) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load addresses.",
        ),
      );
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      const response = editingId
        ? await updateAddress(Number(editingId), form)
        : await createAddress(form);
      setAddresses(response.addresses);
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save address.",
      );
    }
  };

  const remove = async (id: number) => {
    try {
      setAddresses((await deleteAddress(id)).addresses);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete address.",
      );
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="meta-font text-primary mb-2 text-xs tracking-[0.16em] uppercase">
            Delivery details
          </p>
          <h1 className="heading-font text-foreground text-3xl font-semibold">
            My Addresses
          </h1>
          <p className="text-text-muted mt-2 text-sm">
            Keep your favorite delivery spots close at hand.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm((current) => !current);
          }}
          className="meta-font bg-primary text-primary-ink hover:bg-primary-soft flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold"
        >
          <Plus size={15} /> Add Address
        </button>
      </header>

      {error && (
        <p className="text-destructive rounded-md border border-red-200 bg-red-50 p-3 text-sm">
          {error}
        </p>
      )}

      {showForm && (
        <form onSubmit={submit} className="glass-panel rounded-lg p-5">
          <label className="meta-font text-foreground block text-xs font-semibold uppercase">
            Address
            <textarea
              value={form.address}
              onChange={(event) => setForm({ address: event.target.value })}
              required
              rows={3}
              className="border-border bg-background focus:border-primary mt-2 block w-full rounded-md border p-3 text-sm outline-none"
              placeholder="Enter a delivery address"
            />
          </label>
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="meta-font text-text-muted rounded-md px-4 py-2.5 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="meta-font bg-primary text-primary-ink rounded-md px-4 py-2.5 text-xs font-semibold"
            >
              {editingId ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="glass-panel rounded-lg p-8 text-center">
          <MapPin className="text-primary mx-auto" size={24} />
          <p className="text-text-muted mt-3 text-sm">
            No saved addresses yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((savedAddress) => (
            <article
              key={savedAddress.id}
              className="glass-panel flex items-start justify-between gap-4 rounded-lg p-5"
            >
              <div className="flex gap-3">
                <MapPin className="text-primary mt-0.5 shrink-0" size={18} />
                <p className="text-foreground text-sm leading-6">
                  {savedAddress.address}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => startEditing(savedAddress)}
                  aria-label="Edit address"
                  className="text-text-muted hover:text-foreground rounded-md p-2"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(savedAddress.id)}
                  aria-label="Delete address"
                  className="text-text-muted hover:text-destructive rounded-md p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
