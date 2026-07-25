import { describe, it, expect } from "vitest";
import {
  isSafeCmsImageUrl,
  sanitizeCmsImageUrl,
  sanitizeWhatsAppDigits,
  buildWhatsAppUrl,
  isSafeWhatsAppUrl,
  DEFAULT_WHATSAPP_NUMBER,
} from "../src/lib/safeUrls";

describe("sanitizeCmsImageUrl / isSafeCmsImageUrl", () => {
  it("accepts HTTPS Supabase Storage URLs", () => {
    const url =
      "https://ikwotysmjlqqurucxepf.supabase.co/storage/v1/object/public/cms-images/gallery/1.jpg";
    expect(isSafeCmsImageUrl(url)).toBe(true);
    expect(sanitizeCmsImageUrl(url)).toBe(url);
  });

  it("accepts images.unsplash.com", () => {
    const url = "https://images.unsplash.com/photo-123";
    expect(sanitizeCmsImageUrl(url)).toBe(url);
  });

  it("rejects http, evil hosts, and javascript", () => {
    expect(sanitizeCmsImageUrl("http://evil.com/a.jpg")).toBeNull();
    expect(sanitizeCmsImageUrl("https://evil.com/a.jpg")).toBeNull();
    expect(sanitizeCmsImageUrl("javascript:alert(1)")).toBeNull();
    expect(sanitizeCmsImageUrl("//evil.com/x")).toBeNull();
    expect(sanitizeCmsImageUrl("")).toBeNull();
    expect(sanitizeCmsImageUrl(null)).toBeNull();
  });

  it("rejects URLs with embedded credentials", () => {
    expect(
      sanitizeCmsImageUrl("https://user:pass@ikwotysmjlqqurucxepf.supabase.co/x.jpg")
    ).toBeNull();
  });
});

describe("WhatsApp helpers", () => {
  it("strips non-digits and validates length", () => {
    expect(sanitizeWhatsAppDigits("+244 922 569 283")).toBe("244922569283");
    expect(sanitizeWhatsAppDigits("javascript:alert(1)")).toBe(DEFAULT_WHATSAPP_NUMBER);
    expect(sanitizeWhatsAppDigits("123")).toBe(DEFAULT_WHATSAPP_NUMBER);
  });

  it("does NOT ship a real business number when env is missing (anti-harvesting)", () => {
    // The DEFAULT must be a non-numeric sentinel so the real business number
    // is not recoverable from the bundle. Anything left after stripping
    // non-digits must be empty so the resulting wa.me URL is visibly broken
    // to the deployer rather than silently posting to a stale/harvested number.
    expect(DEFAULT_WHATSAPP_NUMBER).toMatch(/missing.*whatsapp.*number/i);
    expect(DEFAULT_WHATSAPP_NUMBER.replace(/\D/g, "")).toBe("");
    // sanitizeWhatsAppDigits without a usable number returns the sentinel as-is
    expect(sanitizeWhatsAppDigits(null)).toBe(DEFAULT_WHATSAPP_NUMBER);
  });

  it("builds encodeURIComponent message URLs", () => {
    const url = buildWhatsAppUrl("Hello *world*", "244922569283");
    expect(url).toBe(
      `https://wa.me/244922569283?text=${encodeURIComponent("Hello *world*")}`
    );
  });

  it("caps prefilled WhatsApp text to ~1000 chars to stay under the platform's accepted length", () => {
    const long = "x".repeat(1500);
    const url = buildWhatsAppUrl(long, "244922569283");
    expect(url.length).toBeLessThan(`https://wa.me/244922569283?text=${encodeURIComponent(long)}`.length);
    // The text param must be the truncated string.
    const encoded = encodeURIComponent(long.slice(0, 1000));
    expect(url).toBe(`https://wa.me/244922569283?text=${encoded}`);
  });

  it("omits the text query entirely for empty/undefined messages", () => {
    expect(buildWhatsAppUrl(undefined, "244922569283")).toBe("https://wa.me/244922569283");
    expect(buildWhatsAppUrl("", "244922569283")).toBe("https://wa.me/244922569283");
  });

  it("validates wa.me reopen URLs", () => {
    expect(isSafeWhatsAppUrl("https://wa.me/244922569283?text=hi")).toBe(true);
    expect(isSafeWhatsAppUrl("https://evil.com/wa.me/244")).toBe(false);
    expect(isSafeWhatsAppUrl("https://wa.me/javascript:alert(1)")).toBe(false);
    expect(isSafeWhatsAppUrl("http://wa.me/244922569283")).toBe(false);
  });
});
