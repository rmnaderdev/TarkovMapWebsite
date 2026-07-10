"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Maps } from "@/data/maps";
import { useSidebar } from "@/context/SidebarContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

export default function SideBar() {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();
  const asideRef = useRef<HTMLElement>(null);

  useOnClickOutside(asideRef, closeSidebar);

  const isActive = (href: string) => pathname === href;

  const linkClass = (href: string) =>
    `flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-rust-400 ${
      isActive(href) ? "text-white" : "text-gray-300"
    }`;

  return (
    <aside
      ref={asideRef}
      className={`fixed left-0 top-0 z-20 flex h-screen w-72 flex-col overflow-y-hidden bg-base-900 border-r border-olive-700 duration-300 ease-linear md:static md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between text-white gap-2 px-6 py-6 md:hidden">
        <button className="block ml-auto" onClick={closeSidebar} aria-label="Close sidebar">
          <svg
            className="fill-current text-rust-400"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* SIDEBAR HEADER */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Sidebar Menu */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <ul className="mb-6 flex flex-col gap-1.5">
            <li>
              <Link className={linkClass("/")} href="/">
                Home
              </Link>
            </li>

            {Maps.map((map) => (
              <li key={map.name}>
                <Link className={linkClass(map.link)} href={map.link}>
                  {map.navLinkName || map.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
