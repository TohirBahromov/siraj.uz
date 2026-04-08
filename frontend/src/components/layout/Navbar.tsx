"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS } from "@/data/navigation";
import { useScrollY } from "@/hooks/useScrollY";
import { useDict } from "@/i18n/context";
import { LOCALES, LOCALE_LABELS, LOCALE_NAMES, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type NavbarProps = { lang: Locale };

function LangSwitcher({ currentLang }: { currentLang: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (next: Locale) => {
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch language"
        aria-expanded={open}
        className="flex items-center gap-1 text-sm font-medium transition-colors text-white/80 hover:text-white"
      >
        {LOCALE_LABELS[currentLang]}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[140px] rounded-xl bg-white shadow-xl border border-black/10 overflow-hidden">
            {LOCALES.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLocale(locale)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50",
                  locale === currentLang
                    ? "text-indigo-600 font-semibold"
                    : "text-[#1d1d1f]"
                )}
              >
                <span className="font-mono text-xs w-5 text-center font-bold text-[#1d1d1f]/40">
                  {LOCALE_LABELS[locale]}
                </span>
                <span>{LOCALE_NAMES[locale]}</span>
                {locale === currentLang && (
                  <svg className="ml-auto w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function Navbar({ lang }: NavbarProps) {
  const scrollY = useScrollY();
  const dict = useDict();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isScrolled = scrollY > 20;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-black/10 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="hover:opacity-70 transition-opacity"
        >
          <Image
            src="/siraj-logo.png"
            alt="Siraj"
            width={140}
            height={44}
            className={cn(
              "h-11 w-auto object-contain transition-all duration-300",
              isScrolled ? "brightness-0" : "brightness-0 invert"
            )}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={`/${lang}${item.href}`}
                className={cn(
                  "text-sm transition-colors duration-200",
                  isScrolled
                    ? "text-[#1d1d1f]/70 hover:text-[#1d1d1f]"
                    : "text-white/80 hover:text-white"
                )}
              >
                {dict.nav[item.key]}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Language switcher — always visible, styled for current scroll state */}
          <div className={cn(isScrolled ? "[&_button]:!text-[#1d1d1f]/70 [&_button:hover]:!text-[#1d1d1f]" : "")}>
            <LangSwitcher currentLang={lang} />
          </div>

          {/* Mobile hamburger */}
          <button
            className={cn(
              "lg:hidden transition-colors",
              isScrolled
                ? "text-[#1d1d1f]/60 hover:text-[#1d1d1f]"
                : "text-white/70 hover:text-white"
            )}
            aria-label="Open menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              {mobileOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-black/10">
          <ul className="px-6 py-4 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${lang}${item.href}`}
                  className="text-[#1d1d1f]/70 hover:text-[#1d1d1f] text-base transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          {/* Language switcher in mobile menu */}
          <div className="px-6 pb-4 border-t border-black/10 pt-4 flex gap-3">
            {LOCALES.map((locale) => (
              <Link
                key={locale}
                href={`/${locale}`}
                className={cn(
                  "text-sm font-medium px-3 py-1 rounded-full transition-colors",
                  locale === lang
                    ? "bg-indigo-600 text-white"
                    : "bg-black/5 text-[#1d1d1f] hover:bg-black/10"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {LOCALE_LABELS[locale]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
