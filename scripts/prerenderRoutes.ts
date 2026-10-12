import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * Static per-route SEO data, intentionally duplicated (not imported) from
 * src/config/site.ts / src/pages/*.tsx / src/data/services.ts: those files
 * import assets through the "@/..." alias, which isn't resolvable while
 * vite.config.ts itself is loading (the alias is defined BY that config).
 * Keep this list in sync with each page's <SiteSeo title=... description=.../>
 * props by hand. A route not listed here simply isn't prerendered — the SPA
 * fallback (index.html) still serves it correctly for real browsers, so an
 * out-of-sync or CMS-only route (e.g. a new admin-added service slug) never
 * 404s, it just won't get a route-specific social preview until added here.
 */
const PRODUCTION_ORIGIN = "https://www.dbwfitness.ao";
const SITE_NAME = "DBW Fitness";
const DEFAULT_OG_IMAGE = `${PRODUCTION_ORIGIN}/og-image.jpg`;

interface RouteSeo {
  route: string;
  title: string;
  description: string;
}

const ROUTES: RouteSeo[] = [
  {
    route: "/sobre",
    title: "Sobre Nós",
    description:
      "Conheça a DBW — Domingos, Baltazar & William. Empresa de fitness e bem-estar em Luanda com profissionais certificados.",
  },
  {
    route: "/servicos",
    title: "Serviços",
    description:
      "Conheça os serviços da DBW: actividades aquáticas, treinos personalizados, ginástica laboral e aulas em grupo em Luanda.",
  },
  {
    route: "/servicos/actividades-aquaticas",
    title: "Aulas de Natação em Luanda — Crianças e Adultos",
    description:
      "DBW oferece aulas de natação para crianças e adultos em Luanda, Angola. Professores certificados, turmas reduzidas, horários flexíveis. Inscreva-se hoje.",
  },
  {
    route: "/servicos/treinos-personalizados",
    title: "Personal Trainer em Luanda — Treino Personalizado",
    description:
      "Treinos personalizados com personal trainer certificado em Luanda. Avaliação gratuita, plano à medida e resultados comprovados. Marque já.",
  },
  {
    route: "/servicos/ginastica-laboral",
    title: "Ginástica Laboral em Luanda — Saúde Corporativa",
    description:
      "Programas de ginástica laboral para empresas em Luanda. Reduza o absentismo, aumente a produtividade. Peça uma proposta à DBW.",
  },
  {
    route: "/servicos/aulas-em-grupo",
    title: "Aulas de Grupo em Luanda — Fitness Colectivo",
    description:
      "Aulas de grupo em Luanda: spinning, funcional, aeróbica e mais. Turmas reduzidas, horários flexíveis. Venha treinar com a DBW.",
  },
  {
    route: "/instrutores",
    title: "Instrutores",
    description:
      "Conheça os profissionais certificados da DBW. Domingos, Baltazar e William — licenciados em Educação Física dedicados à sua saúde em Luanda.",
  },
  {
    route: "/galeria",
    title: "Galeria",
    description:
      "Veja a galeria de fotos da DBW Fitness em Luanda. Actividades aquáticas, treinos personalizados e aulas em grupo.",
  },
  {
    route: "/reservar",
    title: "Reservar Vaga",
    description:
      "Reserve a sua vaga nos programas de fitness da DBW em Luanda. Resposta garantida em 24 horas.",
  },
  {
    route: "/contacto",
    title: "Contacto",
    description:
      "Contacte a DBW Fitness em Luanda. Telefone, email, localização e WhatsApp. Estamos prontos para ajudar.",
  },
  {
    route: "/instalar",
    title: "Instalar App",
    description:
      "Instale a app DBW Fitness no telemóvel para acesso rápido — sem App Store.",
  },
  {
    route: "/politica-de-privacidade",
    title: "Política de Privacidade",
    description:
      "Política de privacidade e cookies da DBW — Domingos, Baltazar & William. Saiba como protegemos os seus dados.",
  },
];

function fullTitle(title: string): string {
  return title.includes("DBW") ? title : `${title} | ${SITE_NAME}`;
}

function setTagContent(html: string, pattern: RegExp, replacement: string): string {
  if (!pattern.test(html)) {
    throw new Error(`[prerenderRoutes] expected tag not found in index.html: ${pattern}`);
  }
  return html.replace(pattern, replacement);
}

function renderRoute(template: string, seo: RouteSeo): string {
  const canonical = `${PRODUCTION_ORIGIN}${seo.route}`;
  const title = fullTitle(seo.title);

  let html = template;
  html = setTagContent(html, /<title>.*?<\/title>/, `<title>${title}</title>`);
  html = setTagContent(
    html,
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${seo.description}" />`
  );
  html = setTagContent(
    html,
    /<link rel="canonical" href=".*?" \/>/,
    `<link rel="canonical" href="${canonical}" />`
  );
  html = setTagContent(
    html,
    /<meta property="og:url" content=".*?" \/>/,
    `<meta property="og:url" content="${canonical}" />`
  );
  html = setTagContent(
    html,
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${title}" />`
  );
  html = setTagContent(
    html,
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="${seo.description}" />`
  );
  html = setTagContent(
    html,
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${title}" />`
  );
  html = setTagContent(
    html,
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="${seo.description}" />`
  );
  // DEFAULT_OG_IMAGE is identical across every route today (no page passes a
  // custom ogImage), so og:image / twitter:image are left untouched.
  void DEFAULT_OG_IMAGE;
  return html;
}

/**
 * Writes a static <route>.html shell per marketing route into dist/, each
 * carrying the correct <title>/description/canonical/OG/Twitter tags for
 * that route. Non-JS crawlers (WhatsApp, Facebook, X, LinkedIn link-preview
 * bots) never execute the client bundle, so without this they only ever see
 * index.html's homepage tags no matter which page was actually shared.
 *
 * The emitted file still loads the same hashed JS bundle as index.html, so a
 * real browser hydrates into the full SPA and client-side routing continues
 * to work exactly as before — this only changes what a non-JS crawler sees.
 */
export default function prerenderRoutes(): Plugin {
  return {
    name: "dbw-prerender-routes",
    apply: "build",
    closeBundle() {
      // process.cwd() rather than __dirname: Vite bundles this config/plugin
      // file in a way that doesn't reliably expose __dirname, and `vite
      // build` is always invoked from the project root (see package.json).
      const outDir = path.resolve(process.cwd(), "dist");
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const template = fs.readFileSync(indexPath, "utf-8");

      for (const seo of ROUTES) {
        const html = renderRoute(template, seo);
        const destPath = path.join(outDir, `${seo.route}.html`);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, html, "utf-8");
      }

      console.log(`[prerenderRoutes] wrote ${ROUTES.length} static route shells`);
    },
  };
}
