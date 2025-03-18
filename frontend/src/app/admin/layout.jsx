"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full relative">
        <header className="border-b h-14 flex items-center px-2 sticky top-0 bg-white z-10">
          <SidebarTrigger className={"hover:bg-zinc-200"} />
        </header>
        <div className="flex flex-col gap-6 px-8 pb-6 pt-3">{children}</div>
      </main>
    </SidebarProvider>
  );
}
