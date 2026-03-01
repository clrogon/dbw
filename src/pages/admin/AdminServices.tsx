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

type Service = Database["public"]["Tables"]["services"]["Row"];

const AdminServices = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subInput, setSubInput] = useState("");

  const load = async () => {
    const { data, error } = await supabase.from("services").select("*").order("sort_order");
    if (error) {
      console.error("Load services error:", error);
      toast({ title: "Erro", description: "Não foi possível carregar os serviços.", variant: "destructive" });
    }
    if (data) setServices(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => {
    setIsNew(true);
    setEditing({
      id: "", slug: "", icon: "🏋️", title: "", short_desc: "", full_desc: "",
      sub_services: [], cta_text: "", image_url: null, seo_title: "", seo_description: "",
      sort_order: services.length, created_at: "", updated_at: "",
    });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { id, created_at, updated_at, ...payload } = editing;

    let error;
    if (isNew) {
      const result = await supabase.from("services").insert(payload);
      error = result.error;
    } else {
      const result = await supabase.from("services").update(payload).eq("id", id);
      error = result.error;
    }
    
    if (error) {
      console.error("Save service error:", error);
      toast({ title: "Erro ao guardar", description: error.message, variant: "destructive" });
    } else {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cms_services"] }),
        queryClient.invalidateQueries({ queryKey: ["cms_service"] }),
      ]);
      toast({ title: "Guardado" });
      setEditing(null);
      setIsNew(false);
      load();
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Tem a certeza que quer apagar este serviço?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Apagado" });
      load();
    }
  };

  const addSub = () => {
    if (!subInput.trim() || !editing) return;
    setEditing({ ...editing, sub_services: [...editing.sub_services, subInput.trim()] });
    setSubInput("");
  };

  if (loading) return <div className="animate-pulse h-8 w-48 bg-muted rounded" />;

  if (editing) {
    return (
      <div className="max-w-2xl">
        <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <h1 className="text-3xl font-bold font-display uppercase mb-8">
          {isNew ? "Novo Serviço" : "Editar Serviço"}
        </h1>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Slug (URL)</Label>
              <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </div>
            <div>
              <Label>Ícone (emoji)</Label>
              <Input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Título</Label>
            <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </div>
          <div>
            <Label>Descrição curta</Label>
            <Textarea value={editing.short_desc} onChange={(e) => setEditing({ ...editing, short_desc: e.target.value })} />
          </div>
          <div>
            <Label>Descrição completa</Label>
            <Textarea value={editing.full_desc} onChange={(e) => setEditing({ ...editing, full_desc: e.target.value })} rows={4} />
          </div>
          <div>
            <Label>Sub-serviços</Label>
            <div className="space-y-2 mb-2">
              {editing.sub_services.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm flex-1 bg-secondary px-3 py-1.5 rounded">{s}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setEditing({
                    ...editing, sub_services: editing.sub_services.filter((_, j) => j !== i),
                  })}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Novo sub-serviço" value={subInput} onChange={(e) => setSubInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSub())} />
              <Button type="button" variant="outline" size="sm" onClick={addSub}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
          <div>
            <Label>CTA text</Label>
            <Input value={editing.cta_text} onChange={(e) => setEditing({ ...editing, cta_text: e.target.value })} />
          </div>
          <div>
            <Label>Imagem</Label>
            <ImageUpload value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} folder="services" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>SEO Title</Label>
              <Input value={editing.seo_title} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} />
            </div>
            <div>
              <Label>Ordem</Label>
              <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div>
            <Label>SEO Description</Label>
            <Textarea value={editing.seo_description} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} />
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
        <h1 className="text-3xl font-bold font-display uppercase">Serviços</h1>
        <Button onClick={startNew} className="uppercase font-display font-bold tracking-wider">
          <Plus className="w-4 h-4 mr-2" /> Novo Serviço
        </Button>
      </div>
      {services.length === 0 ? (
        <p className="text-muted-foreground">Nenhum serviço registado.</p>
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className="flex items-center justify-between border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setEditing(s)}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminServices;
