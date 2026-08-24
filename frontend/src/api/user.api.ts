import { request, type ApiError } from "./client.api";
import { refreshSession } from "./auth.api";

export type User = {
  userId: string;
  name: string;
  email: string;
  role: string;
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