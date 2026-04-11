"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/api/admin-api";
import { hasLocale } from "@/i18n/config";
import { CheckCheck, Trash, MessageSquare } from "lucide-react";

interface ContactSubmission {
  id: number;
  name: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface PaginatedResponse {
  items: ContactSubmission[];
  meta: { total: number; page: number; lastPage: number };
}

export default function page() {
  const params = useParams<{ lang: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const lang = params.lang;

  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await adminFetch(`/contact?page=${currentPage}&limit=15`);
    if (!res.ok) {
      setError("Xabarlarni yuklab bo'lmadi");
      return;
    }
    const result = await res.json();
    setData(result);
  }, [currentPage]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRead(id: number) {
    await adminFetch(`/contact/${id}/read`, { method: "PATCH" });
    load();
  }

  const handlePageChange = (newPage: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", newPage.toString());
    router.push(`?${current.toString()}`);
  };

  if (!data)
    return <p className="animate-pulse text-black/50">Yuklanmoqda...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Xabarlar</h1>
        <div className="text-sm text-black/40">Jami: {data.meta.total}</div>
      </div>

      <div className="rounded-xl border border-black/10 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-max text-sm text-left">
          <thead className="bg-black/2 text-black/50 font-medium border-b border-black/10">
            <tr>
              <th className="px-4 py-3">F.I.SH</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3 w-1/3">Xabar</th>
              <th className="px-4 py-3">Sana</th>
              <th className="px-4 py-3 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-black/30">
                  Xabarlar mavjud emas
                </td>
              </tr>
            ) : (
              data.items.map((m) => (
                <tr
                  key={m.id}
                  className={`hover:bg-black/1 transition-colors ${!m.isRead ? "bg-indigo-50/30" : ""}`}
                >
                  <td className="px-4 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      {!m.isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                      {m.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-black/60">{m.phone}</td>
                  <td className="px-4 py-4 text-black/60 italic">
                    "{m.message}"
                  </td>
                  <td className="px-4 py-4 text-black/40 text-xs">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      {!m.isRead && (
                        <button
                          onClick={() => toggleRead(m.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          <CheckCheck size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-4 border-t border-black/10 flex items-center justify-between bg-black/1">
          <button
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-black/10 disabled:opacity-30 bg-white"
          >
            Oldingi
          </button>
          <span className="text-sm text-black/50">
            Sahifa {currentPage} / {data.meta.lastPage}
          </span>
          <button
            disabled={currentPage >= data.meta.lastPage}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-black/10 disabled:opacity-30 bg-white"
          >
            Keyingi
          </button>
        </div>
      </div>
    </div>
  );
}
