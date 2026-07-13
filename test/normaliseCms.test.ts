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
  it("converts CMS gallery image to NormalisedGalleryImage shape", () => {
    const input = { id: "g1", image_url: "http://example.com/a.jpg", alt: "A", category: "Cat" };
    const out = normaliseGalleryImage(input);
    expect(out).toEqual({ id: "g1", src: "http://example.com/a.jpg", alt: "A", category: "Cat" });
  });
});

describe("normaliseCms instructor", () => {
  it("normalises instructor row to stable shape", () => {
    const input = {
      id: "i1",
      name: "John",
      role: "Coach",
      specialties: ["A"],
      bio: "bio",
      image_url: "http://img.url/pic.jpg",
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
      image_url: "http://img.url/pic.jpg",
      sort_order: 1,
      created_at: "2020-01-01",
      updated_at: "2020-01-02",
    });
  });
});
