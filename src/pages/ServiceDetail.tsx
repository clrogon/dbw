import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCmsService, useCmsServices } from "@/hooks/useCms";
import { normaliseServiceRow, type NormalisedService } from "@/utils/normaliseCms";
import { services as fallbackServices } from "@/data/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTABanner from "@/components/CTABanner";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: cmsService, isLoading } = useCmsService(slug || "");
  const { data: allServices } = useCmsServices();

  // Fallback to hardcoded data
  const fallback = fallbackServices.find((s) => s.slug === slug);
  
  const service = cmsService
    ? {
        title: cmsService.title,
        icon: cmsService.icon,
        shortDesc: cmsService.short_desc,
        fullDesc: cmsService.full_desc,
        subServices: cmsService.sub_services,
        image: cmsService.image_url || "",
        seoTitle: cmsService.seo_title,
        seoDescription: cmsService.seo_description,
        ctaText: cmsService.cta_text,
        slug: cmsService.slug,
      }
    : fallback
    ? {
        title: fallback.title,
        icon: fallback.icon,
        shortDesc: fallback.shortDesc,
        fullDesc: fallback.fullDesc,
        subServices: fallback.subServices,
        image: fallback.image,
        seoTitle: fallback.seoTitle,
        seoDescription: fallback.seoDescription,
        ctaText: fallback.ctaText,
        slug: fallback.slug,
      }
    : null;

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </main>
    );
  }

  if (!service) return <Navigate to="/servicos" replace />;

  const pool: NormalisedService[] = (allServices || fallbackServices).map((s) => normaliseServiceRow(s));
  const related = pool
    .filter((s) => s.slug !== slug)
    .slice(0, 2);

  return (
    <>
      <Helmet>
        <title>{service.seoTitle} | DBW Fitness Luanda</title>
        <meta name="description" content={service.seoDescription} />
      </Helmet>
      <main>
        <Navbar />

        <section className="relative pt-28 pb-20 px-6 overflow-hidden">
          {service.image && (
            <div className="absolute inset-0">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-foreground/80" />
            </div>
          )}
          <div className="relative container mx-auto text-primary-foreground">
            <Link to="/servicos" className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground text-sm font-sans mb-6">
              <ArrowLeft className="w-4 h-4" /> Voltar aos Serviços
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-4xl mb-4 block">{service.icon}</span>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{service.title}</h1>
              <p className="text-primary-foreground/70 text-lg max-w-2xl font-sans">{service.shortDesc}</p>
              <Button asChild size="lg" className="mt-8 uppercase font-display font-bold tracking-wider">
                <Link to="/reservar">Reservar Vaga →</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Sobre Este Serviço</h2>
                <p className="text-muted-foreground font-sans leading-relaxed text-lg">{service.fullDesc}</p>
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground text-lg uppercase mb-4">O Que Inclui</h3>
                <ul className="space-y-3">
                  {service.subServices.map((sub) => (
                    <li key={sub} className="flex items-start gap-3 text-sm font-sans text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-primary text-primary-foreground text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-primary-foreground/80 font-sans mb-8 max-w-md mx-auto">Reserve a sua vaga e comece a sua transformação hoje.</p>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground uppercase font-display font-bold tracking-wider">
            <Link to="/reservar">Reservar a Minha Vaga →</Link>
          </Button>
        </section>

        <section className="section-padding bg-secondary">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-10">Outros Serviços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {related.map((r) => (
                <Link key={r.slug} to={`/servicos/${r.slug}`} className="group block rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{r.icon}</span>
                    <h3 className="font-display font-bold text-foreground uppercase">{r.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm font-sans">{r.shortDesc}</p>
                </Link>
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

export default ServiceDetail;
