import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Gallery from "./pages/Gallery";
import Booking from "./pages/Booking";
import Instructors from "./pages/Instructors";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import ServerError from "./pages/ServerError";
import Forbidden from "./pages/Forbidden";
import Offline from "./pages/Offline";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHero from "./pages/admin/AdminHero";
import AdminServices from "./pages/admin/AdminServices";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminInstructors from "./pages/admin/AdminInstructors";
import AdminGallery from "./pages/admin/AdminGallery";

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
            <BrowserRouter>
              <ScrollToTop />
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
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
  );
};

export default App;
