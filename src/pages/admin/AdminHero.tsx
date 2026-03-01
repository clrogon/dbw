import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2 } from "lucide-react";

interface Stat {
  value: string;
  label: string;
}

const AdminHero = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroId, setHeroId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    title_highlight: "",
    subtitle: "",
    cta_primary_text: "",
    cta_primary_link: "",
    cta_secondary_text: "",
    cta_secondary_link: "",
    background_image_url: null as string | null,
    stats: [] as Stat[],
  });

  useEffect(() => {
    supabase.from("hero_content").select("*").limit(1).maybeSingle().then(({ data, error }) => {
      if (error) {
        console.error("Load hero error:", error);
        toast({ title: "Erro", description: "Não foi possível carregar o conteúdo.", variant: "destructive" });
      }
      if (data) {
        setHeroId(data.id);
        setForm({
          title: data.title,
          title_highlight: data.title_highlight,
          subtitle: data.subtitle,
          cta_primary_text: data.cta_primary_text,
          cta_primary_link: data.cta_primary_link,
          cta_secondary_text: data.cta_secondary_text,
          cta_secondary_link: data.cta_secondary_link,
          background_image_url: data.background_image_url,
          stats: (data.stats as unknown as Stat[]) || [],
        });
      }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const payload = { ...form, stats: form.stats as unknown as import("@/integrations/supabase/types").Json };
    
    let error;
    if (heroId) {
      const result = await supabase.from("hero_content").update(payload).eq("id", heroId);
      error = result.error;
    } else {
      const result = await supabase.from("hero_content").insert({ ...payload, title: payload.title }).select().single();
      error = result.error;
      if (result.data) setHeroId(result.data.id);
    }
    
    if (error) {
      console.error("Save hero error:", error);
      toast({ title: "Erro ao guardar", description: error.message, variant: "destructive" });
    } else {
      await queryClient.invalidateQueries({ queryKey: ["hero_content"] });
      toast({ title: "Guardado", description: "Hero actualizado com sucesso." });
    }
    setSaving(false);
  };

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...form.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setForm({ ...form, stats: newStats });
  };

  if (loading) return <div className="animate-pulse h-8 w-48 bg-muted rounded" />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold font-display uppercase mb-8">Hero Section</h1>

      <div className="space-y-6">
        <div>
          <Label>Título principal</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <Label>Título destaque (cor primária)</Label>
          <Input value={form.title_highlight} onChange={(e) => setForm({ ...form, title_highlight: e.target.value })} />
        </div>
        <div>
          <Label>Subtítulo</Label>
          <Textarea value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Texto CTA primário</Label>
            <Input value={form.cta_primary_text} onChange={(e) => setForm({ ...form, cta_primary_text: e.target.value })} />
          </div>
          <div>
            <Label>Link CTA primário</Label>
            <Input value={form.cta_primary_link} onChange={(e) => setForm({ ...form, cta_primary_link: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Texto CTA secundário</Label>
            <Input value={form.cta_secondary_text} onChange={(e) => setForm({ ...form, cta_secondary_text: e.target.value })} />
          </div>
          <div>
            <Label>Link CTA secundário</Label>
            <Input value={form.cta_secondary_link} onChange={(e) => setForm({ ...form, cta_secondary_link: e.target.value })} />
          </div>
        </div>

        <div>
          <Label>Imagem de fundo</Label>
          <ImageUpload
            value={form.background_image_url}
            onChange={(url) => setForm({ ...form, background_image_url: url })}
            folder="hero"
          />
        </div>

        <div>
          <Label className="mb-2 block">Estatísticas</Label>
          <div className="space-y-3">
            {form.stats.map((stat, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder="Valor (ex: 500+)"
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  className="w-32"
                />
                <Input
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setForm({ ...form, stats: form.stats.filter((_, j) => j !== i) })}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setForm({ ...form, stats: [...form.stats, { value: "", label: "" }] })}
            >
              <Plus className="w-4 h-4 mr-1" /> Adicionar estatística
            </Button>
          </div>
        </div>

        <Button onClick={save} disabled={saving} className="uppercase font-display font-bold tracking-wider">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "A guardar..." : "Guardar Alterações"}
        </Button>
      </div>
    </div>
  );
};

export default AdminHero;
