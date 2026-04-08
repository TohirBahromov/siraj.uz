"use client";

import { useSidebar } from "@/store/admin/sidebar";

const SidebarBackdrop = () => {
  const { isOpen, close } = useSidebar();
  return (
    isOpen && (
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 z-15 bg-[#0000002c] block md:hidden`}
        onClick={close}
      ></div>
    )
  );
};

export default SidebarBackdrop;
