import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  isProductionHost,
  SITE_NAME,
} from "@/config/site";

type SiteSeoProps = {
  title?: string;
  description?: string;
  /** Force noindex even on production (e.g. thank-you, admin). */
  noIndex?: boolean;
  /** Override path used for canonical (defaults to current location). */
  path?: string;
  ogImage?: string;
};

/**
 * Global + per-page SEO. Canonical and Open Graph always point at
 * www.dbwfitness.ao. Non-production hosts (Vercel, localhost) get noindex.
 */
const SiteSeo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  noIndex = false,
  path,
  ogImage = DEFAULT_OG_IMAGE,
}: SiteSeoProps) => {
  const { pathname } = useLocation();
  const pagePath = path ?? pathname;
  const canonical = absoluteUrl(pagePath);
  const fullTitle = title
    ? title.includes("DBW")
      ? title
      : `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;

  // Admin and utility routes always noindex
  const isPrivatePath =
    pagePath.startsWith("/admin") ||
    pagePath === "/obrigado" ||
    pagePath === "/offline" ||
    pagePath.startsWith("/erro") ||
    pagePath === "/acesso-negado";

  const allowIndex = isProductionHost() && !noIndex && !isPrivatePath;
  const robots = allowIndex ? "index, follow" : "noindex, nofollow";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_AO" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SiteSeo;
