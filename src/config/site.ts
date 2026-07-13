/**
 * Production site identity.
 *
 * Real production = https://www.dbwfitness.ao (cPanel / Apache).
 * Vercel / localhost / preview hosts are non-production (noindex).
 */

export const PRODUCTION_ORIGIN = "https://www.dbwfitness.ao";

/** Hostnames that serve the live public site (SEO indexable). */
export const PRODUCTION_HOSTS = new Set([
  "www.dbwfitness.ao",
  "dbwfitness.ao",
]);

export function getHostname(): string {
  if (typeof window === "undefined") return "";
  return window.location.hostname.toLowerCase();
}

/** True only on the real Angola production domain. */
export function isProductionHost(hostname: string = getHostname()): boolean {
  return PRODUCTION_HOSTS.has(hostname.toLowerCase());
}

/** Absolute marketing URL always on the production origin (for canonical / OG). */
export function absoluteUrl(path: string = "/"): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  if (normalised === "/") return PRODUCTION_ORIGIN;
  return `${PRODUCTION_ORIGIN}${normalised}`;
}

export const DEFAULT_OG_IMAGE = `${PRODUCTION_ORIGIN}/og-image.jpg`;

export const SITE_NAME = "DBW Fitness";
export const DEFAULT_TITLE =
  "DBW — Mente Activa, Vida Saudável | Fitness em Luanda, Angola";
export const DEFAULT_DESCRIPTION =
  "DBW oferece natação, treinos personalizados, ginástica laboral e aulas em grupo em Luanda, Angola. Profissionais certificados dedicados à sua saúde e bem-estar.";
