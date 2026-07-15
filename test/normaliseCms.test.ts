import { describe, it, expect } from "vitest";
import {
  normaliseServiceRow,
  type NormalisedService,
  normaliseGalleryImage,
  normaliseInstructorRow,
  type NormalisedInstructor,
} from "../src/utils/normaliseCms";

describe("normaliseCms service normalization", () => {
  it("converts CMS service with short_desc to NormalisedService", () => {
    const input = { slug: "svc", title: "Service", icon: "🎯", short_desc: "desc" };
    const out = normaliseServiceRow(input);
    const expected: NormalisedService = { slug: "svc", title: "Service", icon: "🎯", shortDesc: "desc" };
    expect(out).toEqual(expected);
  });

  it("handles CMS service with shortDesc field", () => {
    const input = { slug: "svc2", title: "Service 2", icon: "🎯", shortDesc: "desc2" };
    const out = normaliseServiceRow(input);
    const expected: NormalisedService = { slug: "svc2", title: "Service 2", icon: "🎯", shortDesc: "desc2" };
    expect(out).toEqual(expected);
  });
});

describe("normaliseCms gallery image", () => {
  it("converts CMS gallery image and keeps allowlisted HTTPS src", () => {
    const url =
      "https://ikwotysmjlqqurucxepf.supabase.co/storage/v1/object/public/cms-images/a.jpg";
    const input = { id: "g1", image_url: url, alt: "A", category: "Cat" };
    const out = normaliseGalleryImage(input);
    expect(out).toEqual({ id: "g1", src: url, alt: "A", category: "Cat" });
  });

  it("strips untrusted gallery image hosts", () => {
    const input = { id: "g1", image_url: "http://example.com/a.jpg", alt: "A", category: "Cat" };
    expect(normaliseGalleryImage(input).src).toBe("");
  });
});

describe("normaliseCms instructor", () => {
  it("normalises instructor row and sanitizes image_url", () => {
    const url =
      "https://ikwotysmjlqqurucxepf.supabase.co/storage/v1/object/public/cms-images/pic.jpg";
    const input = {
      id: "i1",
      name: "John",
      role: "Coach",
      specialties: ["A"],
      bio: "bio",
      image_url: url,
      sort_order: 1,
      created_at: "2020-01-01",
      updated_at: "2020-01-02",
    };
    const out = normaliseInstructorRow(input) as NormalisedInstructor;
    expect(out).toMatchObject({
      id: "i1",
      name: "John",
      role: "Coach",
      specialties: ["A"],
      bio: "bio",
      image_url: url,
      sort_order: 1,
      created_at: "2020-01-01",
      updated_at: "2020-01-02",
    });
  });

  it("nulls untrusted instructor image hosts", () => {
    const out = normaliseInstructorRow({
      name: "X",
      image_url: "https://evil.example/x.jpg",
    });
    expect(out.image_url).toBeNull();
  });
});

