"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { adminFetch, getStoredToken, setStoredToken } from "@/api/admin-api";
import { hasLocale } from "@/i18n/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams<{ lang: string }>();
  const lang = params.lang;
  const base = useMemo(
    () =>
      typeof lang === "string" && hasLocale(lang)
        ? `/${lang}/admin`
        : "/en/admin",
    [lang],
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getStoredToken()) router.replace(`${base}/products`);
  }, [base, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await adminFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => null)) as {
        accessToken?: string;
        message?: string | string[];
      } | null;
      if (!res.ok) {
        const msg = data?.message;
        setError(
          typeof msg === "string"
            ? msg
            : Array.isArray(msg)
              ? msg.join(", ")
              : "Sign in failed",
        );
        return;
      }
      if (!data?.accessToken) {
        setError("Invalid response from server");
        return;
      }
      setStoredToken(data.accessToken);
      router.replace(`${base}/products`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white border border-black/10 shadow-sm p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>
      <p className="mt-1 text-sm text-black/50">
        Use the credentials from your backend{" "}
        <code className="text-xs">.env</code>.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-black/70">Email</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-black/15 px-4 py-2.5 outline-none focus:ring-2 focus:ring-black/20"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-black/70">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border border-black/15 px-4 py-2.5 outline-none focus:ring-2 focus:ring-black/20"
          />
        </label>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-[#1d1d1f] text-white py-3 font-medium hover:bg-black/85 disabled:opacity-50 transition-colors"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
