import SiteSeo from "@/components/SiteSeo";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import ServicesPreview from "@/components/ServicesPreview";
import PricingSection from "@/components/PricingSection";
import ScheduleSection from "@/components/ScheduleSection";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <>
      <SiteSeo
        title="DBW — Mente Activa, Vida Saudável | Fitness em Luanda, Angola"
        description="DBW oferece natação, treinos personalizados, ginástica laboral e aulas em grupo em Luanda, Angola. Profissionais certificados."
        path="/"
      />
      <main>
        <Navbar />
        <HeroSection />
        <TrustSection />
        <ServicesPreview />
        <PricingSection />
        <ScheduleSection />
        <CTABanner />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default Index;
