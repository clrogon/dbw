import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense, lazy, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import CookieConsent from "@/components/CookieConsent";
import SiteSeo from "@/components/SiteSeo";

// Route-level code splitting: every page below is its own chunk, loaded on
// navigation rather than bundled into the single ~900KB initial download.
// The /admin/* pages in particular (react-hook-form + Zod-heavy CRUD forms)
// are never needed by a public site visitor, so splitting them out shrinks
// what every real customer downloads, not just what admins do.
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Booking = lazy(() => import("./pages/Booking"));
const Instructors = lazy(() => import("./pages/Instructors"));
const Contact = lazy(() => import("./pages/Contact"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ServerError = lazy(() => import("./pages/ServerError"));
const Forbidden = lazy(() => import("./pages/Forbidden"));
const Offline = lazy(() => import("./pages/Offline"));
const Install = lazy(() => import("./pages/Install"));

// Admin
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminHero = lazy(() => import("./pages/admin/AdminHero"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminPricing = lazy(() => import("./pages/admin/AdminPricing"));
const AdminInstructors = lazy(() => import("./pages/admin/AdminInstructors"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <CookieConsent />
            <BrowserRouter>
              <ScrollToTop />
              {/* Global canonical + robots: production host only is indexable */}
              <SiteSeo />
              <Suspense fallback={<RouteFallback />}>
              <Routes>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/servicos/:slug" element={<ServiceDetail />} />
              <Route path="/galeria" element={<Gallery />} />
              <Route path="/instrutores" element={<Instructors />} />
              <Route path="/reservar" element={<Booking />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/obrigado" element={<ThankYou />} />
              <Route path="/erro-500" element={<ServerError />} />
              <Route path="/acesso-negado" element={<Forbidden />} />
              <Route path="/offline" element={<Offline />} />
              <Route path="/instalar" element={<Install />} />
              <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="hero" element={<AdminHero />} />
                <Route path="servicos" element={<AdminServices />} />
                <Route path="precos" element={<AdminPricing />} />
                <Route path="instrutores" element={<AdminInstructors />} />
                <Route path="galeria" element={<AdminGallery />} />
              </Route>

              <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
  );
};

export default App;
