import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade | DBW Fitness</title>
        <meta name="description" content="Política de privacidade e cookies da DBW — Domingos, Baltazar & William. Saiba como protegemos os seus dados." />
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-3xl prose prose-lg dark:prose-invert">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            Política de Privacidade e Cookies
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Última actualização: {new Date().toLocaleDateString("pt-AO", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">1. Responsável pelo Tratamento</h2>
            <p className="text-foreground/80">
              A <strong>DBW — Domingos, Baltazar & William</strong> (NIF N° 5001683969), com sede em Luanda, Angola,
              é a entidade responsável pelo tratamento dos dados pessoais recolhidos através deste website.
            </p>
            <ul className="text-foreground/80 list-disc pl-5 space-y-1">
              <li>Email: <a href="mailto:dbwtreinos@gmail.com" className="text-primary hover:underline">dbwtreinos@gmail.com</a></li>
              <li>Telefone: <a href="tel:+244922569283" className="text-primary hover:underline">+244 922 569 283</a></li>
            </ul>
          </section>

          <section className="space-y-4 mt-10">
            <h2 className="font-display text-xl font-bold text-foreground">2. Dados Pessoais Recolhidos</h2>
            <p className="text-foreground/80">
              Recolhemos apenas os dados necessários para prestar os nossos serviços:
            </p>
            <ul className="text-foreground/80 list-disc pl-5 space-y-1">
              <li>Nome completo</li>
              <li>Endereço de email</li>
              <li>Número de telefone</li>
              <li>Dados fornecidos voluntariamente nos formulários de contacto e reserva</li>
            </ul>
          </section>

          <section className="space-y-4 mt-10">
            <h2 className="font-display text-xl font-bold text-foreground">3. Finalidades do Tratamento</h2>
            <p className="text-foreground/80">Os seus dados são utilizados para:</p>
            <ul className="text-foreground/80 list-disc pl-5 space-y-1">
              <li>Responder a pedidos de informação e contacto</li>
              <li>Processar reservas de aulas e serviços</li>
              <li>Enviar comunicações relacionadas com os nossos serviços (apenas com o seu consentimento)</li>
              <li>Melhorar a experiência de utilização do website</li>
            </ul>
          </section>

          <section className="space-y-4 mt-10">
            <h2 className="font-display text-xl font-bold text-foreground">4. Partilha de Dados</h2>
            <p className="text-foreground/80">
              Não vendemos, alugamos nem partilhamos os seus dados pessoais com terceiros para fins comerciais.
              Os dados podem ser partilhados com prestadores de serviços tecnológicos estritamente necessários
              ao funcionamento do website (alojamento, base de dados), sob obrigação de confidencialidade.
            </p>
          </section>

          <section className="space-y-4 mt-10">
            <h2 className="font-display text-xl font-bold text-foreground">5. Política de Cookies</h2>
            <p className="text-foreground/80">
              Este website utiliza cookies para garantir o seu bom funcionamento e melhorar a experiência do utilizador.
            </p>
            <h3 className="font-display text-lg font-semibold text-foreground">O que são cookies?</h3>
            <p className="text-foreground/80">
              Cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando visita um website.
              Permitem que o site recorde informações sobre a sua visita, facilitando a navegação e tornando-a mais útil.
            </p>
            <h3 className="font-display text-lg font-semibold text-foreground">Cookies que utilizamos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-foreground/80 border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-3 text-left font-semibold text-foreground">Cookie</th>
                    <th className="p-3 text-left font-semibold text-foreground">Finalidade</th>
                    <th className="p-3 text-left font-semibold text-foreground">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3 font-mono text-xs">dbw_cookie_consent</td>
                    <td className="p-3">Guardar a sua preferência de cookies</td>
                    <td className="p-3">6 meses</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-mono text-xs">sb-*-auth-token</td>
                    <td className="p-3">Sessão de autenticação (área administrativa)</td>
                    <td className="p-3">Sessão</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-foreground/80">
              Pode gerir as suas preferências de cookies a qualquer momento através das definições do seu navegador
              ou clicando no botão "Recusar" no aviso de cookies.
            </p>
          </section>

          <section className="space-y-4 mt-10">
            <h2 className="font-display text-xl font-bold text-foreground">6. Segurança dos Dados</h2>
            <p className="text-foreground/80">
              Adoptamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais contra
              acesso não autorizado, perda, destruição ou alteração. O acesso aos dados está limitado a
              pessoal autorizado da DBW.
            </p>
          </section>

          <section className="space-y-4 mt-10">
            <h2 className="font-display text-xl font-bold text-foreground">7. Os Seus Direitos</h2>
            <p className="text-foreground/80">Tem o direito de:</p>
            <ul className="text-foreground/80 list-disc pl-5 space-y-1">
              <li>Aceder aos seus dados pessoais</li>
              <li>Solicitar a rectificação de dados inexactos</li>
              <li>Solicitar a eliminação dos seus dados</li>
              <li>Retirar o consentimento a qualquer momento</li>
            </ul>
            <p className="text-foreground/80">
              Para exercer qualquer destes direitos, entre em contacto connosco através do email{" "}
              <a href="mailto:dbwtreinos@gmail.com" className="text-primary hover:underline">dbwtreinos@gmail.com</a>.
            </p>
          </section>

          <section className="space-y-4 mt-10">
            <h2 className="font-display text-xl font-bold text-foreground">8. Alterações a esta Política</h2>
            <p className="text-foreground/80">
              Reservamo-nos o direito de actualizar esta política a qualquer momento. Recomendamos que a consulte
              periodicamente. A data da última actualização está indicada no topo desta página.
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default PrivacyPolicy;
