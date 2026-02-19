import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>DBW — Mente Activa, Vida Saudável | Fitness em Luanda, Angola</title>
        <meta name="description" content="DBW oferece natação, treinos personalizados, ginástica laboral e aulas em grupo em Luanda, Angola. Profissionais certificados." />
      </Helmet>
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
