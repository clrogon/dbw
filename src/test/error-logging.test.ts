import { describe, expect, it, vi, afterEach } from "vitest";
import { getSafeErrorMeta, logClientError } from "@/lib/error-logging";

describe("error logging", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("extracts only safe metadata fields", () => {
    const meta = getSafeErrorMeta({
      code: "42501",
      status: 401,
      name: "AuthApiError",
      message: "contains sensitive detail",
      user_id: "123",
    });

    expect(meta).toEqual({ code: "42501", status: 401, name: "AuthApiError" });
  });

  it("logs context and safe metadata", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    logClientError("Load services error", { code: "42501", status: 403, message: "sensitive" });

    expect(spy).toHaveBeenCalledWith("Load services error", { code: "42501", status: 403, name: undefined });
  });
});
