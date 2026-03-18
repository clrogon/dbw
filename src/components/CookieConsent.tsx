import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "dbw_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const dismiss = () => {
    localStorage.setItem(COOKIE_KEY, "dismissed");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-xl border border-border bg-card p-5 shadow-xl sm:left-auto sm:right-6 sm:bottom-6"
        >
          <button
            onClick={dismiss}
            aria-label="Fechar"
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3">
            <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-foreground">
                Utilizamos cookies para melhorar a sua experiência no nosso site.
                Ao continuar a navegar, concorda com a nossa{" "}
                <a
                  href="/politica-de-privacidade"
                  className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  Política de Privacidade
                </a>
                .
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={accept}>
                  Aceitar
                </Button>
                <Button size="sm" variant="outline" onClick={dismiss}>
                  Recusar
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
