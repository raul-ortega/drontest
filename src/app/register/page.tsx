"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authSignUp } from "@/lib/auth-actions";
import { signIn } from "@/lib/client-auth";
import { useSession } from "@/lib/session-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { updateSession } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await authSignUp({ name, email, password, confirmPassword });

    if (result.success) {
      // Iniciar sesión automáticamente con las credenciales recién creadas
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        setError("Cuenta creada, pero no se pudo iniciar sesión automáticamente. Inicia sesión manualmente.");
      } else {
        // Recargar la sesión en el contexto antes de navegar, para que el
        // dashboard no vea el estado "unauthenticated" anterior.
        await updateSession();
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      setError(result.error || "Error al registrarse");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-orange-500">DronTest</CardTitle>
          <CardDescription className="text-slate-400">
            Crea tu cuenta para practicar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-300">
                Nombre
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
                autoComplete="name"
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                autoComplete="new-password"
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">
                Confirmar contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                required
                autoComplete="new-password"
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-orange-500 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
