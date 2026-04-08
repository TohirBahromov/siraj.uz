import "server-only";

export interface StaffMember {
  id: number;
  imageUrl: string;
  name: string;
  position: string;
}

function getApiBase(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api"
  );
}

export async function fetchStaffMembers(locale: string): Promise<StaffMember[]> {
  const base = getApiBase();
  const url = `${base}/staff-members?locale=${encodeURIComponent(locale)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Failed to load staff members: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<StaffMember[]>;
}
