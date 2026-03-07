import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, MessageCircle } from "lucide-react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ThankYou = () => {
  const [params] = useSearchParams();
  const nome = params.get("nome") || "Cliente";
  const location = useLocation();
  const stateWhatsappUrl = (location.state as any)?.whatsappUrl;
  const [whatsappUrl] = useState<string | null>(() => {
    if (typeof stateWhatsappUrl === "string" && stateWhatsappUrl.startsWith("https://wa.me/")) {
      return stateWhatsappUrl;
    }
    return null;
  });

  return (
    <>
      <Helmet>
        <title>Obrigado | DBW Fitness Luanda</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main>
        <Navbar />

        <section className="min-h-screen flex items-center justify-center px-6 pt-16">
          <div className="text-center max-w-lg">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Pedido recebido com sucesso!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground font-sans leading-relaxed mb-8"
            >
              Olá <strong className="text-foreground">{nome}</strong>, a equipa DBW entrará em contacto consigo nas próximas 24 horas úteis. Enquanto aguarda, siga-nos no Instagram.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {whatsappUrl && (
                <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1da851] uppercase font-display font-bold tracking-wider">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Reenviar no WhatsApp
                  </a>
                </Button>
              )}
              <Button asChild size="lg" variant={whatsappUrl ? "outline" : "default"} className="uppercase font-display font-bold tracking-wider">
                <a href="https://www.instagram.com/dbwfitness" target="_blank" rel="noopener noreferrer">
                  Seguir @DBWFITNESS →
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="uppercase font-display font-bold tracking-wider">
                <Link to="/">Voltar ao Início</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default ThankYou;
