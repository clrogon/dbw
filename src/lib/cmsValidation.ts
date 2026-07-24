import { z } from "zod";
import { isSafeCmsImageUrl } from "@/lib/safeUrls";

/**
 * Safe internal path for React Router <Link to=...>.
 * Rejects protocol-relative (//evil.com), absolute URLs, and javascript: etc.
 */
export const safeInternalPathSchema = z
  .string()
  .trim()
  .min(1, "Link é obrigatório")
  .max(500)
  .refine(
    (v) => v.startsWith("/") && !v.startsWith("//"),
    "Use apenas caminhos internos (ex: /reservar). URLs externas e // não são permitidos."
  )
  .refine(
    (v) => !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v),
    "Esquemas de URL (http:, javascript:, etc.) não são permitidos."
  )
  .refine(
    (v) => !v.includes("\\"),
    "Caracteres inválidos (\\) não são permitidos no caminho."
  );

export function sanitizeInternalPath(raw: string | null | undefined, fallback = "/"): string {
  const result = safeInternalPathSchema.safeParse(raw ?? "");
  return result.success ? result.data : fallback;
}

const CMS_IMAGE_MSG =
  "URL de imagem inválida: use HTTPS de hosts permitidos (Supabase Storage ou images.unsplash.com).";

/** Required CMS image URL (gallery). */
export const safeCmsImageUrlSchema = z
  .string()
  .trim()
  .min(1, "Imagem é obrigatória")
  .max(2000)
  .refine((v) => isSafeCmsImageUrl(v), CMS_IMAGE_MSG);

/**
 * Optional CMS image URL: empty string / null → null; otherwise must be allowlisted HTTPS.
 */
export const optionalCmsImageUrlSchema = z
  .union([safeCmsImageUrlSchema, z.literal(""), z.null()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? null : v));

export const heroContentSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório").max(200),
  title_highlight: z.string().trim().max(200),
  subtitle: z.string().trim().max(1000),
  cta_primary_text: z.string().trim().max(100),
  cta_primary_link: safeInternalPathSchema,
  cta_secondary_text: z.string().trim().max(100),
  cta_secondary_link: safeInternalPathSchema,
  background_image_url: optionalCmsImageUrlSchema,
  stats: z
    .array(
      z.object({
        value: z.string().trim().max(50),
        label: z.string().trim().max(100),
      })
    )
    .max(12),
});

export const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug é obrigatório")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: apenas minúsculas, números e hífens"),
  icon: z.string().trim().max(20),
  title: z.string().trim().min(1, "Título é obrigatório").max(200),
  short_desc: z.string().trim().max(500),
  full_desc: z.string().trim().max(5000),
  sub_services: z.array(z.string().trim().max(200)).max(50),
  cta_text: z.string().trim().max(100),
  image_url: optionalCmsImageUrlSchema,
  seo_title: z.string().trim().max(200),
  seo_description: z.string().trim().max(500),
  sort_order: z.number().int().min(0).max(9999),
});

export const pricingPlanSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100),
  price: z.string().trim().min(1, "Preço é obrigatório").max(50),
  unit: z.string().trim().max(50),
  features: z.array(z.string().trim().max(200)).max(50),
  highlighted: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export const instructorSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100),
  role: z.string().trim().max(100),
  specialties: z.array(z.string().trim().max(100)).max(30),
  bio: z.string().trim().max(2000),
  image_url: optionalCmsImageUrlSchema,
  sort_order: z.number().int().min(0).max(9999),
});

export const galleryImageSchema = z.object({
  image_url: safeCmsImageUrlSchema,
  alt: z.string().trim().max(300),
  category: z.string().trim().min(1).max(100),
  sort_order: z.number().int().min(0).max(9999),
});

export function firstZodError(error: z.ZodError): string {
  return error.errors[0]?.message ?? "Dados inválidos";
}
