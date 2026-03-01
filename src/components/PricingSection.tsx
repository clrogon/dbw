import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePricingPlans } from "@/hooks/useCms";

const fallbackPlans = [
  { name: "Inscrição", price: "15.000", unit: "única", features: ["Registo no programa", "Avaliação inicial", "Acesso ao plano personalizado"], highlighted: false },
  { name: "1x por semana", price: "25.000", unit: "/ mês", features: ["4 aulas por mês", "Acompanhamento profissional", "Acesso às instalações"], highlighted: false },
  { name: "2x por semana", price: "45.000", unit: "/ mês", features: ["8 aulas por mês", "Acompanhamento profissional", "Acesso às instalações", "Recomendado"], highlighted: true },
  { name: "3x por semana", price: "55.000", unit: "/ mês", features: ["12 aulas por mês", "Acompanhamento profissional", "Acesso às instalações", "Melhores resultados"], highlighted: false },
];

const PricingSection = () => {
  const { data: cmsPlans, isLoading, isError } = usePricingPlans();

  if (isLoading) {
    return (
      <section className="section-padding bg-secondary">
        <div className="container mx-auto flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </section>
    );
  }

  const plans = !isError && cmsPlans && cmsPlans.length > 0 ? cmsPlans : fallbackPlans;

  return (
    <section className="section-padding bg-secondary">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-display font-bold tracking-widest uppercase text-sm mb-3">Preços</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">Planos &amp; Valores</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-lg p-8 border flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "bg-foreground text-primary-foreground border-foreground shadow-[var(--shadow-elevated)] scale-[1.02]"
                  : "bg-card text-foreground border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]"
              }`}
            >
              <p className={`text-sm font-display font-bold uppercase tracking-wide mb-4 ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`}>
                {plan.name}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold font-display">{plan.price}</span>
                <span className={`text-sm ml-1 font-sans ${plan.highlighted ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  Kz {plan.unit}
                </span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-sans">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span className={plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={plan.highlighted ? "default" : "outline"}
                className={`uppercase font-display font-bold tracking-wider ${plan.highlighted ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
              >
                <Link to="/reservar">Inscrever-se</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
