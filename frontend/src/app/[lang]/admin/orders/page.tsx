"use client";

import { Suspense } from "react";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { adminFetch } from "@/api/admin-api";
import { useDict } from "@/i18n/context";

interface OrderItem {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
  productId: number;
  productName: string;
}

interface PaginatedResponse {
  items: OrderItem[];
  meta: { total: number; page: number; lastPage: number };
}

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dict = useDict();
  const d = dict.admin;
  const currentPage = Number(searchParams.get("page")) || 1;

  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await adminFetch(
      `/product-orders/admin?page=${currentPage}&limit=20`,
    );
    if (!res.ok) {
      setError(`${d.orders.loadError} (${res.status})`);
      return;
    }
    setData(await res.json());
  }, [currentPage, d.orders.loadError]);

  useEffect(() => {
    load();
  }, [load]);

  function handlePageChange(newPage: number) {
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    p.set("page", String(newPage));
    router.push(`?${p.toString()}`);
  }

  if (!data)
    return (
      <p className="animate-pulse text-black/50 text-sm">{d.common.loading}</p>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {d.orders.title}
        </h1>
        <span className="text-sm text-black/40">{d.common.total} {data.meta.total}</span>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <div className="rounded-2xl border border-black/10 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-max text-sm text-left">
          <thead className="bg-black/3 text-black/50 font-medium border-b border-black/10">
            <tr>
              <th className="px-4 py-3">{d.orders.colId}</th>
              <th className="px-4 py-3">{d.orders.colName}</th>
              <th className="px-4 py-3">{d.orders.colPhone}</th>
              <th className="px-4 py-3">{d.orders.colProduct}</th>
              <th className="px-4 py-3">{d.orders.colDate}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {data.items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-16 text-center text-black/30"
                >
                  {d.orders.empty}
                </td>
              </tr>
            ) : (
              data.items.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-black/2 transition-colors"
                >
                  <td className="px-4 py-3 text-black/30 tabular-nums">
                    {o.id}
                  </td>
                  <td className="px-4 py-3 font-medium">{o.name}</td>
                  <td className="px-4 py-3 text-black/60">{o.phone}</td>
                  <td className="px-4 py-3 text-black/60">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-black/30 text-xs">
                        #{o.productId}
                      </span>
                      {o.productName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-black/40 text-xs tabular-nums">
                    {new Date(o.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

        {data.meta.lastPage > 1 && (
          <div className="px-4 py-4 border-t border-black/10 flex items-center justify-between bg-black/1">
            <button
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-black/10 disabled:opacity-30 bg-white hover:bg-black/5 transition-colors"
            >
              {d.common.previous}
            </button>
            <span className="text-sm text-black/50">
              {d.common.page} {currentPage} / {data.meta.lastPage}
            </span>
            <button
              disabled={currentPage >= data.meta.lastPage}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-black/10 disabled:opacity-30 bg-white hover:bg-black/5 transition-colors"
            >
              {d.common.next}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense>
      <AdminOrdersContent />
    </Suspense>
  );
}
