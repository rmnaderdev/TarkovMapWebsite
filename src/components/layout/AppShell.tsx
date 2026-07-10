"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import SideBar from "./SideBar";
import HeaderBar from "./HeaderBar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <SideBar />

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <HeaderBar />

          <main className="flex flex-col flex-1 p-4 md:px-6 md:py-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
