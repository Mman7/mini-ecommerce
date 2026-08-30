const apiBaseUrl =
  typeof window === "undefined"
    ? `${process.env.BACKEND_URL || "http://localhost:5000"}/api`
    : "/api";

export type ApiError = Error & { status?: number };

export async function request<T>(path: string, options: RequestInit = {}) {
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
      error?: string;
    } | null;
    const error = new Error(
      body?.message || body?.error || "Something went wrong. Please try again.",
    ) as ApiError;
    error.status = response.status;
    throw error;
  }

  return (await response.json()) as T;
}
