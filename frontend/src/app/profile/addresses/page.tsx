"use client";

import { MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const initialAddresses = [
  {
    id: 1,
    label: "Home",
    name: "Eric Man",
    address: "12 Sakura Lane, Taman Komorebi",
    city: "Kuala Lumpur, 50450",
    phone: "+60 12 345 6789",
    default: true,
  },
  {
    id: 2,
    label: "Studio",
    name: "Eric Man",
    address: "8A Atelier Walk, Bukit Bintang",
    city: "Kuala Lumpur, 55100",
    phone: "+60 12 345 6789",
    default: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);

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
          onClick={() => setShowForm((current) => !current)}
          className="meta-font bg-primary text-primary-ink hover:bg-primary-soft flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold transition"
        >
          <Plus size={15} /> Add Address
        </button>
      </header>
      {showForm ? (
        <form className="glass-panel grid gap-3 rounded-lg p-5 sm:grid-cols-2">
          <input
            required
            placeholder="Label, e.g. Home"
            className="form-input"
          />
          <input required placeholder="Full name" className="form-input" />
          <input
            required
            placeholder="Street address"
            className="form-input sm:col-span-2"
          />
          <input
            required
            placeholder="City and postcode"
            className="form-input"
          />
          <input required placeholder="Phone number" className="form-input" />
          <button
            type="submit"
            onClick={() => setShowForm(false)}
            className="meta-font bg-primary text-primary-ink rounded-md px-4 py-2 text-xs font-semibold sm:col-span-2 sm:justify-self-end"
          >
            Save Address
          </button>
        </form>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <article key={address.id} className="glass-panel rounded-lg p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-secondary/15 text-secondary flex h-9 w-9 items-center justify-center rounded-full">
                  <MapPin size={16} />
                </span>
                <div>
                  <h2 className="heading-font text-foreground text-lg">
                    {address.label}
                  </h2>
                  {address.default ? (
                    <span className="meta-font text-tertiary text-[10px] uppercase">
                      Default address
                    </span>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                aria-label={`Delete ${address.label} address`}
                onClick={() =>
                  setAddresses((current) =>
                    current.filter((item) => item.id !== address.id),
                  )
                }
                className="text-text-muted hover:text-error"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div className="text-text-muted mt-5 space-y-1 text-sm">
              <p>{address.name}</p>
              <p>{address.address}</p>
              <p>{address.city}</p>
              <p>{address.phone}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
