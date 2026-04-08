"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { getStoredToken } from "@/api/admin-api";
import { hasLocale, Locale } from "@/i18n/config";
import Sidebar from "@/components/admin/Sidebar";
import Toolbar from "@/components/admin/Toolbar";
import SidebarBackdrop from "@/components/admin/SidebarBackdrop";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang } = useParams<{ lang: Locale }>();
  const pathname = usePathname();
  const router = useRouter();

  const localeOk = typeof lang === "string" && hasLocale(lang);
  const base = useMemo(
    () => (localeOk ? `/${lang}/admin` : "/en/admin"),
    [lang, localeOk],
  );

  const isLogin = pathname === `${base}/login`;

  useEffect(() => {
    if (!localeOk) return;
    if (isLogin) return;
    if (!getStoredToken()) router.replace(`${base}/login`);
  }, [base, isLogin, localeOk, router]);

  if (!localeOk) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
          <p className="text-sm text-black/40 font-medium">Initializing...</p>
        </div>
      </div>
    );
  }

  if (isLogin) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex">
      <Sidebar base={base} />
      <div className="flex flex-col w-full flex-1">
        <Toolbar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="w-full mx-auto px-4 py-8 md:py-10">{children}</div>
        </main>
      </div>

      {/* backdrop */}
      <SidebarBackdrop />
    </div>
  );
}
