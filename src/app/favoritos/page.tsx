"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FavoriteQuestion {
  id: string;
  createdAt: string;
  question: {
    id: string;
    text: string;
    options: Array<{ id: string; text: string; isCorrect: boolean; order: number }>;
    topic?: { name: string };
    category?: { name: string };
    explanation?: string | null;
  };
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    async function loadFavorites() {
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setFavorites(data.data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [status, router]);

  async function handleRemove(id: string, questionId: string) {
    setRemoving(id);
    try {
      const res = await fetch(`/api/favorites/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.id !== id));
      }
    } catch {
      // ignore
    } finally {
      setRemoving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">⭐ Favoritos</h1>
      <p className="text-slate-400 mb-6">Tus preguntas marcadas como favoritas para repasar.</p>

      {favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map((fav) => (
            <Card key={fav.id} className="bg-slate-900 border-slate-800 text-slate-100">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {fav.question.category && (
                        <Badge variant="outline" className="bg-slate-800 text-slate-400">
                          {fav.question.category.name}
                        </Badge>
                      )}
                      {fav.question.topic && (
                        <Badge variant="outline" className="bg-slate-800 text-slate-400">
                          {fav.question.topic.name}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base">{fav.question.text}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-slate-800 shrink-0"
                    onClick={() => handleRemove(fav.id, fav.question.id)}
                    disabled={removing === fav.id}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {fav.question.explanation && (
                  <p className="text-sm text-slate-400 italic">
                    {fav.question.explanation}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert className="bg-slate-800 border-slate-700">
          <AlertDescription className="text-slate-400">
            Aún no tienes preguntas favoritas. Marca preguntas durante la práctica para añadirlas aquí.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          <Link href="/dashboard">Volver al dashboard</Link>
        </Button>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link href="/simulacros">Ir a simulacros</Link>
        </Button>
      </div>
    </div>
  );
}
