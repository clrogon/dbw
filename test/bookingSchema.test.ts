import { describe, it, expect } from "vitest";
import { bookingSchema } from "../src/lib/bookingSchema";

const validBase = {
  servico: "aquaticas" as const,
  nome: "Ana Costa",
  email: "ana@example.com",
  telefone: "+244 922 569 283",
};

describe("bookingSchema", () => {
  it("accepts a minimal valid booking", () => {
    const result = bookingSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("rejects an unknown service code (defends against tampered step-1 select)", () => {
    const result = bookingSchema.safeParse({ ...validBase, servico: "phishing" });
    expect(result.success).toBe(false);
  });

  it("requires nome >= 3 chars after trimming whitespace", () => {
    // "  Ana  " trims to "Ana" (3 chars) and is accepted.
    expect(bookingSchema.safeParse({ ...validBase, nome: "  Ana  " }).success).toBe(true);
    // "  An  " trims to "An" (2 chars) and is rejected.
    expect(bookingSchema.safeParse({ ...validBase, nome: "  An  " }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validBase, nome: "A" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validBase, nome: "   " }).success).toBe(false);
  });

  it("requires a syntactically valid email", () => {
    expect(bookingSchema.safeParse({ ...validBase, email: "not-an-email" }).success).toBe(false);
  });

  it("requires telefone >= 9 chars (rejects short spoofed numbers)", () => {
    expect(bookingSchema.safeParse({ ...validBase, telefone: "123" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validBase, telefone: "922569283" }).success).toBe(true);
  });

  it("caps mensagem at 500 chars (whatsapp URL budget)", () => {
    expect(
      bookingSchema.safeParse({ ...validBase, mensagem: "a".repeat(500) }).success
    ).toBe(true);
    expect(
      bookingSchema.safeParse({ ...validBase, mensagem: "a".repeat(501) }).success
    ).toBe(false);
  });

  it("caps empresa at 100 chars", () => {
    expect(
      bookingSchema.safeParse({ ...validBase, empresa: "a".repeat(100) }).success
    ).toBe(true);
    expect(
      bookingSchema.safeParse({ ...validBase, empresa: "a".repeat(101) }).success
    ).toBe(false);
  });

  it("accepts optional labour fields when servico = laboral", () => {
    const result = bookingSchema.safeParse({
      ...validBase,
      servico: "laboral",
      empresa: "Sonangol",
      numColaboradores: "120",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown tipoCliente / experienciaNatacao enum value", () => {
    expect(
      bookingSchema.safeParse({ ...validBase, tipoCliente: "minor" as unknown }).success
    ).toBe(false);
    expect(
      bookingSchema.safeParse({ ...validBase, experienciaNatacao: "maybe" as unknown }).success
    ).toBe(false);
  });

  it("accepts an empty honeypot field (real human submission)", () => {
    expect(
      bookingSchema.safeParse({ ...validBase, website: "" }).success
    ).toBe(true);
    expect(bookingSchema.safeParse({ ...validBase }).success).toBe(true);
  });

  it("also accepts a filled honeypot at schema level — discard logic lives in onSubmit, not the schema", () => {
    // The schema must not reject a filled honeypot upfront; that would teach
    // bots to leave it empty. The submit handler silently drops those rows.
    expect(
      bookingSchema.safeParse({ ...validBase, website: "spam.example" }).success
    ).toBe(true);
  });
});

describe("booking throttle constants", () => {
  it("BOOKING_THROTTLE_MS is 30 seconds (pre-mortem risk C5 mitigation)", async () => {
    const mod = await import("../src/lib/bookingSchema");
    expect(mod.BOOKING_THROTTLE_MS).toBe(30_000);
    expect(mod.BOOKING_THROTTLE_STORAGE_KEY).toContain("booking");
  });
});
