import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCmsServices } from "@/hooks/useCms";
import { ArrowRight } from "lucide-react";
import { services as fallbackServices } from "@/data/services";

const ServicesPreview = () => {
  const { data: cmsServices } = useCmsServices();

  const displayServices = cmsServices && cmsServices.length > 0
    ? cmsServices.map((s) => ({
        slug: s.slug,
        icon: s.icon,
        title: s.title,
        shortDesc: s.short_desc,
        ctaText: s.cta_text,
        image: s.image_url || "",
      }))
    : fallbackServices.map((s) => ({
        slug: s.slug,
        icon: s.icon,
        title: s.title,
        shortDesc: s.shortDesc,
        ctaText: s.ctaText,
        image: s.image,
      }));

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-display font-bold tracking-widest uppercase text-sm mb-3">Serviços</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">O Que Oferecemos</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayServices.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={`/servicos/${s.slug}`}
                className="group block rounded-lg overflow-hidden border border-border bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-primary/30 transition-all duration-300"
              >
                {s.image && (
                  <div className="overflow-hidden h-56">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{s.icon}</span>
                    <h3 className="font-display font-bold text-foreground text-xl uppercase">{s.title}</h3>
                  </div>
                  <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-4">{s.shortDesc}</p>
                  <span className="inline-flex items-center gap-2 text-primary font-display font-bold text-sm uppercase tracking-wide group-hover:gap-3 transition-all">
                    {s.ctaText} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="uppercase font-display font-bold tracking-wider">
            <Link to="/servicos">Ver Todos os Serviços</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
