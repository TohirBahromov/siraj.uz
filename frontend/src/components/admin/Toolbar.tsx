"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/store/admin/sidebar";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";

const Toolbar = () => {
  const { toggle } = useSidebar();
  const { lang } = useParams<{ lang: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);

  const currentLang = (LOCALES.includes(lang as Locale) ? lang : "en") as Locale;

  const switchLocale = (next: Locale) => {
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
    setLangOpen(false);
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-black/10 px-4 py-3 w-full shrink-0">
      {/* Sidebar toggle — always visible */}
      <button
        onClick={toggle}
        className="p-2 rounded-xl text-black/50 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Language switcher */}
      <div className="relative">
        <button
          onClick={() => setLangOpen((o) => !o)}
          aria-label="Switch language"
          className="flex items-center gap-1.5 text-sm font-medium text-black/60 hover:text-black transition-colors px-3 py-1.5 rounded-xl hover:bg-black/5"
        >
          {LOCALE_LABELS[currentLang]}
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {langOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden min-w-27.5">
              {LOCALES.map((locale) => (
                <button
                  key={locale}
                  onClick={() => switchLocale(locale)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    locale === currentLang
                      ? "bg-black text-white font-medium"
                      : "text-black/70 hover:bg-black/5"
                  }`}
                >
                  {LOCALE_LABELS[locale]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Toolbar;
