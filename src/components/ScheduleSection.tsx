import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const scheduleData = [
  {
    period: "Manhã – Terça a Sexta",
    slots: ["08h00 – 08h45", "09h00 – 09h45", "10h00 – 10h45"],
  },
  {
    period: "Manhã – Sábado",
    slots: ["09h00 – 09h45", "10h00 – 10h45", "11h00 – 11h45"],
  },
  {
    period: "Tarde – Terça a Sexta",
    slots: ["15h00 – 15h45", "16h00 – 16h45", "17h00 – 17h45"],
  },
];

const ScheduleSection = () => {
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
          <p className="text-primary font-display font-bold tracking-widest uppercase text-sm mb-3">Horários</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">Horários Disponíveis</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {scheduleData.map((block, i) => (
            <motion.div
              key={block.period}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border rounded-lg p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-foreground uppercase text-sm">{block.period}</h3>
              </div>
              <ul className="space-y-3">
                {block.slots.map((slot) => (
                  <li
                    key={slot}
                    className="text-muted-foreground text-sm bg-secondary rounded-md px-4 py-3 text-center font-sans font-medium"
                  >
                    {slot}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
