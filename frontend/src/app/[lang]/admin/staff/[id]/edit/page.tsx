"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/api/admin-api";
import { StaffForm, type AdminStaffMember } from "@/components/admin/StaffForm";

export default function EditStaffMemberPage() {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const router = useRouter();
  const listHref =
    typeof lang === "string" ? `/${lang}/admin/staff` : "/en/admin/staff";

  const [member, setMember] = useState<AdminStaffMember | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setError(null);
    const res = await adminFetch(`/admin/staff-members/${id}`);
    if (!res.ok) {
      setError("Staff member not found");
      return;
    }
    setMember((await res.json()) as AdminStaffMember);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          type="button"
          onClick={() => router.push(listHref)}
          className="text-sm underline"
        >
          Back to list
        </button>
      </div>
    );
  }

  if (!member) {
    return <p className="text-black/50 text-sm animate-pulse">Loading…</p>;
  }

  const displayName =
    member.translations.find((t) => t.locale === "en")?.name ??
    member.translations[0]?.name ??
    `#${member.id}`;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        Edit · {displayName}
      </h1>
      <StaffForm mode="edit" staffId={member.id} initial={member} />
    </div>
  );
}
