"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { CustomUser } from "@/lib/auth";

interface ExamConfig {
  id: string;
  name: string;
  description: string | null;
  questionCount: number;
  duration: number;
  passingScore: number;
  isActive: boolean;
}

export default function AdminExamsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [exams, setExams] = useState<ExamConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "", description: "",
    questionCount: 40, duration: 40, passingScore: 75, isActive: true,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated" || (session?.user as CustomUser)?.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    Promise.all([
      fetch("/api/exams").then((r) => r.json()).then((d) => d.success && setExams(d.data)),
    ]).finally(() => setLoading(false));
  }, [status, router, session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const url = editingId ? `/api/exams/${editingId}` : "/api/exams";
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
      setFormData({ name: "", description: "", questionCount: 40, duration: 40, passingScore: 75, isActive: true });
      location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/exams/${id}`, { method: "DELETE" });
      if (res.ok) location.reload();
    } catch {
      setError("Error al eliminar");
    } finally {
      setDeleteId(null);
    }
  }

  function handleEdit(exam: ExamConfig) {
    setEditingId(exam.id);
    setFormData({
      name: exam.name, description: exam.description || "",
      questionCount: exam.questionCount, duration: exam.duration,
      passingScore: exam.passingScore * 100, isActive: exam.isActive,
    });
    setShowForm(true);
  }

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><div className="loading-spinner" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">⏱️ Pruebas</h1>
        <Button onClick={() => { setEditingId(null); setFormData({ name: "", description: "", questionCount: 40, duration: 40, passingScore: 75, isActive: true }); setShowForm(true); }} className="bg-orange-500 hover:bg-orange-600 text-white">
          Nueva prueba
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
                <TableHead className="text-slate-300">Preguntas</TableHead>
                <TableHead className="text-slate-300">Tiempo</TableHead>
                <TableHead className="text-slate-300">Nota mín.</TableHead>
                <TableHead className="text-slate-300">Estado</TableHead>
                <TableHead className="text-slate-300 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id} className="border-slate-800 hover:bg-slate-800">
                  <TableCell className="font-medium text-slate-200">{exam.name}</TableCell>
                  <TableCell className="text-slate-400">{exam.questionCount}</TableCell>
                  <TableCell className="text-slate-400">{Math.floor(exam.duration / 60)} min</TableCell>
                  <TableCell className="text-slate-400">{exam.passingScore * 100}%</TableCell>
                  <TableCell className="text-slate-400">
                    <Badge variant={exam.isActive ? "default" : "secondary"} className={exam.isActive ? "bg-green-600" : "bg-slate-700"}>
                      {exam.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(exam)} className="text-orange-500 hover:text-orange-400 hover:bg-slate-800">
                        ✏️
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(exam.id)} className="text-red-500 hover:text-red-400 hover:bg-slate-800">
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
            <DialogTitle>{editingId ? "Editar prueba" : "Nueva prueba"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingId ? "Modifica la configuración de la prueba" : "Crea un nuevo tipo de prueba"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nombre</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre de la prueba"
                required
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Descripción</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción de la prueba"
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nº preguntas</label>
                <Input
                  type="number"
                  min={1}
                  max={200}
                  value={formData.questionCount}
                  onChange={(e) => setFormData({ ...formData, questionCount: Number(e.target.value) })}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Tiempo (min)</label>
                <Input
                  type="number"
                  min={5}
                  max={360}
                  value={Math.floor(formData.duration)}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) * 60 })}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nota mínima (%)</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="accent-orange-500"
              />
              <label htmlFor="isActive" className="text-sm text-slate-300">Activo</label>
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
            <DialogTitle>¿Eliminar prueba?</DialogTitle>
            <DialogDescription className="text-slate-400">
              Esta acción no se puede deshacer.
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
