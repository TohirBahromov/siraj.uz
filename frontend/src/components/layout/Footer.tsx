"use client";

import Link from "next/link";
import { FOOTER_COLUMNS } from "@/data/navigation";
import { Container } from "@/components/ui/Container";
import { useDict } from "@/i18n/context";

export function Footer() {
  const dict = useDict();

  return (
    <footer className="bg-[#f5f5f7] border-t border-black/10 text-[#1d1d1f]/60">
      <Container className="py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.headingKey}>
              <p className="mb-4 text-sm font-semibold text-[#1d1d1f]">
                {dict.footer.columns[col.headingKey]}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-[#1d1d1f] transition-colors duration-200"
                    >
                      {dict.footer.links[link.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-black/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Siraj Technologies, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {(["privacy", "terms", "cookies"] as const).map((key) => (
              <Link
                key={key}
                href="#"
                className="text-xs hover:text-[#1d1d1f] transition-colors duration-200"
              >
                {dict.footer[key]}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
