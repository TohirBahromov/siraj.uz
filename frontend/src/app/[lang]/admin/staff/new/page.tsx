"use client";

import { useDict } from "@/i18n/context";
import { StaffForm } from "@/components/admin/StaffForm";

export default function NewStaffMemberPage() {
  const dict = useDict();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        {dict.admin.staff.newTitle}
      </h1>
      <StaffForm mode="create" />
    </div>
  );
}
