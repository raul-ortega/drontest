"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/session-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Category {
  id: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  topics: Array<{ id: string; name: string }>;
  _count: { questions: number };
}

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", order: 0 });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const user = session?.user;
    if (!user || user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    loadCategories();
  }, [status, router, session]);

  async function loadCategories() {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        if (data.success) setCategories(data.data);
      }
    } catch {
      setError("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ name: "", description: "", order: 0 });
      loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) loadCategories();
    } catch {
      setError("Error al eliminar");
    } finally {
      setDeleteId(null);
    }
  }

  function handleEdit(cat: Category) {
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description || "", order: cat.order });
    setShowForm(true);
  }

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><div className="loading-spinner" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">📁 Categorías</h1>
        <Button onClick={() => { setEditingId(null); setFormData({ name: "", description: "", order: 0 }); setShowForm(true); }} className="bg-orange-500 hover:bg-orange-600 text-white">
          Nueva categoría
        </Button>
      </div>

      {error && (
        <Alert className="bg-red-950 border-red-800 mb-4">
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800">
                <TableHead className="text-slate-300">Nombre</TableHead>
                <TableHead className="text-slate-300">Descripción</TableHead>
                <TableHead className="text-slate-300">Temas</TableHead>
                <TableHead className="text-slate-300 text-right">Preguntas</TableHead>
                <TableHead className="text-slate-300 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} className="border-slate-800 hover:bg-slate-800">
                  <TableCell className="font-medium text-slate-200">{cat.name}</TableCell>
                  <TableCell className="text-slate-400 max-w-xs truncate">{cat.description || "—"}</TableCell>
                  <TableCell className="text-slate-400">{cat.topics.length}</TableCell>
                  <TableCell className="text-right text-slate-400">{cat._count.questions}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(cat)} className="text-orange-500 hover:text-orange-400 hover:bg-slate-800">
                        ✏️
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(cat.id)} className="text-red-500 hover:text-red-400 hover:bg-slate-800">
                        🗑️
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingId ? "Modifica los datos de la categoría" : "Crea una nueva categoría"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nombre</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre de la categoría"
                required
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Descripción</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción de la categoría"
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Orden</label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                {editingId ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle>¿Eliminar categoría?</DialogTitle>
            <DialogDescription className="text-slate-400">
              Esta acción no se puede deshacer. Se eliminarán también los temas y preguntas asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Cancelar
            </Button>
            <Button onClick={() => deleteId && handleDelete(deleteId)} className="bg-red-600 hover:bg-red-700 text-white">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
