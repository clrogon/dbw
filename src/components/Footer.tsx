import { Instagram, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Início", href: "/" },
  { label: "Sobre Nós", href: "/sobre" },
  { label: "Galeria", href: "/galeria" },
  { label: "Reservar", href: "/reservar" },
  { label: "Contacto", href: "/contacto" },
];

const serviceLinks = [
  { label: "Actividades Aquáticas", href: "/servicos/actividades-aquaticas" },
  { label: "Treinos Personalizados", href: "/servicos/treinos-personalizados" },
  { label: "Ginástica Laboral", href: "/servicos/ginastica-laboral" },
  { label: "Aulas em Grupo", href: "/servicos/aulas-em-grupo" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground/60 pt-16 pb-8 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div>
          <p className="font-display text-2xl font-bold text-primary-foreground uppercase mb-3">DBW</p>
          <p className="text-sm leading-relaxed mb-2 font-sans">Mente Activa, Vida Saudável!</p>
          <p className="text-xs text-primary-foreground/40 font-sans">NIF N° 5001683969</p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-display font-bold text-primary-foreground text-sm uppercase tracking-wider mb-4">Navegação</h4>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className="text-sm hover:text-primary-foreground transition-colors font-sans">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-display font-bold text-primary-foreground text-sm uppercase tracking-wider mb-4">Serviços</h4>
          <ul className="space-y-2">
            {serviceLinks.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className="text-sm hover:text-primary-foreground transition-colors font-sans">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-bold text-primary-foreground text-sm uppercase tracking-wider mb-4">Contactos</h4>
          <ul className="space-y-3 font-sans text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              Luanda, Angola
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <a href="tel:+244922569283" className="hover:text-primary-foreground">922 569 283</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <a href="mailto:dbwtreinos@gmail.com" className="hover:text-primary-foreground">dbwtreinos@gmail.com</a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-primary flex-shrink-0" />
              <a href="https://www.instagram.com/dbwfitness" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground">@DBWFITNESS</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto border-t border-primary-foreground/10 pt-6">
        <p className="text-xs text-center font-sans text-primary-foreground/40">
          © {new Date().getFullYear()} DBW — Domingos, Baltazar & William. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
