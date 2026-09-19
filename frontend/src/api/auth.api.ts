import { request } from "./client.api";

export const authApi = {
  login: (email: string, password: string) =>
    request<{ message: string; user: import("./user.api").User }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    ),
  register: (name: string, email: string, password: string) =>
    request<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  refresh: () => request("/auth/refresh", { method: "POST" }),
  logout: () =>
    request<{ message: string }>("/auth/logout", { method: "POST" }),
};
