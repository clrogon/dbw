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

  it("builds encodeURIComponent message URLs", () => {
    const url = buildWhatsAppUrl("Hello *world*", "244922569283");
    expect(url).toBe(
      `https://wa.me/244922569283?text=${encodeURIComponent("Hello *world*")}`
    );
  });

  it("validates wa.me reopen URLs", () => {
    expect(isSafeWhatsAppUrl("https://wa.me/244922569283?text=hi")).toBe(true);
    expect(isSafeWhatsAppUrl("https://evil.com/wa.me/244")).toBe(false);
    expect(isSafeWhatsAppUrl("https://wa.me/javascript:alert(1)")).toBe(false);
    expect(isSafeWhatsAppUrl("http://wa.me/244922569283")).toBe(false);
  });
});
