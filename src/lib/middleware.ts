import { getServerSession } from "next-auth";
import { authOptions, CustomUser } from "@/lib/auth";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { authenticated: false, error: "No autenticado" } as const;
  }
  const user = session.user as CustomUser;
  return { authenticated: true, userId: user.id } as const;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { authenticated: false, error: "No autenticado" } as const;
  }
  const user = session.user as CustomUser;
  if (user.role !== "ADMIN") {
    return { authenticated: false, error: "Se requiere rol de administrador" } as const;
  }
  return { authenticated: true, userId: user.id, isAdmin: true } as const;
}
