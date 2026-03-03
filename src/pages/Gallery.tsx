import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCmsGallery } from "@/hooks/useCms";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTABanner from "@/components/CTABanner";
import servicesSwim from "@/assets/services-swim.jpg";
import servicesAquatic from "@/assets/services-aquatic.jpg";
import servicesWellness from "@/assets/services-wellness.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const fallbackPhotos = [
  { src: servicesSwim, alt: "Natação DBW Luanda", category: "Actividades Aquáticas" },
  { src: servicesAquatic, alt: "Actividades aquáticas DBW", category: "Actividades Aquáticas" },
  { src: servicesWellness, alt: "Bem-estar DBW", category: "Treinos" },
  { src: heroBg, alt: "Treino DBW Luanda", category: "Treinos" },
  { src: servicesSwim, alt: "Aula de grupo DBW", category: "Aulas em Grupo" },
  { src: servicesWellness, alt: "Ginástica laboral DBW", category: "Ginástica Laboral" },
];

const Gallery = () => {
  const [active, setActive] = useState<string>("Todas");
  const { data: cmsGallery, isLoading, isError } = useCmsGallery();

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </main>
    );
  }

  const photos = !isError && cmsGallery && cmsGallery.length > 0
    ? cmsGallery.map((img) => ({ src: img.image_url, alt: img.alt, category: img.category }))
    : fallbackPhotos;

  const allCategories = ["Todas", ...Array.from(new Set(photos.map((p) => p.category)))];
  const filtered = active === "Todas" ? photos : photos.filter((p) => p.category === active);

  return (
    <>
      <Helmet>
        <title>Galeria | DBW Fitness Luanda</title>
        <meta name="description" content="Veja a galeria de fotos da DBW Fitness em Luanda. Actividades aquáticas, treinos personalizados e aulas em grupo." />
      </Helmet>
      <main>
        <Navbar />

        <section className="bg-foreground text-primary-foreground pt-28 pb-20 px-6">
          <div className="container mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold">
              <span className="text-primary">Galeria</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-primary-foreground/60 font-sans mt-4">
              Momentos reais dos nossos programas em Luanda
            </motion.p>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-display font-bold uppercase tracking-wide transition-all duration-200 ${
                    active === cat
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-card)]"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((photo, i) => (
                <motion.div
                  key={`${photo.src}-${photo.alt}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="break-inside-avoid rounded-lg overflow-hidden"
                >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground font-sans mb-3">Siga-nos para mais conteúdo</p>
              <a
                href="https://www.instagram.com/dbwfitness"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-display font-bold uppercase tracking-wide hover:underline"
              >
                Seguir @DBWFITNESS →
              </a>
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

export default Gallery;
