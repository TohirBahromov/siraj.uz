import { useSidebar } from "@/store/admin/sidebar";
import { Menu } from "lucide-react";

const Toolbar = () => {
  const { toggle } = useSidebar();

  return (
    <div className="flex md:hidden items-center justify-end bg-white p-4 w-full">
      <button onClick={toggle}>
        <Menu />
      </button>
    </div>
  );
};

export default Toolbar;
