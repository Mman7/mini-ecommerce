"use client";

import Image from "next/image";
import { Camera, Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent } from "react";

const addresses = [
  {
    label: "Home",
    address: [
      "Aria Vance",
      "1-1 Chiyoda",
      "Chiyoda City, Tokyo 100-8111",
      "Japan",
    ],
    primary: true,
  },
  {
    label: "Office",
    address: [
      "Aria Vance",
      "Roppongi Hills Mori Tower",
      "6-10-1 Roppongi, Minato City",
      "Tokyo 106-6108, Japan",
    ],
    primary: false,
  },
];

export default function ProfilePage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <>
      <div className="glass-panel relative flex flex-col items-center gap-5 overflow-hidden rounded-lg p-6 sm:flex-row sm:items-start sm:p-8">
        <div className="from-primary/8 pointer-events-none absolute inset-0 bg-linear-to-br to-transparent" />
        <div className="relative shrink-0">
          <Image
            src="/homepage/woman-holding-gift.jpg"
            alt="Aria Vance profile"
            width={112}
            height={112}
            className="border-primary/30 h-28 w-28 rounded-full border-2 object-cover shadow-[0_0_20px_rgba(255,183,122,0.15)]"
          />
          <button
            type="button"
            aria-label="Change profile photo"
            className="bg-surface-3 text-primary hover:bg-surface-4 absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border border-(--glass-border) transition"
          >
            <Camera size={14} />
          </button>
        </div>
        <div className="relative z-10 text-center sm:text-left">
          <h1 className="heading-font text-2xl font-semibold sm:text-3xl">
            Aria Vance
          </h1>
          <p className="text-primary-soft mt-1 text-sm">
            Member since October 2021
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="border-secondary/30 bg-secondary/15 text-secondary rounded-full border px-3 py-1 text-xs">
              Premium Collector
            </span>
            <span className="border-tertiary/30 bg-tertiary/15 text-tertiary rounded-full border px-3 py-1 text-xs">
              Early Access
            </span>
          </div>
        </div>
      </div>

      <section>
        <h2 className="heading-font mb-4 text-xl font-medium">
          Personal Information
        </h2>
        <form
          onSubmit={handleSubmit}
          className="glass-panel grid gap-5 rounded-lg p-6 sm:grid-cols-2 sm:p-8"
        >
          <ProfileField label="First Name" defaultValue="Aria" />
          <ProfileField label="Last Name" defaultValue="Vance" />
          <ProfileField
            label="Email Address"
            defaultValue="aria.vance@example.com"
            type="email"
            wide
          />
          <ProfileField
            label="Phone Number"
            defaultValue="+81 90-1234-5678"
            type="tel"
          />
          <div className="flex justify-end sm:col-span-2">
            <button
              type="submit"
              className="meta-font bg-primary text-primary-ink hover:bg-primary-soft rounded-md px-6 py-3 text-xs font-semibold shadow-[0_0_15px_rgba(255,183,122,0.2)] transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="heading-font text-xl font-medium">Saved Addresses</h2>
          <button
            type="button"
            className="meta-font text-primary hover:text-primary-soft flex items-center gap-1 text-xs transition"
          >
            <Plus size={15} />
            Add New
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address.label}
              className={`glass-panel relative rounded-lg p-5 ${address.primary ? "border-l-primary border-l-2" : ""}`}
            >
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  type="button"
                  aria-label={`Edit ${address.label} address`}
                  className="text-text-muted hover:text-primary transition"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${address.label} address`}
                  className="text-text-muted hover:text-error transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="mb-3 flex items-center gap-2 pr-14">
                {address.primary && (
                  <span className="bg-primary/20 text-primary rounded px-2 py-0.5 text-[10px]">
                    Default
                  </span>
                )}
                <h3 className="meta-font text-sm font-semibold">
                  {address.label}
                </h3>
              </div>
              <p className="text-text-muted text-sm leading-6">
                {address.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ProfileField({
  label,
  defaultValue,
  type = "text",
  wide = false,
}: {
  label: string;
  defaultValue: string;
  type?: string;
  wide?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-2 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="meta-font text-text-muted text-xs font-semibold">
        {label}
      </span>
      <input
        className="bg-surface-3 text-foreground focus:border-primary rounded-md border border-(--glass-border) px-4 py-3 text-sm transition outline-none focus:shadow-[0_0_0_3px_rgba(255,183,122,0.14)]"
        type={type}
        defaultValue={defaultValue}
      />
    </label>
  );
}
