import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/244922569283?text=Ol%C3%A1!%20Tenho%20interesse%20nos%20servi%C3%A7os%20da%20DBW."
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
