import { PRODUCTION_ORIGIN, absoluteUrl } from "@/config/site";

/** Matches the "@id" on the LocalBusiness block in index.html — links these
 * per-page schemas into that same graph node instead of duplicating it. */
const LOCAL_BUSINESS_ID = PRODUCTION_ORIGIN;

export interface BreadcrumbItem {
  name: string;
  /** Relative path, e.g. "/servicos". */
  path: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export interface ServiceSchemaInput {
  name: string;
  description: string;
  /** Relative path, e.g. "/servicos/actividades-aquaticas". */
  path: string;
}

export function buildServiceSchema({ name, description, path }: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    provider: { "@id": LOCAL_BUSINESS_ID },
    areaServed: { "@type": "City", name: "Luanda" },
  };
}

export interface PersonSchemaInput {
  name: string;
  role: string;
  bio: string;
}

export function buildPersonSchema({ name, role, bio }: PersonSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: role,
    description: bio,
    worksFor: { "@id": LOCAL_BUSINESS_ID },
  };
}
