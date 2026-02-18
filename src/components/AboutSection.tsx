import { motion } from "framer-motion";
import { Shield, Heart, Users, Award } from "lucide-react";

const values = [
  { icon: Shield, title: "Segurança", desc: "Protocolos rigorosos e supervisão profissional em todas as actividades." },
  { icon: Heart, title: "Cuidado", desc: "Abordagem centrada na saúde física e mental de cada participante." },
  { icon: Users, title: "Comunidade", desc: "Um ambiente acolhedor para famílias e adultos de todas as idades." },
  { icon: Award, title: "Profissionalismo", desc: "Equipa qualificada com experiência em saúde e actividades aquáticas." },
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-secondary">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">Sobre Nós</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Quem é a DBW?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A <strong className="text-foreground">DBW – Saúde Services</strong> é um serviço de saúde e bem-estar em Luanda,
            dedicado a promover uma mente activa e uma vida saudável através de actividades aquáticas estruturadas
            e programas de bem-estar com acompanhamento profissional.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-lg p-8 text-center border border-border"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-sans font-semibold text-foreground text-lg mb-2">{v.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
