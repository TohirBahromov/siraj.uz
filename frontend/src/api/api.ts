const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `Request failed: ${res.status}`);
  }

  const text = await res.text();
  if (!text) {
    return {} as T; // Return empty object if body is empty
  }

  try {
    return JSON.parse(text) as T;
  } catch (e) {
    throw new Error("Received invalid JSON from server");
  }
}
