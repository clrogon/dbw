import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, Smartphone, CheckCircle, Share, MoreVertical } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIos(/iPad|iPhone|iPod/.test(ua));

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20 max-w-2xl">
        <div className="text-center mb-10">
          <Smartphone className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Instalar App DBW
          </h1>
          <p className="text-muted-foreground text-lg">
            Acede rapidamente ao DBW Fitness directo do teu telemóvel — sem precisar da App Store.
          </p>
        </div>

        {isInstalled ? (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex items-center gap-4 p-6">
              <CheckCircle className="w-10 h-10 text-primary flex-shrink-0" />
              <div>
                <p className="text-lg font-semibold text-foreground">App já instalada!</p>
                <p className="text-muted-foreground">Podes encontrar a app DBW no teu ecrã inicial.</p>
              </div>
            </CardContent>
          </Card>
        ) : deferredPrompt ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Pronto para instalar</CardTitle>
              <CardDescription>Clica no botão abaixo para adicionar ao ecrã inicial</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" onClick={handleInstall} className="gap-2">
                <Download className="w-5 h-5" />
                Instalar App
              </Button>
            </CardContent>
          </Card>
        ) : isIos ? (
          <Card>
            <CardHeader>
              <CardTitle>Como instalar no iPhone/iPad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-medium text-foreground">Abre no Safari</p>
                  <p className="text-sm text-muted-foreground">Certifica-te que estás a usar o Safari (não Chrome ou outro).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">Toca em</p>
                  <Share className="w-5 h-5 text-primary" />
                  <p className="font-medium text-foreground">(Partilhar)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-medium text-foreground">Seleciona "Adicionar ao Ecrã Inicial"</p>
                  <p className="text-sm text-muted-foreground">A app aparecerá no teu ecrã como qualquer outra app.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Como instalar no Android</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-medium text-foreground">Abre no Chrome</p>
                  <p className="text-sm text-muted-foreground">Usa o Google Chrome para aceder a este site.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">Toca em</p>
                  <MoreVertical className="w-5 h-5 text-primary" />
                  <p className="font-medium text-foreground">(menu)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-medium text-foreground">Seleciona "Instalar app" ou "Adicionar ao ecrã inicial"</p>
                  <p className="text-sm text-muted-foreground">A app ficará disponível como qualquer outra.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: "⚡", title: "Rápido", desc: "Carrega instantaneamente" },
            { icon: "📶", title: "Offline", desc: "Funciona sem internet" },
            { icon: "🔔", title: "Prático", desc: "Acesso directo do ecrã" },
          ].map((f) => (
            <div key={f.title} className="text-center p-4 rounded-lg bg-muted/50">
              <span className="text-3xl">{f.icon}</span>
              <p className="font-semibold mt-2 text-foreground">{f.title}</p>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Install;
