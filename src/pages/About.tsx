import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Shield, Heart, Users, Award, Target, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTABanner from "@/components/CTABanner";

const values = [
  { icon: Shield, title: "Segurança", desc: "Protocolos rigorosos e supervisão profissional em todas as actividades." },
  { icon: Heart, title: "Cuidado", desc: "Abordagem centrada na saúde física e mental de cada participante." },
  { icon: Users, title: "Comunidade", desc: "Ambiente acolhedor para famílias e adultos de todas as idades." },
  { icon: Award, title: "Profissionalismo", desc: "Equipa qualificada com licenciatura em Educação Física." },
  { icon: Target, title: "Resultados", desc: "Metodologia adaptada ao ritmo de cada cliente para resultados reais." },
  { icon: Dumbbell, title: "Diversidade", desc: "Quatro modalidades desportivas para todas as necessidades." },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>Sobre Nós | DBW Fitness Luanda</title>
        <meta name="description" content="Conheça a DBW — Domingos, Baltazar & William. Empresa de fitness e bem-estar em Luanda com profissionais certificados." />
      </Helmet>
      <main>
        <Navbar />

        {/* Hero */}
        <section className="bg-foreground text-primary-foreground pt-28 pb-20 px-6">
          <div className="container mx-auto text-center">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary font-display font-bold tracking-widest uppercase text-sm mb-3">Sobre Nós</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold mb-6">
              Quem é a <span className="text-primary">DBW</span>?
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-primary-foreground/70 text-lg max-w-2xl mx-auto font-sans leading-relaxed">
              A <strong className="text-primary-foreground">DBW — Domingos, Baltazar & William</strong> é uma empresa de fitness, desporto e bem-estar em Luanda, dedicada a promover uma mente activa e uma vida saudável. Mais de 500 clientes confiam na nossa equipa de profissionais certificados.
            </motion.p>
          </div>
        </section>

        {/* Mission */}
        <section className="section-padding bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">A Nossa Missão</h2>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  Transformar vidas através do desporto e do bem-estar. Acreditamos que uma mente activa é o caminho para uma vida saudável, e trabalhamos todos os dias para tornar o fitness acessível, profissional e motivador em Luanda.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">A Nossa Visão</h2>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  Ser a referência em saúde, fitness e bem-estar em Angola — uma empresa que as famílias, os profissionais e as empresas escolhem pela qualidade, pela confiança e pelos resultados.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-secondary">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-14">Os Nossos Valores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border rounded-lg p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <v.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-lg uppercase mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm font-sans">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-primary text-primary-foreground text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-primary-foreground/80 font-sans mb-8 max-w-lg mx-auto">Junte-se a mais de 500 clientes que confiam na DBW para a sua saúde e bem-estar.</p>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground uppercase font-display font-bold tracking-wider">
            <Link to="/reservar">Reservar a Minha Vaga →</Link>
          </Button>
        </section>

        <CTABanner />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default About;
