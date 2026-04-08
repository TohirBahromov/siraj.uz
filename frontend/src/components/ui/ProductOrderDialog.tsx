"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { PatternFormat } from "react-number-format";

interface Props {
  productId: number;
  productTitle: string;
  btn2Color: string;
  btn2BgColor: string;
  onClose: () => void;
}

export function ProductOrderDialog({
  productId,
  productTitle,
  btn2Color,
  btn2BgColor,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  // Lock scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
      const res = await fetch(`${apiBase}/product-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name: name.trim(),
          phone: phone.trim(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Blackish overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-black/40 mb-1">
              Buy
            </p>
            <h2 className="text-xl font-bold text-black leading-snug">
              {productTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 transition-colors text-black/40 hover:text-black mt-0.5 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-black/8 mx-6" />

        {success ? (
          <div className="px-6 py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-base font-semibold text-black mb-1">
              Request received!
            </p>
            <p className="text-sm text-black/50">We'll contact you shortly.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-black text-white text-sm font-medium px-8 py-2.5 hover:bg-black/85 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Name */}
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-black/70">Full Name</span>
              <input
                ref={nameRef}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="rounded-2xl border border-black/15 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/20 transition"
              />
            </label>

            {/* Phone */}
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-black/70">Phone Number</span>
              <PatternFormat
                type="tel"
                format="+998 ## ###-##-##"
                allowEmptyFormatting
                required
                mask="_"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-2xl border border-black/15 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/20 transition"
              />
            </label>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ color: btn2Color, backgroundColor: btn2BgColor }}
              className="w-full rounded-full py-3.5 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer mt-1"
            >
              {loading ? "Sending…" : "Send Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
