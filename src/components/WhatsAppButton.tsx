import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/safeUrls";

const WhatsAppButton = () => {
  const href = buildWhatsAppUrl(
    "Olá! Tenho interesse nos serviços da DBW."
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse"
      aria-label="Contactar via WhatsApp"
      title="Fale Connosco"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppButton;
