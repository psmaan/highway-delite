// src/api.ts
const API_BASE = "http://localhost:5000/api";

export async function apiFetch(path: string, options: RequestInit = {}) {
  // inject token from localStorage if present
  const token = localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers ? (options.headers as Record<string, string>) : {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", // send cookies too
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // normalize unauthorized message
    if (res.status === 401) throw new Error(err.message || "Unauthorized");
    throw new Error(err.message || "API error");
  }

  return res.json();
}
