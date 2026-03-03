import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useHeroContent } from "@/hooks/useCms";

const CTABanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const { data: hero, isLoading, isError } = useHeroContent();

  useEffect(() => {
    if (sessionStorage.getItem("dbw-banner-dismissed")) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("dbw-banner-dismissed", "true");
  };

  if (dismissed) return null;

  // Prefer CMS content if available
  const bannerText = !isLoading && hero?.subtitle ? hero.subtitle : "Vagas disponíveis para Julho · Garanta já o seu lugar";
  const ctaText = !isLoading && hero?.cta_primary_text ? hero.cta_primary_text : "Reservar Agora →";
  const ctaLink = !isLoading && hero?.cta_primary_link ? hero.cta_primary_link : "/reservar";

  return (
    <div className="bg-primary text-primary-foreground py-3 px-6">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <p className="text-sm font-sans font-medium flex-1 text-center">{bannerText}</p>
        <Button asChild size="sm" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground uppercase font-display font-bold text-xs tracking-wider shrink-0">
          <Link to={ctaLink}>{ctaText}</Link>
        </Button>
        <button onClick={handleDismiss} className="text-primary-foreground/70 hover:text-primary-foreground shrink-0" aria-label="Fechar banner">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CTABanner;
