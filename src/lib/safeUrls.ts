/**
 * URL and contact hardening helpers for CMS media and WhatsApp links.
 * Defense-in-depth: validate on admin write and re-sanitize on public render.
 */

/** Default Angola business number (digits only, country code included). */
export const DEFAULT_WHATSAPP_NUMBER = "244922569283";

/**
 * Hostnames allowed for CMS/public image URLs (HTTPS only).
 * Aligns with CSP img-src allowlist.
 */
const ALLOWED_IMAGE_HOSTS = new Set(["images.unsplash.com"]);

function isAllowedImageHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (ALLOWED_IMAGE_HOSTS.has(h)) return true;
  // Supabase Storage / project assets (any project ref subdomain)
  if (h.endsWith(".supabase.co")) return true;
  // Local Vite assets during development (imported modules use same-origin paths)
  if (h === "localhost" || h === "127.0.0.1") return true;
  return false;
}

/**
 * Returns true when `raw` is an https URL on an allowlisted host.
 */
export function isSafeCmsImageUrl(raw: string): boolean {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== "https:") return false;
    // Block credentials in URL
    if (u.username || u.password) return false;
    return isAllowedImageHost(u.hostname);
  } catch {
    return false;
  }
}

/**
 * Sanitize a CMS image URL for use in <img src>.
 * Returns null when unsafe or empty so callers can fall back.
 */
export function sanitizeCmsImageUrl(
  raw: string | null | undefined
): string | null {
  if (raw == null) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  return isSafeCmsImageUrl(trimmed) ? trimmed : null;
}

/**
 * Digits-only WhatsApp / phone path for wa.me (E.164 without +).
 * Rejects malformed env values and falls back to the project default.
 */
export function sanitizeWhatsAppDigits(
  raw: string | null | undefined,
  fallback: string = DEFAULT_WHATSAPP_NUMBER
): string {
  const digits = String(raw ?? "").replace(/\D/g, "");
  // ITU E.164 max 15 digits; require country code + national number (min ~8)
  if (digits.length >= 8 && digits.length <= 15) {
    return digits;
  }
  return fallback.replace(/\D/g, "") || DEFAULT_WHATSAPP_NUMBER;
}

/**
 * Resolved WhatsApp business number from env (or default).
 */
export function getWhatsAppNumber(): string {
  const fromEnv =
    typeof import.meta !== "undefined"
      ? (import.meta.env?.VITE_WHATSAPP_NUMBER as string | undefined)
      : undefined;
  return sanitizeWhatsAppDigits(fromEnv, DEFAULT_WHATSAPP_NUMBER);
}

/**
 * Build a safe https://wa.me/ URL with optional prefilled text.
 */
export function buildWhatsAppUrl(text?: string, phone?: string): string {
  const number = sanitizeWhatsAppDigits(phone ?? getWhatsAppNumber());
  const base = `https://wa.me/${number}`;
  if (text == null || text === "") return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

/**
 * True when a WhatsApp reopen URL from router state is safe to use as href.
 */
export function isSafeWhatsAppUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return false;
    if (u.hostname !== "wa.me" && u.hostname !== "api.whatsapp.com") return false;
    // Path must be /digits only for wa.me
    if (u.hostname === "wa.me") {
      const pathDigits = u.pathname.replace(/^\//, "").replace(/\D/g, "");
      if (pathDigits.length < 8 || pathDigits.length > 15) return false;
      if (u.pathname.replace(/^\//, "") !== pathDigits) return false;
    }
    return true;
  } catch {
    return false;
  }
}
