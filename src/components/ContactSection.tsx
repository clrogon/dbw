import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const phones = [
  { number: "929 873 204", href: "tel:+244929873204" },
  { number: "941 079 556", href: "tel:+244941079556" },
  { number: "923 087 874", href: "tel:+244923087874" },
];

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding bg-foreground text-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">Contacto</p>
          <h2 className="text-3xl md:text-5xl font-bold">Fale Connosco</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start gap-4 mb-8">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-sans font-semibold text-lg mb-1">Localização</h3>
                <p className="text-background/70 leading-relaxed">
                  Talatona – Condomínio Dolce Vita,<br />
                  Restaurante Miralua
                </p>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-lg overflow-hidden border border-background/10 h-48 bg-background/5 flex items-center justify-center">
              <iframe
                title="DBW Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15770.69!2d13.23!3d-8.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNTUnMTIuMCJTIDEzwrAxMycwMC4wIkU!5e0!3m2!1spt!2sao!4v1700000000000"
                className="w-full h-full border-0 rounded-lg"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-start gap-4 mb-8">
              <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-sans font-semibold text-lg mb-1">Telefone</h3>
                <p className="text-background/70">Ligue ou envie mensagem</p>
              </div>
            </div>

            <div className="space-y-4">
              {phones.map((p) => (
                <Button
                  key={p.number}
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-base border-background/20 text-background hover:bg-background/10 hover:text-background"
                >
                  <a href={p.href}>
                    <Phone className="w-4 h-4 mr-3" />
                    {p.number}
                  </a>
                </Button>
              ))}

              <Button asChild size="lg" className="w-full text-base mt-4">
                <a
                  href="https://wa.me/244929873204"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
