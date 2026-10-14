"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import SidebarBrand from "./SidebarBrand";
import SidebarNav from "./SidebarNav";
import SidebarProfile from "./SidebarProfile";

/**
 * The desktop sidebar (lg and up). Open by default; the edge button folds it to
 * icons and the choice is remembered. Phones use MobileSidebar instead.
 *
 * Folding stays smooth on heavy pages: the spacer that holds the sidebar's place
 * changes width at once (the page lays out one time), and only the fixed panel animates,
 * which doesn't make the browser re-measure the page on every frame.
 */
export default function Sidebar() {
  const { isCollapsed, toggle } = useSidebar();
  const ToggleIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <>
      <div aria-hidden="true" className="sidebar-desktop hidden w-68 shrink-0 lg:block collapsed:w-20" />

      <aside className="sidebar-desktop fixed inset-y-0 left-0 z-40 hidden w-68 flex-col bg-sidebar transition-[width] duration-200 ease-out lg:flex collapsed:w-20">
        <div className="flex h-20 items-center px-5 collapsed:justify-center collapsed:px-0">
          <SidebarBrand />
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3.5 top-7 grid size-7 cursor-pointer place-items-center rounded-full border border-border bg-surface text-muted shadow-md transition-colors hover:text-accent-text"
        >
          <ToggleIcon className="size-3.5" />
        </button>

        {/* Only the links scroll, so the brand and profile stay put */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 [scrollbar-width:thin]">
          <SidebarNav />
        </div>

        <div className="border-t border-white/10 p-3">
          <SidebarProfile />
        </div>
      </aside>
    </>
  );
}
