import { headers } from "next/headers";
import { getToken } from "@auth/core/jwt";
import type { CustomSession, CustomSessionUser } from "@/lib/auth";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET;

export async function getSession(): Promise<CustomSession | null> {
  const headerList = await headers();
  const cookie = headerList.get("cookie") ?? "";

  if (!AUTH_SECRET) {
    return null;
  }

  // Decodifica el JWT de sesión directamente, sin ida y vuelta HTTP interna.
  // La implementación anterior hacía fetch a /api/auth/session usando el
  // host externo y asumía HTTPS para hosts que no eran "localhost"; al
  // acceder a la app por un dominio (p. ej. impxdev.ddns.net) sobre HTTP
  // plano, la petición interna fallaba y la sesión se perdía (401).
  // El nombre de cookie (y su salt) depende de si la petición llegó por
  // HTTPS: en ese caso Auth.js usa el prefijo "__Secure-" (como hace en
  // su init: useSecureCookies ?? url.protocol === "https:").
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const isSecure = proto === "https";
  const cookieName = isSecure
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  let token;
  try {
    token = await getToken({
      req: { headers: { cookie } },
      secret: AUTH_SECRET,
      cookieName,
      salt: cookieName,
      secureCookie: isSecure,
    });
  } catch {
    return null;
  }

  if (!token) {
    return null;
  }

  const user: CustomSessionUser = {
    id: (token.id as string) ?? "",
    name: (token.name as string | null) ?? null,
    email: (token.email as string | null) ?? null,
    image: (token.picture as string | null) ?? null,
    role: (token.role as string) ?? "USER",
  };

  return {
    user,
    expires: token.exp ? new Date(token.exp * 1000).toISOString() : "",
  };
}

export async function requireAuth() {
  const session = await getSession();
  if (!session || !session.user) {
    return { authenticated: false, error: "No autenticado" } as const;
  }
  const user = session.user as CustomSessionUser;
  return { authenticated: true, userId: user.id } as const;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || !session.user) {
    return { authenticated: false, error: "No autenticado" } as const;
  }
  const user = session.user as CustomSessionUser;
  if (user.role !== "ADMIN") {
    return { authenticated: false, error: "Se requiere rol de administrador" } as const;
  }
  return { authenticated: true, userId: user.id, isAdmin: true } as const;
}
