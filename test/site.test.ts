import { describe, it, expect } from "vitest";
import {
  absoluteUrl,
  isProductionHost,
  PRODUCTION_ORIGIN,
} from "../src/config/site";

describe("site config", () => {
  it("builds absolute production URLs", () => {
    expect(absoluteUrl("/")).toBe(PRODUCTION_ORIGIN);
    expect(absoluteUrl("/servicos")).toBe(`${PRODUCTION_ORIGIN}/servicos`);
    expect(absoluteUrl("contacto")).toBe(`${PRODUCTION_ORIGIN}/contacto`);
  });

  it("recognises production hosts only", () => {
    expect(isProductionHost("www.dbwfitness.ao")).toBe(true);
    expect(isProductionHost("dbwfitness.ao")).toBe(true);
    expect(isProductionHost("dbw-fitness.vercel.app")).toBe(false);
    expect(isProductionHost("localhost")).toBe(false);
  });
});
