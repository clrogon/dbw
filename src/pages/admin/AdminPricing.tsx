import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, Edit, ArrowLeft } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Plan = Database["public"]["Tables"]["pricing_plans"]["Row"];

const AdminPricing = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState("");

  const load = async () => {
    const { data } = await supabase.from("pricing_plans").select("*").order("sort_order");
    if (data) setPlans(data);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => {
    setIsNew(true);
    setEditing({ id: "", name: "", price: "", unit: "/ mês", features: [], highlighted: false, sort_order: plans.length, created_at: "", updated_at: "" });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { id, created_at, updated_at, ...payload } = editing;
    if (isNew) {
      await supabase.from("pricing_plans").insert(payload);
    } else {
      await supabase.from("pricing_plans").update(payload).eq("id", id);
    }
    toast({ title: "Guardado" });
    setEditing(null); setIsNew(false); setSaving(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Apagar este plano?")) return;
    await supabase.from("pricing_plans").delete().eq("id", id);
    toast({ title: "Apagado" });
    load();
  };

  const addFeature = () => {
    if (!featureInput.trim() || !editing) return;
    setEditing({ ...editing, features: [...editing.features, featureInput.trim()] });
    setFeatureInput("");
  };

  if (editing) {
    return (
      <div className="max-w-lg">
        <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <h1 className="text-3xl font-bold font-display uppercase mb-8">{isNew ? "Novo Plano" : "Editar Plano"}</h1>
        <div className="space-y-5">
          <div>
            <Label>Nome</Label>
            <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Preço</Label>
              <Input value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
            </div>
            <div>
              <Label>Unidade</Label>
              <Input value={editing.unit} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={editing.highlighted} onCheckedChange={(v) => setEditing({ ...editing, highlighted: v })} />
            <Label>Plano destacado</Label>
          </div>
          <div>
            <Label>Funcionalidades</Label>
            <div className="space-y-2 mb-2">
              {editing.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm flex-1 bg-secondary px-3 py-1.5 rounded">{f}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setEditing({ ...editing, features: editing.features.filter((_, j) => j !== i) })}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Nova funcionalidade" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} />
              <Button type="button" variant="outline" size="sm" onClick={addFeature}><Plus className="w-4 h-4" /></Button>
            </div>
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
        <h1 className="text-3xl font-bold font-display uppercase">Planos de Preço</h1>
        <Button onClick={startNew} className="uppercase font-display font-bold tracking-wider"><Plus className="w-4 h-4 mr-2" /> Novo Plano</Button>
      </div>
      <div className="space-y-3">
        {plans.map((p) => (
          <div key={p.id} className="flex items-center justify-between border rounded-lg p-4 bg-card">
            <div>
              <p className="font-medium">{p.name} {p.highlighted && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full ml-2">Destaque</span>}</p>
              <p className="text-sm text-muted-foreground">{p.price} Kz {p.unit}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setEditing(p)}><Edit className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPricing;
