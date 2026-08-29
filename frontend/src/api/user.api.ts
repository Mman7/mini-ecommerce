import { request, type ApiError } from "./client.api";
import { refreshSession } from "./auth.api";

export type User = {
  userId: string;
  name: string;
  email: string;
  role: string;
  deliveryAddress: string | null;
  phoneNumber: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function getCurrentUser() {
  try {
    return await request<{ message: string; user: User }>("/users/me");
  } catch (error) {
    if ((error as ApiError).status !== 401) {
      throw error;
    }

    await refreshSession();
    return request<{ message: string; user: User }>("/users/me");
  }
}

export type SavedAddress = {
  id: number;
  userId: string;
  addressLine: string;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
};

export function updateCurrentUser(data: {
  name?: string;
  email?: string;
  phoneNumber?: string;
}) {
  return request<{ message: string; user: User }>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function getAddresses() {
  return request<{ addresses: SavedAddress[] }>("/users/me/addresses");
}

export function createAddress(address: Omit<SavedAddress, "id" | "userId" | "createdAt" | "updatedAt">) {
  return request<{ addresses: SavedAddress[] }>("/users/me/addresses", {
    method: "POST",
    body: JSON.stringify(address),
  });
}

export function updateAddress(
  addressId: number,
  address: Omit<SavedAddress, "id" | "userId" | "createdAt" | "updatedAt">,
) {
  return request<{ addresses: SavedAddress[] }>(
    `/users/me/addresses/${addressId}`,
    { method: "PATCH", body: JSON.stringify(address) },
  );
}

export function deleteAddress(addressId: number) {
  return request<{ addresses: SavedAddress[] }>(
    `/users/me/addresses/${addressId}`,
    { method: "DELETE" },
  );
}
