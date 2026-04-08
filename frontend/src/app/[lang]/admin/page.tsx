import { redirect } from "next/navigation";

export default async function AdminIndexPage({
  params,
}: PageProps<"/[lang]/admin">) {
  const { lang } = await params;
  redirect(`/${lang}/admin/products`);
}
