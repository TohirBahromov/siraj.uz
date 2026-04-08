const defaultBase = "http://localhost:4000/api";

export function getAdminApiBase(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? defaultBase;
  }
  return process.env.NEXT_PUBLIC_API_URL ?? defaultBase;
}

export const ADMIN_TOKEN_KEY = "siraj_admin_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setStoredToken(token: string) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearStoredToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function adminFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(init.headers);
  if (
    init.body &&
    typeof init.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const base = getAdminApiBase().replace(/\/$/, "");
  const url = path.startsWith("http") ? path : `${base}${path}`;
  return fetch(url, { ...init, headers });
}
