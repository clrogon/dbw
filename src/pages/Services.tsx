import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCmsServices } from "@/hooks/useCms";
import { services as fallbackServices } from "@/data/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTABanner from "@/components/CTABanner";

const Services = () => {
  const { data: cmsServices } = useCmsServices();

  const services = cmsServices && cmsServices.length > 0
    ? cmsServices.map((s) => ({
        slug: s.slug, icon: s.icon, title: s.title,
        shortDesc: s.short_desc, subServices: s.sub_services,
        image: s.image_url || "", ctaText: s.cta_text,
      }))
    : fallbackServices.map((s) => ({
        slug: s.slug, icon: s.icon, title: s.title,
        shortDesc: s.shortDesc, subServices: s.subServices,
        image: s.image, ctaText: s.ctaText,
      }));

  return (
    <>
      <Helmet>
        <title>Serviços | DBW Fitness Luanda</title>
        <meta name="description" content="Conheça os serviços da DBW: actividades aquáticas, treinos personalizados, ginástica laboral e aulas em grupo em Luanda." />
      </Helmet>
      <main>
        <Navbar />

        <section className="bg-foreground text-primary-foreground pt-28 pb-20 px-6">
          <div className="container mx-auto text-center">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary font-display font-bold tracking-widest uppercase text-sm mb-3">Serviços</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold">
              O Que <span className="text-primary">Oferecemos</span>
            </motion.h1>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((s, i) => (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/servicos/${s.slug}`}
                    className="group block rounded-lg overflow-hidden border border-border bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-primary/30 transition-all duration-300 h-full"
                  >
                    {s.image && (
                      <div className="overflow-hidden h-64">
                        <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      </div>
                    )}
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{s.icon}</span>
                        <h2 className="font-display font-bold text-foreground text-2xl uppercase">{s.title}</h2>
                      </div>
                      <p className="text-muted-foreground font-sans leading-relaxed mb-4">{s.shortDesc}</p>
                      <ul className="space-y-1 mb-6">
                        {s.subServices.slice(0, 3).map((sub) => (
                          <li key={sub} className="text-sm text-muted-foreground font-sans">✦ {sub}</li>
                        ))}
                      </ul>
                      <span className="inline-flex items-center gap-2 text-primary font-display font-bold text-sm uppercase tracking-wide group-hover:gap-3 transition-all">
                        Saber Mais <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTABanner />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default Services;
