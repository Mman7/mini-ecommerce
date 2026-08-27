"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  getAddresses,
  getCurrentUser,
  updateCurrentUser,
  type SavedAddress,
  type User,
} from "@/src/api/user.api";
import { useGlobalStore } from "@/src/store/global.store";
import { AddressPreviewCard } from "@/src/components/profile/AddressPreviewCard";
import { ProfileHeader } from "@/src/components/profile/ProfileHeader";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const setGlobalUser = useGlobalStore((state) => state.setUser);

  useEffect(() => {
    Promise.all([getCurrentUser(), getAddresses()])
      .then(([userResponse, addressResponse]) => {
        setUser(userResponse.user);
        setGlobalUser(userResponse.user);
        setForm({
          name: userResponse.user.name,
          email: userResponse.user.email,
          phoneNumber: userResponse.user.phoneNumber ?? "",
        });
        setAddresses(addressResponse.addresses);
      })
      .catch((requestError) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load your profile.",
        ),
      );
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await updateCurrentUser(form);
      setUser(response.user);
      setGlobalUser(response.user);
      setMessage("Profile updated successfully.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update your profile.",
      );
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="heading-font text-primary text-3xl font-semibold sm:text-4xl">
          My Profile
        </h1>
        <p className="text-text-muted mt-2 text-base">
          Manage your account details and saved delivery information.
        </p>
      </header>
      <ProfileHeader user={user} />
      <section>
        <h2 className="heading-font mb-4 text-xl font-medium">
          Personal Information
        </h2>
        <form
          onSubmit={handleSubmit}
          className="glass-panel grid gap-5 rounded-lg p-6 sm:grid-cols-2 sm:p-8"
        >
          <ProfileField
            label="Full Name"
            value={form.name}
            onChange={(value) => setForm({ ...form, name: value })}
          />
          <ProfileField
            label="Phone Number"
            type="tel"
            value={form.phoneNumber}
            onChange={(value) => setForm({ ...form, phoneNumber: value })}
          />
          <ProfileField
            label="Email Address"
            type="email"
            value={form.email}
            wide
            onChange={(value) => setForm({ ...form, email: value })}
          />
          {(message || error) && (
            <p
              className={`${error ? "text-error" : "text-tertiary"} text-sm sm:col-span-2`}
            >
              {error || message}
            </p>
          )}
          <div className="flex justify-end sm:col-span-2">
            <button
              type="submit"
              className="meta-font bg-primary text-primary-ink hover:bg-primary-soft rounded-md px-6 py-3 text-xs font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="heading-font text-xl font-medium">Saved Addresses</h2>
          <Link
            href="/profile/addresses"
            className="meta-font text-primary hover:text-primary-soft text-xs"
          >
            Manage addresses
          </Link>
        </div>
        {addresses.length === 0 ? (
          <p className="text-text-muted text-sm">No saved addresses yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.slice(0, 2).map((address) => (
              <AddressPreviewCard key={address.id} address={address} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ProfileField({
  label,
  value,
  onChange,
  type = "text",
  wide = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  wide?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-2 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="meta-font text-text-muted text-xs font-semibold">
        {label}
      </span>
      <input
        className="bg-surface-3 text-foreground focus:border-primary rounded-md border border-(--glass-border) px-4 py-3 text-sm outline-none"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </label>
  );
}
