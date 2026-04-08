import { Locale } from "@/i18n/config";
import { useDict } from "@/i18n/context";
import { clearStoredToken } from "@/api/admin-api";
import { useSidebar } from "@/store/admin/sidebar";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Building2,
  Globe,
  Images,
  Laptop,
  LogOut,
  Mail,
  PackageCheck,
  PanelLeftOpen,
  ShoppingCart,
  Users,
} from "lucide-react";

interface Props {
  base: string;
}

const Sidebar = ({ base }: Props) => {
  const { lang } = useParams<{ lang: Locale }>();
  const router = useRouter();
  const pathname = usePathname();
  const dict = useDict();
  const { isOpen, toggle: toggleSidebar } = useSidebar();

  const d = dict.admin.sidebar;

  function logout() {
    clearStoredToken();
    router.replace(`${base}/login`);
  }

  return (
    <aside
      className={`duration-500 border-r border-black/10 bg-white md:min-h-screen ${isOpen ? "w-64" : "w-18!"} md:w-64 flex flex-col pt-6 md:pb-6 shrink-0 fixed top-0 bottom-0 ${isOpen ? "left-0 md:left-0" : "-left-full md:left-0"} right-0 md:relative z-20`}
    >
      <button
        className="absolute top-12 -right-2 bg-white p-1 rounded-md shadow-sm cursor-pointer hidden md:block"
        onClick={toggleSidebar}
      >
        <div className={`duration-500 ${isOpen ? "-scale-x-100" : ""}`}>
          <PanelLeftOpen size={18} />
        </div>
      </button>

      <div className="px-6 mb-8">
        <Link
          href={`${base}/products`}
          className="text-xl font-semibold tracking-tight flex items-center gap-2"
        >
          <Laptop className="shrink-0" />
          {isOpen && <span className="min-w-max">Siraj Admin</span>}
        </Link>
      </div>
      <nav className="flex-1 flex flex-col gap-2 px-4">
        <Link
          href={`${base}/products`}
          className={`p-2 rounded-xl text-sm transition-colors flex items-center ${isOpen ? "justify-start" : "justify-center"} gap-2 shrink-0! ${pathname.includes(`${base}/products`) ? "bg-black text-white font-medium" : "text-black/60 hover:bg-black/5 hover:text-black min-w-max"}`}
        >
          <ShoppingCart size={18} />
          {isOpen && d.products}
        </Link>
        <Link
          href={`${base}/hero`}
          className={`p-2 rounded-xl text-sm transition-colors flex items-center ${isOpen ? "justify-start" : "justify-center"} gap-2 shrink-0! ${pathname.includes(`${base}/hero`) ? "bg-black text-white font-medium" : "text-black/60 hover:bg-black/5 hover:text-black min-w-max"}`}
        >
          <Images size={18} />
          {isOpen && d.heroSlides}
        </Link>
        <Link
          href={`${base}/company`}
          className={`p-2 rounded-xl text-sm transition-colors flex items-center ${isOpen ? "justify-start" : "justify-center"} gap-2 shrink-0! ${pathname.includes(`${base}/company`) ? "bg-black text-white font-medium" : "text-black/60 hover:bg-black/5 hover:text-black min-w-max"}`}
        >
          <Building2 size={18} />
          {isOpen && d.company}
        </Link>
        <Link
          href={`${base}/enquiries`}
          className={`p-2 rounded-xl text-sm transition-colors flex items-center ${isOpen ? "justify-start" : "justify-center"} gap-2 shrink-0! ${pathname.includes(`${base}/enquiries`) ? "bg-black text-white font-medium" : "text-black/60 hover:bg-black/5 hover:text-black min-w-max"}`}
        >
          <Mail size={18} />
          {isOpen && d.messages}
        </Link>
        <Link
          href={`${base}/orders`}
          className={`p-2 rounded-xl text-sm transition-colors flex items-center ${isOpen ? "justify-start" : "justify-center"} gap-2 shrink-0! ${pathname.includes(`${base}/orders`) ? "bg-black text-white font-medium" : "text-black/60 hover:bg-black/5 hover:text-black min-w-max"}`}
        >
          <PackageCheck size={18} />
          {isOpen && d.orders}
        </Link>
        <Link
          href={`${base}/staff`}
          className={`p-2 rounded-xl text-sm transition-colors flex items-center ${isOpen ? "justify-start" : "justify-center"} gap-2 shrink-0! ${pathname.includes(`${base}/staff`) ? "bg-black text-white font-medium" : "text-black/60 hover:bg-black/5 hover:text-black min-w-max"}`}
        >
          <Users size={18} />
          {isOpen && d.staff}
        </Link>
      </nav>
      <div className="mt-8 px-4 pb-6 md:pb-0 border-t border-black/10 pt-6 flex flex-col gap-3">
        <Link
          href={`/${lang}`}
          className={`text-sm px-4 py-2 rounded-xl text-black/60 hover:bg-black/5 hover:text-black transition-colors text-center border border-black/10 flex items-center gap-2 ${isOpen ? "justify-start" : "justify-center"}`}
        >
          <Globe className="shrink-0!" size={18} />
          {isOpen && d.viewSite}
        </Link>
        <button
          type="button"
          onClick={logout}
          className={`text-sm px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full border border-red-200 flex items-center gap-2 cursor-pointer ${isOpen ? "justify-start" : "justify-center"}`}
        >
          <LogOut className="shrink-0!" size={18} />
          {isOpen && d.signOut}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
