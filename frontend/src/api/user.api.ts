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

export const userApi = {
  me: () => {
    if (!currentUserRequest) {
      currentUserRequest = request<{ message: string; user: User }>(
        "/users/me",
      ).finally(() => {
        currentUserRequest = null;
      });
    }
    return currentUserRequest;
  },
  update: (data: { name?: string; email?: string; phoneNumber?: string }) =>
    request<{ message: string; user: User }>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  addresses: {
    list: () => request<{ addresses: SavedAddress[] }>("/users/me/addresses"),
    create: (
      address: Omit<SavedAddress, "id" | "userId" | "createdAt" | "updatedAt">,
    ) =>
      request<{ addresses: SavedAddress[] }>("/users/me/addresses", {
        method: "POST",
        body: JSON.stringify(address),
      }),
    update: (
      addressId: number,
      address: Omit<SavedAddress, "id" | "userId" | "createdAt" | "updatedAt">,
    ) =>
      request<{ addresses: SavedAddress[] }>(
        `/users/me/addresses/${addressId}`,
        { method: "PATCH", body: JSON.stringify(address) },
      ),
    delete: (addressId: number) =>
      request<{ addresses: SavedAddress[] }>(
        `/users/me/addresses/${addressId}`,
        { method: "DELETE" },
      ),
  },
};
