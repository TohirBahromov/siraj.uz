import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fetchStaffMembers } from "@/api/staff-api";
import { AboutUsClient } from "@/components/pages/about-us/AboutUsClient";

export const dynamic = "force-dynamic";

export default async function AboutUsPage({ params }: PageProps<"/[lang]/about-us">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const [dict, staff] = await Promise.all([
    getDictionary(locale),
    fetchStaffMembers(locale),
  ]);

  return <AboutUsClient d={dict.aboutUs} staff={staff} />;
}
