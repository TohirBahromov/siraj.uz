"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid, ChevronRight, ChevronDown } from "lucide-react";
import { NAV_ITEMS } from "@/data/navigation";
import { useScrollY } from "@/hooks/useScrollY";
import { useDict } from "@/i18n/context";
import { LOCALES, LOCALE_LABELS, LOCALE_NAMES, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { fetchCategoryTreeClient } from "@/api/categories-client";
import type { PublicCategoryNode } from "@/types/category";

type NavbarProps = { lang: Locale };

function useIsHomePage(lang: Locale): boolean {
  const pathname = usePathname();
  return pathname === `/${lang}` || pathname === `/${lang}/`;
}

function LangSwitcher({ currentLang, isScrolled }: { currentLang: Locale; isScrolled: boolean }) {
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
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors",
          isScrolled ? "text-[#1d1d1f]/70 hover:text-[#1d1d1f]" : "text-white/80 hover:text-white",
        )}
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
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 min-w-35 rounded-xl bg-white shadow-xl border border-black/10 overflow-hidden">
            {LOCALES.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLocale(locale)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50",
                  locale === currentLang
                    ? "text-indigo-600 font-semibold"
                    : "text-[#1d1d1f]",
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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = useIsHomePage(lang);
  const isScrolled = !isHome || scrollY > 20;

  // ── Catalogue state (shared desktop + mobile) ──────────────────────────────
  const [catOpen, setCatOpen] = useState(false);
  const [categories, setCategories] = useState<PublicCategoryNode[]>([]);
  const [catsLoaded, setCatsLoaded] = useState(false);
  const [activeRootId, setActiveRootId] = useState<number | null>(null);

  // Mobile catalogue view
  const [mobileCatExpanded, setMobileCatExpanded] = useState(false);
  const [mobileCatRoot, setMobileCatRoot] = useState<PublicCategoryNode | null>(null);

  const activeRoot = categories.find((c) => c.id === activeRootId) ?? null;

  // Lazy-load categories on first open
  const loadCats = () => {
    if (catsLoaded) return;
    fetchCategoryTreeClient(lang).then((cats) => {
      setCategories(cats);
      setActiveRootId(cats[0]?.id ?? null);
      setCatsLoaded(true);
    });
  };

  const closeCatalogue = () => setCatOpen(false);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileCatExpanded(false);
    setMobileCatRoot(null);
  };

  // Close desktop catalogue on ESC
  useEffect(() => {
    if (!catOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCatalogue();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [catOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-black/10 shadow-sm"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Left: Logo + Catalogue */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Logo */}
          <Link href={`/${lang}`} className="hover:opacity-70 transition-opacity">
            <Image
              src="/siraj-logo.png"
              alt="Siraj"
              width={140}
              height={44}
              className={cn(
                "h-11 w-auto object-contain transition-all duration-300",
                isScrolled ? "brightness-0" : "brightness-0 invert",
              )}
              priority
            />
          </Link>

          {/* Catalogue button — desktop only */}
          <button
            onClick={() => {
              setCatOpen((o) => !o);
              loadCats();
            }}
            aria-expanded={catOpen}
            className={cn(
              "hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
              isScrolled
                ? catOpen
                  ? "bg-[#1d1d1f] text-white border-transparent"
                  : "border-black/15 text-[#1d1d1f]/70 hover:text-[#1d1d1f] hover:border-black/30 bg-white"
                : catOpen
                  ? "bg-white text-[#1d1d1f] border-transparent"
                  : "border-white/30 text-white/80 hover:text-white hover:border-white/60 bg-transparent",
            )}
          >
            <LayoutGrid size={15} />
            {dict.nav.catalogue}
            <ChevronDown
              size={14}
              className={cn("transition-transform duration-200", catOpen && "rotate-180")}
            />
          </button>
        </div>

        {/* Center: Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={`/${lang}${item.href}`}
                className={cn(
                  "text-sm transition-colors duration-200",
                  isScrolled
                    ? "text-[#1d1d1f]/70 hover:text-[#1d1d1f]"
                    : "text-white/80 hover:text-white",
                )}
              >
                {dict.nav[item.key]}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: LangSwitcher + mobile hamburger */}
        <div className="flex items-center gap-4">
          <LangSwitcher currentLang={lang} isScrolled={isScrolled} />

          <button
            className={cn(
              "lg:hidden transition-colors",
              isScrolled
                ? "text-[#1d1d1f]/60 hover:text-[#1d1d1f]"
                : "text-white/70 hover:text-white",
            )}
            aria-label="Open menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
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

      {/* ── Desktop Catalogue Panel ─────────────────────────────────────────── */}
      {catOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={closeCatalogue} />

          {/* Full-width panel — positioned below the 64px navbar bar */}
          <div className="fixed top-16 inset-x-0 z-50 hidden lg:flex bg-white shadow-2xl border-t border-black/10 max-h-[600px]">
            {/* Left sidebar: root categories (~240px) */}
            <div className="w-60 shrink-0 border-r border-black/8 overflow-y-auto">
              {!catsLoaded ? (
                <div className="p-4 space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 rounded-lg bg-black/5 animate-pulse" />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <p className="p-4 text-sm text-black/30">No categories yet.</p>
              ) : (
                <>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setActiveRootId(cat.id)}
                      onClick={() => {
                        if (cat.children.length === 0) {
                          router.push(`/${lang}/categories/${cat.slug}`);
                          closeCatalogue();
                        } else {
                          setActiveRootId(cat.id);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-5 py-3.5 text-sm text-left transition-colors",
                        cat.id === activeRootId
                          ? "bg-black/5 text-[#1d1d1f] font-medium"
                          : "text-[#1d1d1f]/60 hover:bg-black/3 hover:text-[#1d1d1f]",
                      )}
                    >
                      {cat.imgUrl && (
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black/5 shrink-0">
                          <Image
                            src={cat.imgUrl}
                            alt={cat.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="flex-1 truncate">{cat.name}</span>
                      {cat.children.length > 0 && (
                        <ChevronRight size={14} className="shrink-0 text-black/25" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-black/8 mt-1">
                    <Link
                      href={`/${lang}/categories`}
                      onClick={closeCatalogue}
                      className="flex items-center gap-2 px-5 py-3 text-sm text-[#1d1d1f]/50 hover:text-[#1d1d1f] hover:bg-black/3 transition-colors"
                    >
                      View all →
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Right: subcategories of hovered root */}
            <div className="flex-1 overflow-y-auto min-w-0 p-8">
              {activeRoot ? (
                activeRoot.children.length > 0 ? (
                  <>
                    <Link
                      href={`/${lang}/categories/${activeRoot.slug}`}
                      onClick={closeCatalogue}
                      className="inline-block mb-5 text-xs font-semibold uppercase tracking-wider text-black/40 hover:text-black/60 transition-colors"
                    >
                      {activeRoot.name} →
                    </Link>
                    <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
                      {activeRoot.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/${lang}/categories/${child.slug}`}
                          onClick={closeCatalogue}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/4 transition-colors group"
                        >
                          {child.imgUrl && (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black/5 shrink-0">
                              <Image
                                src={child.imgUrl}
                                alt={child.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="text-sm text-[#1d1d1f]/70 group-hover:text-[#1d1d1f] line-clamp-2 leading-snug">
                            {child.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Link
                      href={`/${lang}/categories/${activeRoot.slug}`}
                      onClick={closeCatalogue}
                      className="text-sm text-[#1d1d1f]/50 hover:text-[#1d1d1f] transition-colors"
                    >
                      View all {activeRoot.name} →
                    </Link>
                  </div>
                )
              ) : (
                <p className="text-sm text-black/25">Hover a category to see subcategories.</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Mobile menu ─────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-black/10">
          {/* Catalogue section */}
          <div className="border-b border-black/8">
            {mobileCatRoot ? (
              /* Sub-view: subcategories of selected root */
              <div className="pb-3">
                <button
                  onClick={() => setMobileCatRoot(null)}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors w-full"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back
                </button>
                <div className="px-6 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-black/30 mb-2">
                    {mobileCatRoot.name}
                  </p>
                  {mobileCatRoot.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/${lang}/categories/${child.slug}`}
                      onClick={closeMobile}
                      className="flex items-center gap-3 py-2.5 text-sm text-[#1d1d1f]/70 hover:text-[#1d1d1f] transition-colors"
                    >
                      {child.imgUrl && (
                        <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-black/5 shrink-0">
                          <Image
                            src={child.imgUrl}
                            alt={child.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              /* Root view */
              <>
                <button
                  onClick={() => {
                    setMobileCatExpanded((o) => !o);
                    if (!mobileCatExpanded) loadCats();
                  }}
                  className="flex items-center justify-between w-full px-6 py-3.5 text-base font-medium text-[#1d1d1f]"
                >
                  <div className="flex items-center gap-2">
                    <LayoutGrid size={16} className="text-black/50" />
                    {dict.nav.catalogue}
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-black/30 transition-transform duration-200",
                      mobileCatExpanded && "rotate-180",
                    )}
                  />
                </button>

                {mobileCatExpanded && (
                  <div className="px-6 pb-3 space-y-0.5">
                    {!catsLoaded ? (
                      <div className="py-2 text-sm text-black/30 animate-pulse">Loading…</div>
                    ) : (
                      <>
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              if (cat.children.length > 0) {
                                setMobileCatRoot(cat);
                              } else {
                                router.push(`/${lang}/categories/${cat.slug}`);
                                closeMobile();
                              }
                            }}
                            className="flex items-center justify-between w-full py-2.5 text-sm text-[#1d1d1f]/70 hover:text-[#1d1d1f] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {cat.imgUrl && (
                                <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-black/5 shrink-0">
                                  <Image
                                    src={cat.imgUrl}
                                    alt={cat.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              {cat.name}
                            </div>
                            {cat.children.length > 0 && (
                              <ChevronRight size={14} className="text-black/25 shrink-0" />
                            )}
                          </button>
                        ))}
                        <Link
                          href={`/${lang}/categories`}
                          onClick={closeMobile}
                          className="block pt-2 text-sm text-[#1d1d1f]/40 hover:text-[#1d1d1f] transition-colors"
                        >
                          View all →
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Nav links */}
          <ul className="px-6 py-4 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${lang}${item.href}`}
                  className="text-[#1d1d1f]/70 hover:text-[#1d1d1f] text-base transition-colors"
                  onClick={closeMobile}
                >
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>

          {/* Language switcher */}
          <div className="px-6 pb-4 border-t border-black/10 pt-4 flex gap-3">
            {LOCALES.map((locale) => (
              <Link
                key={locale}
                href={`/${locale}`}
                className={cn(
                  "text-sm font-medium px-3 py-1 rounded-full transition-colors",
                  locale === lang
                    ? "bg-indigo-600 text-white"
                    : "bg-black/5 text-[#1d1d1f] hover:bg-black/10",
                )}
                onClick={closeMobile}
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
