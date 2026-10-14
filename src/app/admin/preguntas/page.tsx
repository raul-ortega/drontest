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

interface Category {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  name: string;
}

interface Question {
  id: string;
  text: string;
  difficulty: string;
  status: string;
  explanation: string | null;
  reference: string | null;
  source: string | null;
  topic: { id: string; name: string };
  category: { id: string; name: string };
  options: Array<{ id: string; text: string; isCorrect: boolean; order: number }>;
}

interface OptionForm {
  text: string;
  isCorrect: boolean;
}

export default function AdminQuestionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    text: "", categoryId: "", topicId: "", difficulty: "MEDIUM",
    explanation: "", reference: "", source: "", status: "DRAFT",
    options: [{ text: "", isCorrect: true }] as OptionForm[],
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
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
      fetchQuestions(),
      fetch("/api/categories").then((r) => r.json()).then((d) => d.success && setCategories(d.data)),
      fetch("/api/topics").then((r) => r.json()).then((d) => d.success && setTopics(d.data)),
    ]).finally(() => setLoading(false));
  }, [status, router, session]);

  async function fetchQuestions() {
    const params = new URLSearchParams();
    if (filterCategory) params.set("categoryId", filterCategory);
    if (filterTopic) params.set("topicId", filterTopic);
    if (filterStatus) params.set("status", filterStatus);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/questions?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) setQuestions(data.data);
      }
    } catch {
      setError("Error al cargar preguntas");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validate at least one correct option
    const hasCorrect = formData.options.some((o) => o.isCorrect);
    if (!hasCorrect) {
      setError("Al menos una opción debe ser correcta");
      return;
    }

    try {
      const url = editingId ? `/api/questions/${editingId}` : "/api/questions";
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
      setFormData({
        text: "", categoryId: "", topicId: "", difficulty: "MEDIUM",
        explanation: "", reference: "", source: "", status: "DRAFT",
        options: [{ text: "", isCorrect: true }],
      });
      fetchQuestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
      if (res.ok) fetchQuestions();
    } catch {
      setError("Error al eliminar");
    } finally {
      setDeleteId(null);
    }
  }

  function handleEdit(q: Question) {
    setEditingId(q.id);
    setFormData({
      text: q.text, categoryId: q.category.id, topicId: q.topic.id,
      difficulty: q.difficulty, explanation: q.explanation || "",
      reference: q.reference || "", source: q.source || "",
      status: q.status,
      options: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
    });
    setShowForm(true);
  }

  const filteredTopics = topics;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">❓ Preguntas</h1>
        <Button onClick={() => { setEditingId(null); setFormData({ text: "", categoryId: "", topicId: "", difficulty: "MEDIUM", explanation: "", reference: "", source: "", status: "DRAFT", options: [{ text: "", isCorrect: true }] }); setShowForm(true); }} className="bg-orange-500 hover:bg-orange-600 text-white">
          Nueva pregunta
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); fetchQuestions(); }}
          className="bg-slate-900 border-slate-800 text-slate-100 max-w-xs"
        />
        <Select value={filterCategory} onValueChange={(val) => { setFilterCategory(val); fetchQuestions(); }}>
          <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100 w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(val) => { setFilterStatus(val); fetchQuestions(); }}>
          <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100 w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="DRAFT">Borrador</SelectItem>
            <SelectItem value="PUBLISHED">Publicada</SelectItem>
            <SelectItem value="ARCHIVED">Archivada</SelectItem>
          </SelectContent>
        </Select>
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
                <TableHead className="text-slate-300">Enunciado</TableHead>
                <TableHead className="text-slate-300">Categoría</TableHead>
                <TableHead className="text-slate-300">Tema</TableHead>
                <TableHead className="text-slate-300">Dificultad</TableHead>
                <TableHead className="text-slate-300">Estado</TableHead>
                <TableHead className="text-slate-300 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q) => (
                <TableRow key={q.id} className="border-slate-800 hover:bg-slate-800">
                  <TableCell className="max-w-xs truncate text-slate-200">{q.text}</TableCell>
                  <TableCell className="text-slate-400">{q.category.name}</TableCell>
                  <TableCell className="text-slate-400">{q.topic.name}</TableCell>
                  <TableCell className="text-slate-400">
                    <Badge variant="outline" className="bg-slate-800">
                      {q.difficulty === "EASY" ? "Fácil" : q.difficulty === "MEDIUM" ? "Medio" : "Difícil"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400">
                    <Badge variant={q.status === "PUBLISHED" ? "default" : "secondary"} className={q.status === "PUBLISHED" ? "bg-green-600" : "bg-slate-700"}>
                      {q.status === "PUBLISHED" ? "Publicada" : q.status === "DRAFT" ? "Borrador" : "Archivada"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(q)} className="text-orange-500 hover:text-orange-400 hover:bg-slate-800">
                        ✏️
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(q.id)} className="text-red-500 hover:text-red-400 hover:bg-slate-800">
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
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar pregunta" : "Nueva pregunta"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingId ? "Modifica los datos de la pregunta" : "Crea una nueva pregunta"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Enunciado</label>
              <Textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Enunciado de la pregunta"
                required
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Categoría</label>
                <Select value={formData.categoryId} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Tema</label>
                <Select value={formData.topicId} onValueChange={(val) => setFormData({ ...formData, topicId: val })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Tema" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                    {topics.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Dificultad</label>
                <Select value={formData.difficulty} onValueChange={(val) => setFormData({ ...formData, difficulty: val })}>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <SelectItem value="EASY">Fácil</SelectItem>
                    <SelectItem value="MEDIUM">Medio</SelectItem>
                    <SelectItem value="HARD">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Estado</label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <SelectItem value="DRAFT">Borrador</SelectItem>
                    <SelectItem value="PUBLISHED">Publicada</SelectItem>
                    <SelectItem value="ARCHIVED">Archivada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Opciones</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({ ...formData, options: [...formData.options, { text: "", isCorrect: false }] })}
                  className="text-orange-500 hover:text-orange-400"
                >
                  + Añadir
                </Button>
              </div>
              {formData.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={opt.text}
                    onChange={(e) => {
                      const newOpts = [...formData.options];
                      newOpts[i].text = e.target.value;
                      setFormData({ ...formData, options: newOpts });
                    }}
                    placeholder={`Opción ${String.fromCharCode(65 + i)}`}
                    className="flex-1 bg-slate-800 border-slate-700 text-slate-100"
                  />
                  <label className="flex items-center gap-1 text-sm text-slate-300 whitespace-nowrap">
                    <input
                      type="radio"
                      name="correct"
                      checked={opt.isCorrect}
                      onChange={() => {
                        const newOpts = formData.options.map((o, j) => ({
                          ...o,
                          isCorrect: j === i,
                        }));
                        setFormData({ ...formData, options: newOpts });
                      }}
                      className="accent-orange-500"
                    />
                    Correcta
                  </label>
                  {formData.options.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newOpts = formData.options.filter((_, j) => j !== i);
                        setFormData({ ...formData, options: newOpts });
                      }}
                      className="text-red-500 hover:text-red-400"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Explicación</label>
              <Textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Explicación de la respuesta correcta"
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Referencia</label>
                <Input
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="Referencia documental"
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Fuente</label>
                <Input
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="Fuente del contenido"
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
              </div>
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
            <DialogTitle>¿Eliminar pregunta?</DialogTitle>
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
