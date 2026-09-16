import { request } from "./client.api";

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

let currentUserRequest: Promise<{ message: string; user: User }> | null = null;

export function getCurrentUser() {
  if (!currentUserRequest) {
    currentUserRequest = request<{ message: string; user: User }>(
      "/users/me",
    ).finally(() => {
      currentUserRequest = null;
    });
  }

  return currentUserRequest;
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

export function createAddress(
  address: Omit<SavedAddress, "id" | "userId" | "createdAt" | "updatedAt">,
) {
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
