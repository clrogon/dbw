import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Image, Dumbbell, DollarSign, Users, Images, LogOut, Home,
} from "lucide-react";
import dbwLogo from "@/assets/dbw-logo.jpeg";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Hero", href: "/admin/hero", icon: Image },
  { label: "Serviços", href: "/admin/servicos", icon: Dumbbell },
  { label: "Preços", href: "/admin/precos", icon: DollarSign },
  { label: "Instrutores", href: "/admin/instrutores", icon: Users },
  { label: "Galeria", href: "/admin/galeria", icon: Images },
];

const AdminLayout = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-foreground text-primary-foreground flex flex-col shrink-0">
        <div className="p-4 border-b border-primary-foreground/10">
          <img src={dbwLogo} alt="DBW" className="h-8 brightness-0 invert" />
          <p className="text-xs text-primary-foreground/40 mt-1 font-display uppercase tracking-wider">
            Gestão de Conteúdo
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-primary-foreground/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ver Site
          </a>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
