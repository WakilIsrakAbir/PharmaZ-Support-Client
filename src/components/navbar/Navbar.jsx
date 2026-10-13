"use client";

import { useHasScrolled } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavMenu from "./NavMenu";
import ProfileMenu from "./ProfileMenu";
import ScrollProgress from "./ScrollProgress";

export default function Navbar() {
  const hasScrolled = useHasScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b px-4 backdrop-blur-xl transition-all duration-300 sm:px-6 lg:px-8",
        hasScrolled
          ? "border-border bg-background/85 shadow-lg shadow-black/5"
          : "border-border/50 bg-background/60",
      )}
    >
      <ScrollProgress />

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4">
        <div className="flex flex-1">
          <Logo />
        </div>

        <NavMenu />

        <div className="flex flex-1 items-center justify-end gap-2">
          <ProfileMenu />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
