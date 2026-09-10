const apiBaseUrl =
  typeof window === "undefined"
    ? `${process.env.BACKEND_URL || "http://localhost:5000"}/api`
    : "/api";

export type ApiError = Error & { status?: number };

let refreshRequest: Promise<boolean> | null = null;

async function refreshAccessToken() {
  if (refreshRequest) return refreshRequest;

  refreshRequest = fetch(`${apiBaseUrl}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
  canRefresh = true,
) {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (response.status === 401 && canRefresh && path !== "/auth/refresh") {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request<T>(path, options, false);
  }

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
