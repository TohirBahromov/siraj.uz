"use client";

import { StaffForm } from "@/components/admin/StaffForm";

export default function NewStaffMemberPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        New staff member
      </h1>
      <StaffForm mode="create" />
    </div>
  );
}
