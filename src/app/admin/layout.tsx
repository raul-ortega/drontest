import { getSession } from "@/lib/middleware";
import { redirect } from "next/navigation";
import { Sidebar, type SidebarItem } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user;
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const sidebarItems: SidebarItem[] = [
    { label: "Panel", href: "/admin", icon: "📊" },
    {
      label: "Gestión",
      href: "/admin",
      icon: "⚙️",
      items: [
        { label: "Categorías", href: "/admin/categorias", icon: "📁" },
        { label: "Temas", href: "/admin/temas", icon: "📑" },
        { label: "Preguntas", href: "/admin/preguntas", icon: "❓" },
        { label: "Simulacros", href: "/admin/simulacros", icon: "⏱️" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <div className="flex">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
