const apiBaseUrl = "/api";

type ApiError = Error & { status?: number };

async function request<T>(path: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    const error = new Error(
      body?.message || "Something went wrong. Please try again.",
    ) as ApiError;
    error.status = response.status;
    throw error;
  }

  return (await response.json()) as T;
}

export type User = {
  userId: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

export function login(email: string, password: string) {
  return request<{ message: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(name: string, email: string, password: string) {
  return request<{ message: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getCurrentUser() {
  try {
    return await request<{ message: string; user: User }>("/users/me");
  } catch (error) {
    if ((error as ApiError).status !== 401) {
      throw error;
    }

    await request("/auth/refresh", { method: "POST" });
    return request<{ message: string; user: User }>("/users/me");
  }
}
