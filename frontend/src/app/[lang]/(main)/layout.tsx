import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import type { Locale } from "@/i18n/config";

export default async function MainSiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <Navbar lang={lang as Locale} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
