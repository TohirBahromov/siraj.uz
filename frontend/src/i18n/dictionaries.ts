import "server-only";
import type { Locale } from "./config";

// Dynamic imports keep each language bundle out of the others' chunks
const loaders = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  uz: () => import("@/dictionaries/uz.json").then((m) => m.default),
  ru: () => import("@/dictionaries/ru.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof loaders)["uz"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}
