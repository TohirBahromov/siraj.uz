"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/api/admin-api";
import { hasLocale } from "@/i18n/config";
import { useDict } from "@/i18n/context";
import { Edit, Trash } from "lucide-react";

interface StaffTranslation {
  locale: string;
  name: string;
  position: string;
}

interface AdminStaffMember {
  id: number;
  imageUrl: string;
  order: number;
  translations: StaffTranslation[];
}

interface PaginatedResponse {
  items: AdminStaffMember[];
  meta: { total: number; page: number; lastPage: number };
}

const LIMIT = 15;

function AdminStaffContent() {
  const params = useParams<{ lang: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dict = useDict();
  const lang = params.lang;

  const base = useMemo(
    () =>
      typeof lang === "string" && hasLocale(lang)
        ? `/${lang}/admin`
        : "/en/admin",
    [lang],
  );

  const currentPage = Number(searchParams.get("page")) || 1;

  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await adminFetch(
      `/admin/staff-members?page=${currentPage}&limit=${LIMIT}`,
    );
    if (!res.ok) {
      setError(`${dict.admin.staff.colName} (${res.status})`);
      return;
    }
    setData(await res.json());
  }, [currentPage, dict.admin.staff.colName]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: number) {
    if (!confirm(dict.admin.staff.deleteConfirm)) return;
    const res = await adminFetch(`/admin/staff-members/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      alert(dict.admin.common.deleteFailed);
      return;
    }
    load();
  }

  function handlePageChange(newPage: number) {
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    p.set("page", String(newPage));
    router.push(`?${p.toString()}`);
  }

  function tr(member: AdminStaffMember) {
    return (
      member.translations.find((t) => t.locale === lang) ??
      member.translations.find((t) => t.locale === "en") ??
      member.translations[0]
    );
  }

  if (!data)
    return (
      <p className="text-black/50 text-sm animate-pulse">
        {dict.admin.staff.loadingMembers}
      </p>
    );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {dict.admin.sidebar.staff}
          </h1>
          <p className="text-sm text-black/40 mt-0.5">
            {dict.admin.common.total} {data.meta?.total || 0}
          </p>
        </div>
        <Link
          href={`${base}/staff/new`}
          className="rounded-full bg-[#1d1d1f] text-white text-sm px-5 py-2.5 font-medium hover:bg-black/85 whitespace-nowrap"
        >
          {dict.admin.staff.newTitle}
        </Link>
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
              <th className="px-4 py-3 w-16">{dict.admin.orders.colId}</th>
              <th className="px-4 py-3 w-20">{dict.admin.staff.colPhoto}</th>
              <th className="px-4 py-3">{dict.admin.staff.colName}</th>
              <th className="px-4 py-3">{dict.admin.staff.colPosition}</th>
              <th className="px-4 py-3 w-20 text-center">{dict.admin.staff.colOrder}</th>
              <th className="px-4 py-3 w-28" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {data.items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-16 text-center text-black/30"
                >
                  {dict.admin.staff.empty}
                </td>
              </tr>
            ) : (
              data.items.map((member) => {
                const t = tr(member);
                return (
                  <tr
                    key={member.id}
                    className="hover:bg-black/1.5 transition-colors"
                  >
                    <td className="px-4 py-3 text-black/30 tabular-nums">
                      {member.id}
                    </td>
                    <td className="p-2">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#f5f5f7]">
                        <Image
                          src={member.imageUrl}
                          alt={t?.name ?? ""}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{t?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-black/60">
                      {t?.position ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-black/40 tabular-nums">
                      {member.order}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`${base}/staff/${member.id}/edit`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>

        {data.meta?.lastPage > 1 && (
          <div className="px-4 py-4 border-t border-black/10 flex items-center justify-between bg-black/1">
            <button
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-black/10 disabled:opacity-30 bg-white hover:bg-black/5 transition-colors"
            >
              {dict.admin.common.previous}
            </button>
            <span className="text-sm text-black/50">
              {dict.admin.common.page} {currentPage} / {data.meta.lastPage}
            </span>
            <button
              disabled={currentPage >= data.meta.lastPage}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-black/10 disabled:opacity-30 bg-white hover:bg-black/5 transition-colors"
            >
              {dict.admin.common.next}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminStaffPage() {
  return (
    <Suspense>
      <AdminStaffContent />
    </Suspense>
  );
}
