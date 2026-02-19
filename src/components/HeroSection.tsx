import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="DBW Fitness Luanda — treino profissional" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-foreground/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground leading-[0.95] max-w-5xl mx-auto"
        >
          TRANSFORME O SEU CORPO.{" "}
          <span className="text-primary">LIBERTE A SUA MENTE.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto font-sans"
        >
          Programas de fitness personalizados para quem quer resultados reais em Luanda.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="text-base px-8 uppercase font-display font-bold tracking-wider">
            <Link to="/reservar">Reservar a Minha Vaga →</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground uppercase font-display font-bold tracking-wider">
            <Link to="/servicos">Ver Os Nossos Serviços</Link>
          </Button>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute bottom-0 left-0 right-0 bg-foreground/90 backdrop-blur-sm border-t border-muted/10"
      >
        <div className="container mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "500+", label: "Clientes Satisfeitos" },
            { value: "5+", label: "Anos de Experiência" },
            { value: "4", label: "Modalidades Desportivas" },
            { value: "3", label: "Profissionais Certificados" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl md:text-3xl font-bold text-primary font-display">{stat.value}</p>
              <p className="text-xs md:text-sm text-primary-foreground/60 font-sans mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
