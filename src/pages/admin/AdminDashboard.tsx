import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Image, Dumbbell, DollarSign, Users, Images } from "lucide-react";

interface Counts {
  services: number;
  pricing: number;
  instructors: number;
  gallery: number;
}

const AdminDashboard = () => {
  const [counts, setCounts] = useState<Counts>({ services: 0, pricing: 0, instructors: 0, gallery: 0 });

  useEffect(() => {
    const load = async () => {
      const [s, p, i, g] = await Promise.all([
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("pricing_plans").select("id", { count: "exact", head: true }),
        supabase.from("instructors").select("id", { count: "exact", head: true }),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        services: s.count ?? 0,
        pricing: p.count ?? 0,
        instructors: i.count ?? 0,
        gallery: g.count ?? 0,
      });
    };
    load();
  }, []);

  const cards = [
    { label: "Hero", href: "/admin/hero", icon: Image, count: null, desc: "Secção principal" },
    { label: "Serviços", href: "/admin/servicos", icon: Dumbbell, count: counts.services, desc: "serviços registados" },
    { label: "Preços", href: "/admin/precos", icon: DollarSign, count: counts.pricing, desc: "planos de preço" },
    { label: "Instrutores", href: "/admin/instrutores", icon: Users, count: counts.instructors, desc: "instrutores" },
    { label: "Galeria", href: "/admin/galeria", icon: Images, count: counts.gallery, desc: "imagens na galeria" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold font-display uppercase mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            to={card.href}
            className="border rounded-lg p-6 bg-card hover:shadow-[var(--shadow-card-hover)] transition-shadow group"
          >
            <card.icon className="w-8 h-8 text-primary mb-3" />
            <h2 className="font-display font-bold text-lg uppercase">{card.label}</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {card.count !== null ? `${card.count} ${card.desc}` : card.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
