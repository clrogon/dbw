import { motion } from "framer-motion";
import { GraduationCap, HeartHandshake, TrendingUp, UserCheck } from "lucide-react";

const reasons = [
  { icon: GraduationCap, text: "Profissionais com licenciatura em Educação Física" },
  { icon: HeartHandshake, text: "Metodologia adaptada ao ritmo de cada cliente" },
  { icon: TrendingUp, text: "Resultados comprovados em crianças, adultos e empresas" },
  { icon: UserCheck, text: "Atendimento personalizado desde o primeiro contacto" },
];

const TrustSection = () => {
  return (
    <section className="section-padding bg-foreground text-primary-foreground">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Porque escolher a <span className="text-primary">DBW</span>?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <r.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-primary-foreground/80 font-sans text-base leading-relaxed pt-2">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
