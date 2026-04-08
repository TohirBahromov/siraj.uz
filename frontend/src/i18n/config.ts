export const LOCALES = ["en", "uz", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "uz";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  uz: "UZ",
  ru: "RU",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  uz: "O'zbek",
  ru: "Русский",
};

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
