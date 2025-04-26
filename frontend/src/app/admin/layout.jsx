"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full min-h-screen relative flex flex-col">
        <header className="border-b h-14 flex flex-row items-center px-2 sticky top-0 bg-white z-10">
          <SidebarTrigger className={"hover:bg-zinc-200"} />
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              Help
            </Button>
            <Button
              size="sm"
              className="bg-black text-white hover:bg-slate-800"
            >
              Logout
            </Button>
          </div>
        </header>

        <div className="flex flex-col gap-6 px-8 pb-6 pt-3 size-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
