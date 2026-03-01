import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, Heart, Users } from "lucide-react";
import { useCmsInstructors } from "@/hooks/useCms";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import imgDomingos from "@/assets/instructor-domingos.jpg";
import imgBaltazar from "@/assets/instructor-baltazar.jpg";
import imgWilliam from "@/assets/instructor-william.jpg";

const fallbackInstructors = [
  { name: "Domingos", role: "Co-Fundador & Instrutor Principal", specialties: ["Treino Personalizado", "Musculação", "Kickboxing"], bio: "Licenciado em Educação Física com vasta experiência em gestão desportiva e treino personalizado.", image: imgDomingos },
  { name: "Baltazar", role: "Co-Fundador & Instrutor de Natação", specialties: ["Actividades Aquáticas", "Hidroginástica", "Natação Infantil"], bio: "Especialista em actividades aquáticas com foco na segurança e desenvolvimento técnico.", image: imgBaltazar },
  { name: "William", role: "Co-Fundador & Instrutor de Grupo", specialties: ["Aulas em Grupo", "Aeróbica", "Funcional", "Spinning"], bio: "Profissional certificado em Educação Física, especialista em aulas dinâmicas e motivadoras.", image: imgWilliam },
];

const values = [
  { icon: Award, title: "Profissionais Certificados", desc: "Todos os instrutores possuem licenciatura em Educação Física." },
  { icon: Heart, title: "Metodologia Personalizada", desc: "Treinos adaptados ao ritmo e objectivos de cada cliente." },
  { icon: Users, title: "Resultados Comprovados", desc: "Mais de 500 clientes satisfeitos em Luanda." },
];

const Instructors = () => {
  const { data: cmsInstructors, isLoading, isError } = useCmsInstructors();

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

  const instructors = !isError && cmsInstructors && cmsInstructors.length > 0
    ? cmsInstructors.map((i) => ({
        name: i.name, role: i.role, specialties: i.specialties,
        bio: i.bio, image: i.image_url || "",
      }))
    : fallbackInstructors;

  return (
    <>
      <Helmet>
        <title>Instrutores — DBW Fitness Luanda</title>
        <meta name="description" content="Conheça os profissionais certificados da DBW. Domingos, Baltazar e William — licenciados em Educação Física dedicados à sua saúde em Luanda." />
      </Helmet>
      <main>
        <Navbar />

        <section className="bg-foreground text-primary-foreground pt-28 pb-16 px-6">
          <div className="container mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold">
              OS NOSSOS <span className="text-primary">INSTRUTORES</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-primary-foreground/60 font-sans mt-4 max-w-2xl mx-auto">
              Três profissionais de Educação Física unidos pela missão de promover saúde, bem-estar e desenvolvimento físico em Luanda.
            </motion.p>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {instructors.map((instructor, i) => (
                <motion.div
                  key={instructor.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg mb-6">
                    {instructor.image && (
                      <img
                        src={instructor.image}
                        alt={`${instructor.name} — Instrutor DBW Fitness`}
                        className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/95 via-foreground/60 to-transparent p-6 pt-16">
                      <h2 className="text-2xl font-bold text-primary-foreground font-display uppercase">{instructor.name}</h2>
                      <p className="text-primary text-sm font-sans font-medium">{instructor.role}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-4">{instructor.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((s) => (
                      <span key={s} className="text-xs font-sans font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-secondary">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              PORQUE CONFIAR NA <span className="text-primary">DBW</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((v, i) => (
                <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <v.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-display font-bold text-foreground uppercase text-lg mb-2">{v.title}</h3>
                  <p className="text-muted-foreground font-sans text-sm">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-primary text-primary-foreground text-center">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">PRONTO PARA COMEÇAR?</h2>
            <p className="font-sans text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Agende a sua primeira sessão com um dos nossos instrutores certificados.
            </p>
            <Button asChild size="lg" variant="secondary" className="uppercase font-display font-bold tracking-wider">
              <Link to="/reservar">Reservar a Minha Vaga →</Link>
            </Button>
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default Instructors;
