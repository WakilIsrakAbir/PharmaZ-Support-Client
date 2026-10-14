"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import SidebarBrand from "./SidebarBrand";
import SidebarNav from "./SidebarNav";
import SidebarProfile from "./SidebarProfile";

/** Phones and tablets: a slim top bar, and the sidebar slides in as a drawer. */
export default function MobileSidebar() {
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  // Esc closes the drawer, and the page behind it doesn't scroll
  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event) => event.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          aria-expanded={isOpen}
          className="grid size-10 cursor-pointer place-items-center rounded-xl border border-border bg-surface/60 transition-colors hover:border-accent/40"
        >
          <Menu className="size-5" />
        </button>
        {/* Inside a product, the top bar names it, like the sidebar does */}
        <Logo name={user?.product?.name} />
      </header>

      <div className={cn("fixed inset-0 z-50 lg:hidden", !isOpen && "pointer-events-none")} inert={!isOpen}>
        <div
          onClick={close}
          className={cn("absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}
        />

        <aside
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-sidebar shadow-2xl transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <SidebarBrand onNavigate={close} />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="grid size-9 cursor-pointer place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2">
            <SidebarNav onNavigate={close} />
          </div>

          <div className="border-t border-white/10 p-3">
            <SidebarProfile onNavigate={close} />
          </div>
        </aside>
      </div>
    </>
  );
}
