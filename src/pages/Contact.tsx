import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CTABanner from "@/components/CTABanner";

const phones = [
  { number: "922 569 283", href: "tel:+244922569283" },
  { number: "941 079 556", href: "tel:+244941079556" },
  { number: "929 873 204", href: "tel:+244929873204" },
];

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contacto | DBW Fitness Luanda</title>
        <meta name="description" content="Contacte a DBW Fitness em Luanda. Telefone, email, localização e WhatsApp. Estamos prontos para ajudar." />
      </Helmet>
      <main>
        <Navbar />

        <section className="bg-foreground text-primary-foreground pt-28 pb-20 px-6">
          <div className="container mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold">
              Fale <span className="text-primary">Connosco</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-primary-foreground/60 font-sans mt-4 max-w-lg mx-auto">
              Estamos disponíveis para responder a todas as suas questões. Contacte-nos por telefone, email ou WhatsApp.
            </motion.p>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Location */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex items-start gap-4 mb-8">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg uppercase mb-1">Localização</h3>
                    <p className="text-muted-foreground font-sans leading-relaxed">Luanda, Angola</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-8">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg uppercase mb-1">Email</h3>
                    <a href="mailto:dbwtreinos@gmail.com" className="text-muted-foreground font-sans hover:text-primary transition-colors">dbwtreinos@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-8">
                  <Instagram className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg uppercase mb-1">Instagram</h3>
                    <a href="https://www.instagram.com/dbwfitness" target="_blank" rel="noopener noreferrer" className="text-muted-foreground font-sans hover:text-primary transition-colors">@DBWFITNESS</a>
                  </div>
                </div>

                {/* Map */}
                <div className="rounded-lg overflow-hidden border border-border h-48">
                  <iframe
                    title="DBW Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15770.69!2d13.23!3d-8.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNTUnMTIuMCJTIDEzwrAxNycwMC4wIkU!5e0!3m2!1spt!2sao!4v1700000000000"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <div className="flex items-start gap-4 mb-8">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg uppercase mb-1">Telefone</h3>
                    <p className="text-muted-foreground font-sans">Ligue ou envie mensagem</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {phones.map((p) => (
                    <Button key={p.number} asChild variant="outline" size="lg" className="w-full justify-start text-base">
                      <a href={p.href}>
                        <Phone className="w-4 h-4 mr-3" />
                        {p.number}
                      </a>
                    </Button>
                  ))}

                  <Button asChild size="lg" className="w-full text-base mt-4 uppercase font-display font-bold tracking-wider">
                    <a
                      href="https://wa.me/244922569283?text=Ol%C3%A1!%20Tenho%20interesse%20nos%20servi%C3%A7os%20da%20DBW."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Enviar WhatsApp →
                    </a>
                  </Button>
                </div>

                <div className="mt-8 p-6 bg-secondary rounded-lg border border-border">
                  <h3 className="font-display font-bold text-foreground uppercase mb-2">Horário de Funcionamento</h3>
                  <ul className="space-y-1 font-sans text-sm text-muted-foreground">
                    <li>Segunda a Sexta: 06h00 – 20h00</li>
                    <li>Sábado: 07h00 – 14h00</li>
                    <li>Domingo: Encerrado</li>
                  </ul>
                </div>
              </motion.div>
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

export default Contact;
