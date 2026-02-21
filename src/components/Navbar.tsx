import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import dbwLogo from "@/assets/dbw-logo.jpeg";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Serviços", href: "/servicos" },
  { label: "Instrutores", href: "/instrutores" },
  { label: "Galeria", href: "/galeria" },
  { label: "Contacto", href: "/contacto" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrolled || !isHome
    ? "bg-foreground/95 backdrop-blur-md border-b border-muted/10"
    : "bg-transparent";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${navBg}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={dbwLogo} alt="DBW — Mente Activa, Vida Saudável" className="h-10 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors uppercase tracking-wide"
            >
              {link.label}
            </Link>
          ))}
          <a href="tel:+244922569283" className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground">
            <Phone className="w-3.5 h-3.5" />
            922 569 283
          </a>
          <Button asChild size="sm" className="uppercase font-display font-bold tracking-wider">
            <Link to="/reservar">Reservar Vaga</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-primary-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-foreground border-t border-muted/10 px-6 pb-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors uppercase tracking-wide py-1"
            >
              {link.label}
            </Link>
          ))}
          <a href="tel:+244922569283" className="flex items-center gap-2 text-sm text-primary-foreground/70 py-1">
            <Phone className="w-3.5 h-3.5" />
            922 569 283
          </a>
          <Button asChild size="sm" className="w-full uppercase font-display font-bold tracking-wider">
            <Link to="/reservar" onClick={() => setOpen(false)}>Reservar Vaga</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
