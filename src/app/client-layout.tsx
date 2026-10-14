"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "@/components/ui/toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ToastContainer />
    </SessionProvider>
  );
}
