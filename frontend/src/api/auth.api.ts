import { request } from "./client.api";

export function login(email: string, password: string) {
  return request<{ message: string; user: import("./user.api").User }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
  );
}

export function register(name: string, email: string, password: string) {
  return request<{ message: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function refreshSession() {
  return request("/auth/refresh", { method: "POST" });
}

export function logout() {
  return request<{ message: string }>("/auth/logout", { method: "POST" });
}
