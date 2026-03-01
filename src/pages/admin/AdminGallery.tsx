import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, ArrowLeft, Save } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];

const categories = ["Actividades Aquáticas", "Treinos", "Ginástica Laboral", "Aulas em Grupo"];

const AdminGallery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order");
    if (error) {
      console.error("Load gallery error:", error);
      toast({ title: "Erro", description: "Não foi possível carregar a galeria.", variant: "destructive" });
    }
    if (data) setImages(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => {
    setIsNew(true);
    setEditing({ id: "", image_url: "", alt: "", category: "Treinos", sort_order: images.length, created_at: "" });
  };

  const save = async () => {
    if (!editing || !editing.image_url) return;
    setSaving(true);
    const { id, created_at, ...payload } = editing;
    
    let error;
    if (isNew) {
      const result = await supabase.from("gallery_images").insert(payload);
      error = result.error;
    } else {
      const result = await supabase.from("gallery_images").update(payload).eq("id", id);
      error = result.error;
    }
    
    if (error) {
      console.error("Save gallery error:", error);
      toast({ title: "Erro ao guardar", description: error.message, variant: "destructive" });
    } else {
      await queryClient.invalidateQueries({ queryKey: ["cms_gallery"] });
      toast({ title: "Guardado" });
      setEditing(null); setIsNew(false);
      load();
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Apagar esta imagem?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Apagada" });
      load();
    }
  };

  if (loading) return <div className="animate-pulse h-8 w-48 bg-muted rounded" />;

  if (editing) {
    return (
      <div className="max-w-lg">
        <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <h1 className="text-3xl font-bold font-display uppercase mb-8">{isNew ? "Nova Imagem" : "Editar Imagem"}</h1>
        <div className="space-y-5">
          <div>
            <Label>Imagem</Label>
            <ImageUpload value={editing.image_url || null} onChange={(url) => setEditing({ ...editing, image_url: url || "" })} folder="gallery" />
          </div>
          <div>
            <Label>Texto alternativo (alt)</Label>
            <Input value={editing.alt} onChange={(e) => setEditing({ ...editing, alt: e.target.value })} />
          </div>
          <div>
            <Label>Categoria</Label>
            <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        <h1 className="text-3xl font-bold font-display uppercase">Galeria</h1>
        <Button onClick={startNew} className="uppercase font-display font-bold tracking-wider"><Plus className="w-4 h-4 mr-2" /> Nova Imagem</Button>
      </div>
      {images.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma imagem na galeria.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border bg-card">
              <img src={img.image_url} alt={img.alt} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="icon" onClick={() => setEditing(img)}><Edit className="w-4 h-4" /></Button>
                <Button variant="destructive" size="icon" onClick={() => remove(img.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
              <div className="p-2">
                <p className="text-xs text-muted-foreground truncate">{img.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
