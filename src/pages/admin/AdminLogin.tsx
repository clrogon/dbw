import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import dbwLogo from "@/assets/dbw-logo.jpeg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const { error, isAdmin } = await signIn(email, password);
    
    if (error) {
      // Improve UX for rate-limiting / brute-force scenarios
      const msg = (error as any)?.message?.toLowerCase?.() ?? "";
      if (msg.includes("rate") || msg.includes("too many") || msg.includes("tentativas")) {
        setError("Demasiadas tentativas. Tente novamente mais tarde.");
      } else {
        setError("Credenciais inválidas. Verifique o email e a password.");
      }
      setLoading(false);
      return;
    }
    
    if (!isAdmin) {
      setError("Esta conta não tem permissões de administrador.");
      setLoading(false);
      return;
    }
    
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={dbwLogo} alt="DBW" className="h-12 mx-auto mb-4 brightness-0 invert" />
          <div className="flex items-center justify-center gap-2 text-primary-foreground/60">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-display uppercase tracking-wider">Área Administrativa</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-primary-foreground/70 text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-foreground/50 border-primary-foreground/20 text-primary-foreground"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-primary-foreground/70 text-sm">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-foreground/50 border-primary-foreground/20 text-primary-foreground"
              required
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full uppercase font-display font-bold tracking-wider" disabled={loading}>
            {loading ? "A entrar..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
