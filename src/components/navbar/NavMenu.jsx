"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "@/config/navigation";
import { useDismiss } from "@/hooks/useDismiss";
import NavDropdown from "./NavDropdown";

export default function NavMenu() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState(null);
  const menuRef = useRef(null);

  useDismiss(menuRef, () => setOpenGroup(null), openGroup !== null);

  function toggleGroup(label) {
    setOpenGroup((current) => (current === label ? null : label));
  }

  return (
    <nav ref={menuRef} aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1 rounded-full border border-border bg-surface/60 p-1 shadow-sm">
        {NAV_GROUPS.map((group) => (
          <NavDropdown
            key={group.label}
            group={group}
            pathname={pathname}
            isOpen={openGroup === group.label}
            onToggle={() => toggleGroup(group.label)}
            onClose={() => setOpenGroup(null)}
          />
        ))}
      </ul>
    </nav>
  );
}
