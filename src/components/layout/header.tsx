"use client";

import { useSession } from "@/lib/session-provider";
import { signOut } from "@/lib/client-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DroneIcon } from "@/components/icons";

export function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  const isAuthenticated = status === "authenticated";
  const userName = user?.name;
  const userEmail = user?.email;
  const userInitial = userName?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase() || "?";

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Simulacros", href: "/simulacros" },
    { label: "Estadísticas", href: "/estadisticas" },
  ];

  if (isAdmin) {
    navItems.push({ label: "Administración", href: "/admin" });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-orange-500">
          <DroneIcon className="h-6 w-6" />
          <span className="hidden sm:inline">DronTest</span>
        </Link>

        {/* Desktop nav */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6 ml-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-400 hover:text-orange-500 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-slate-300 hover:text-orange-500 hover:bg-slate-800">
                  <span className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-medium">
                    {userInitial}
                  </span>
                  <span className="hidden sm:inline text-sm">{userName || userEmail}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-100">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{userName || "Usuario"}</span>
                    <span className="text-xs text-slate-400 truncate max-w-[200px]">{userEmail || ""}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      Administración
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/historial" className="cursor-pointer">
                    Historial
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favoritos" className="cursor-pointer">
                    Favoritos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 focus:text-red-400"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
