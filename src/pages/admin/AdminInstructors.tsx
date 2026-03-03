import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, Edit, ArrowLeft } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { normaliseInstructorRow } from "@/utils/normaliseCms";

type Instructor = Database["public"]["Tables"]["instructors"]["Row"];

const AdminInstructors = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [items, setItems] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Instructor | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [specInput, setSpecInput] = useState("");

  const load = async () => {
    const { data, error } = await supabase.from("instructors").select("*").order("sort_order");
    if (error) {
      console.error("Load instructors error:", error);
      toast({ title: "Erro", description: "Não foi possível carregar os instrutores.", variant: "destructive" });
    }
    if (data) {
      const normalized = (data as any).map((it: any) => normaliseInstructorRow(it)) as unknown as Instructor[];
      setItems(normalized);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => {
    setIsNew(true);
    setEditing({ id: "", name: "", role: "", specialties: [], bio: "", image_url: null, sort_order: items.length, created_at: "", updated_at: "" });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { id, created_at, updated_at, ...payload } = editing;
    
    let error;
    if (isNew) {
      const result = await supabase.from("instructors").insert(payload);
      error = result.error;
    } else {
      const result = await supabase.from("instructors").update(payload).eq("id", id);
      error = result.error;
    }
    
    if (error) {
      console.error("Save instructor error:", error);
      toast({ title: "Erro ao guardar", description: error.message, variant: "destructive" });
    } else {
      await queryClient.invalidateQueries({ queryKey: ["cms_instructors"] });
      toast({ title: "Guardado" });
      setEditing(null); setIsNew(false);
      load();
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Apagar este instrutor?")) return;
    const { error } = await supabase.from("instructors").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Apagado" });
      load();
    }
  };

  const addSpec = () => {
    if (!specInput.trim() || !editing) return;
    setEditing({ ...editing, specialties: [...editing.specialties, specInput.trim()] });
    setSpecInput("");
  };

  if (loading) return <div className="animate-pulse h-8 w-48 bg-muted rounded" />;

  if (editing) {
    return (
      <div className="max-w-2xl">
        <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <h1 className="text-3xl font-bold font-display uppercase mb-8">{isNew ? "Novo Instrutor" : "Editar Instrutor"}</h1>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Nome</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><Label>Função</Label><Input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></div>
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} rows={3} />
          </div>
          <div>
            <Label>Especialidades</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editing.specialties.map((s, i) => (
                <span key={i} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center gap-1">
                  {s}
                  <button onClick={() => setEditing({ ...editing, specialties: editing.specialties.filter((_, j) => j !== i) })}>
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Nova especialidade" value={specInput} onChange={(e) => setSpecInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpec())} />
              <Button type="button" variant="outline" size="sm" onClick={addSpec}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
          <div>
            <Label>Foto</Label>
            <ImageUpload value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} folder="instructors" />
          </div>
          <div>
            <Label>Ordem</Label>
            <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
          </div>
          <Button onClick={save} disabled={saving} className="uppercase font-display font-bold tracking-wider">
            <Save className="w-4 h-4 mr-2" /> {saving ? "A guardar..." : "Guardar"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display uppercase">Instrutores</h1>
        <Button onClick={startNew} className="uppercase font-display font-bold tracking-wider"><Plus className="w-4 h-4 mr-2" /> Novo Instrutor</Button>
      </div>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Nenhum instrutor registado.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-3">
                {item.image_url && <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-full object-cover" />}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setEditing(item)}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInstructors;
