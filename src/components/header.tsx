"use client";

import Link from "next/link";
import { Lock, ShieldCheck, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Lock className="h-6 w-6 text-accent" />
          <span className="text-xl font-bold tracking-tight">PassVault</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            asChild
            className={cn(
              "shrink-0",
              pathname === "/strength-checker" && "bg-secondary"
            )}
          >
            <Link href="/strength-checker" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Strength Checker</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={logout}
            className="shrink-0"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
