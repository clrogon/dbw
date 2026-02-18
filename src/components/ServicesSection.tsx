import { motion } from "framer-motion";
import servicesSwim from "@/assets/services-swim.jpg";
import servicesAquatic from "@/assets/services-aquatic.jpg";
import servicesWellness from "@/assets/services-wellness.jpg";

const services = [
  {
    img: servicesSwim,
    title: "Aulas de Natação",
    desc: "Aulas estruturadas para todas as idades com foco em segurança aquática, técnica e confiança na água.",
  },
  {
    img: servicesAquatic,
    title: "Actividades Aquáticas",
    desc: "Programas dinâmicos em meio aquático que promovem saúde cardiovascular e bem-estar geral.",
  },
  {
    img: servicesWellness,
    title: "Programas de Bem-Estar",
    desc: "Iniciativas focadas no equilíbrio entre corpo e mente, integrando exercício físico e saúde mental.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">Serviços</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">O Que Oferecemos</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group rounded-lg overflow-hidden border border-border bg-card"
            >
              <div className="overflow-hidden h-64">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-8">
                <h3 className="font-sans font-semibold text-foreground text-xl mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
