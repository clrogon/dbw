/**
 * URL and contact hardening helpers for CMS media and WhatsApp links.
 * Defense-in-depth: validate on admin write and re-sanitize on public render.
 */

/**
 * Build-time sentinel emitted when `VITE_WHATSAPP_NUMBER` is missing.
 *
 * The real business number was previously hardcoded here (244922569283), which
 * made it trivially harvestable from the JS bundle. We now require
 * `VITE_WHATSAPP_NUMBER` in production environments — set it in Vercel
 * (Production + Preview) and locally in `.env`. The sentinel intentionally
 * fails the E.164 length check so booking/CTA deep links degrade visibly
 * instead of silently posting spam to a wrong/harvested number.
 */
export const DEFAULT_WHATSAPP_NUMBER = "missing-whatsapp-number-env-not-set";

const warnedMissingWhatsAppNumber = { value: false };

function warnMissingWhatsAppNumberOnce(): void {
  if (warnedMissingWhatsAppNumber.value) return;
  warnedMissingWhatsAppNumber.value = true;
  if (typeof console !== "undefined" && console.warn) {
    console.warn(
      "[safeUrls] VITE_WHATSAPP_NUMBER is not set. The WhatsApp booking deep-link will not work until it is configured (digits only, with country code; e.g. 244922569283). Set it in .env or Vercel project settings."
    );
  }
}

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
 * When env is missing, an `missing-whatsapp-number-env-not-set` sentinel
 * is returned — which sanitises down to an empty digit string and produces
 * a `wa.me/` URL without a number, so the misconfiguration is visible to
 * the deployer rather than silently falling back to a hardcoded business
 * number shipped in the bundle.
 */
export function getWhatsAppNumber(): string {
  const fromEnv =
    typeof import.meta !== "undefined"
      ? (import.meta.env?.VITE_WHATSAPP_NUMBER as string | undefined)
      : undefined;
  // If env is missing OR falls back to the sentinel, warn so the missing
  // env surfaces in the deployer's console on the live site.
  if (!fromEnv) {
    warnMissingWhatsAppNumberOnce();
  }
  return sanitizeWhatsAppDigits(fromEnv, DEFAULT_WHATSAPP_NUMBER);
}

/**
 * Build a safe https://wa.me/ URL with optional prefilled text.
 * The combined prefilled `text` is capped at roughly the platform's
 * documented accepted length so the user does not see a broken
 * "message too long" WhatsApp page when their booking notes push the
 * total URL past the platform limit.
 */
const WHATSAPP_TEXT_CAP = 1000;

export function buildWhatsAppUrl(text?: string, phone?: string): string {
  const number = sanitizeWhatsAppDigits(phone ?? getWhatsAppNumber());
  const base = `https://wa.me/${number}`;
  if (text == null || text === "") return base;
  const truncated = text.length > WHATSAPP_TEXT_CAP ? text.slice(0, WHATSAPP_TEXT_CAP) : text;
  return `${base}?text=${encodeURIComponent(truncated)}`;
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
