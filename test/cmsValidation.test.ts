import { describe, it, expect } from "vitest";
import {
  sanitizeInternalPath,
  safeInternalPathSchema,
  serviceSchema,
  heroContentSchema,
} from "../src/lib/cmsValidation";

describe("safeInternalPathSchema", () => {
  it("accepts relative app paths", () => {
    expect(safeInternalPathSchema.safeParse("/reservar").success).toBe(true);
    expect(safeInternalPathSchema.safeParse("/servicos/natação").success).toBe(true);
  });

  it("rejects protocol-relative and absolute URLs", () => {
    expect(safeInternalPathSchema.safeParse("//evil.com").success).toBe(false);
    expect(safeInternalPathSchema.safeParse("https://evil.com").success).toBe(false);
    expect(safeInternalPathSchema.safeParse("javascript:alert(1)").success).toBe(false);
  });
});

describe("sanitizeInternalPath", () => {
  it("falls back when unsafe", () => {
    expect(sanitizeInternalPath("//evil.com", "/reservar")).toBe("/reservar");
    expect(sanitizeInternalPath("/ok")).toBe("/ok");
  });
});

describe("serviceSchema", () => {
  it("requires valid slug", () => {
    const base = {
      slug: "treino-personalizado",
      icon: "🎯",
      title: "Treino",
      short_desc: "",
      full_desc: "",
      sub_services: [],
      cta_text: "",
      image_url: null,
      seo_title: "",
      seo_description: "",
      sort_order: 0,
    };
    expect(serviceSchema.safeParse(base).success).toBe(true);
    expect(serviceSchema.safeParse({ ...base, slug: "Bad Slug" }).success).toBe(false);
  });
});

describe("heroContentSchema", () => {
  it("requires internal CTA links", () => {
    const base = {
      title: "Title",
      title_highlight: "",
      subtitle: "",
      cta_primary_text: "Go",
      cta_primary_link: "/reservar",
      cta_secondary_text: "More",
      cta_secondary_link: "/servicos",
      background_image_url: null,
      stats: [],
    };
    expect(heroContentSchema.safeParse(base).success).toBe(true);
    expect(
      heroContentSchema.safeParse({ ...base, cta_primary_link: "//phish.example" }).success
    ).toBe(false);
  });
});
