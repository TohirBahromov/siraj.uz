import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/i18n/config";

// The proxy handles locale redirection for real traffic.
// This file covers the static-export / direct-root-access edge case.
export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
