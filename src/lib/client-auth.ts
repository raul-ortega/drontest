"use client";

/**
 * Obtiene el token CSRF de Auth.js v5 (GET /api/auth/csrf).
 * La petición también establece la cookie `authjs.csrf-token`,
 * que el servidor contrastará con el token enviado en el body.
 */
async function getCsrfToken(): Promise<string> {
  const res = await fetch("/api/auth/csrf", { credentials: "include" });
  if (!res.ok) {
    throw new Error("No se pudo obtener el token CSRF");
  }
  const data = (await res.json()) as { csrfToken: string };
  return data.csrfToken;
}

export async function signIn(
  _provider: string,
  options?: { email?: string; password?: string; redirect?: boolean; callbackUrl?: string },
): Promise<{ error?: string; url?: string } | undefined> {
  const callbackUrl = options?.callbackUrl ?? "/dashboard";

  let csrfToken: string;
  try {
    csrfToken = await getCsrfToken();
  } catch {
    return { error: "Error al iniciar sesión" };
  }

  // En Auth.js v5 el callback de credentials es POST /api/auth/callback/credentials
  // y requiere el token CSRF verificado en el body.
  // Con la cabecera X-Auth-Return-Redirect la respuesta es 200 JSON { url }
  // en vez de un 302 (que se devuelve tanto en éxito como en fallo).
  const res = await fetch(
    `/api/auth/callback/credentials?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Auth-Return-Redirect": "1",
      },
      body: new URLSearchParams({
        csrfToken,
        email: options?.email ?? "",
        password: options?.password ?? "",
      }),
      credentials: "include",
    },
  );

  if (!res.ok) {
    return { error: "Error al iniciar sesión" };
  }

  const data = (await res.json()) as { url?: string };
  if (data.url?.includes("error=")) {
    return { error: "Email o contraseña incorrectos" };
  }

  return { url: data.url ?? callbackUrl };
}

export async function signOut(options?: { callbackUrl?: string }): Promise<void> {
  try {
    const csrfToken = await getCsrfToken();
    await fetch("/api/auth/signout", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ csrfToken }),
      credentials: "include",
      redirect: "manual",
    });
  } catch {
    // Aunque falle la petición, forzamos la navegación para no quedar bloqueado
  }
  window.location.href = options?.callbackUrl ?? "/login";
}
