"use client";

import { IconMenu2 } from "@tabler/icons-react";
import { useSidebar } from "@/context/SidebarContext";

export default function HeaderBar() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex w-full bg-base-900 border-b border-olive-700 drop-shadow-1 duration-300 ease-linear md:hidden">
      <div className="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={toggleSidebar} aria-label="Toggle sidebar">
            <IconMenu2 stroke={2} className="w-8 h-8 text-rust-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
