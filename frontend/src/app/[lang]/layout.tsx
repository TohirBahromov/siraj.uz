import { notFound } from "next/navigation";
import { hasLocale, LOCALES } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { DictionaryProvider } from "@/i18n/context";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return <DictionaryProvider dict={dict}>{children}</DictionaryProvider>;
}
