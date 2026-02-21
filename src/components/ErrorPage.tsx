import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, WifiOff, Lock, AlertTriangle, Search } from "lucide-react";

interface ErrorPageProps {
  code: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

const ErrorPage = ({ code, title, description, icon, action }: ErrorPageProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <h1 className="mb-2 text-8xl font-bold tracking-tight text-primary/20">{code}</h1>
        <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
        <p className="mb-8 max-w-md text-muted-foreground">{description}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>
          {action && (
            <Button variant="outline" asChild>
              <Link to={action.href}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const NotFound = () => (
  <ErrorPage
    code="404"
    title="Página Não Encontrada"
    description="A página que procura não existe ou foi movida. Verifique o URL ou navegue para outra página."
    icon={<Search className="h-12 w-12" />}
  />
);

export const ServerError = () => (
  <ErrorPage
    code="500"
    title="Erro do Servidor"
    description="Ocorreu um erro interno no servidor. A nossa equipa já foi notificada. Por favor, tente novamente mais tarde."
    icon={<AlertTriangle className="h-12 w-12" />}
  />
);

export const Forbidden = () => (
  <ErrorPage
    code="403"
    title="Acesso Negado"
    description="Não tem permissão para aceder a esta página. Se acredita que isto é um erro, contacte o suporte."
    icon={<Lock className="h-12 w-12" />}
    action={{ label: "Contactar Suporte", href: "/contacto" }}
  />
);

export const Offline = () => (
  <ErrorPage
    code="Offline"
    title="Sem Conexão"
    description="Parece que está sem conexão à internet. Verifique a sua ligação e tente novamente."
    icon={<WifiOff className="h-12 w-12" />}
    action={{ label: "Tentar Novamente", href: window.location.pathname }}
  />
);

export default ErrorPage;
