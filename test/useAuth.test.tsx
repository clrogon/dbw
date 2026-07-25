import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { ReactNode } from "react";

// Mock the Supabase client BEFORE importing useAuth so we never hit network
// or the throw-on-missing-env guard in the real client module.
const mockFrom = vi.fn();
const mockSignOut = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockOnAuthChange = vi.fn();

// The SDK writes session JWTs under `sb-<projectRef>-auth-token` by default.
// Inlined here (not hoisted) so vi.mock can reference it safely — vitest hoists
// vi.mock above top-level const declarations.
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
    // Expose storageKey at both levels the signOut fallback searches.
    storageKey: "sb-test-project-ref-auth-token",
    auth: {
      storageKey: "sb-test-project-ref-auth-token",
      signOut: (...args: unknown[]) => mockSignOut(...args),
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthChange(...args),
    },
  },
}));

// Import AFTER mocks are registered.
import { AuthProvider, useAuth } from "../src/hooks/useAuth";

const STORAGE_KEY = "sb-test-project-ref-auth-token";

// Helper: build a fluent chain for supabase.from("user_roles").select().eq().eq().maybeSingle()
function chainReturning({ data, error }: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {
    data,
    error,
  };
  builder.select = () => builder;
  builder.eq = () => builder;
  builder.maybeSingle = async () => ({ data, error });
  return builder;
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const emitAuthState = (event: string, session: unknown) => {
  // The real onAuthStateChange returns { subscription: { unsubscribe } }.
  // Our capture mock stores the callback in mockOnAuthChange.calls.
  const cb = mockOnAuthChange.mock.calls.at(-1)?.[0] as
    | ((ev: string, s: unknown) => Promise<void> | void)
    | undefined;
  return cb?.(event, session);
};

beforeEach(() => {
  vi.clearAllMocks();
  // Default: no users signed in. The hook must mark loading=false on first fire.
  mockOnAuthChange.mockImplementation(() => ({
    data: { subscription: { unsubscribe: vi.fn() } },
  }));
  mockSignOut.mockResolvedValue(undefined);
  mockSignInWithPassword.mockResolvedValue({
    data: { user: { id: "u1" }, session: { user: { id: "u1" } } },
    error: null,
  });
});

describe("useAuth — checkAdmin resilience", () => {
  it("returns isAdmin=false when user_roles lookup returns no row", async () => {
    mockFrom.mockReturnValue(chainReturning({ data: null, error: null }));
    const { result } = renderHook(() => useAuth(), { wrapper });
    emitAuthState("SIGNED_IN", { user: { id: "u1" } });
    await waitFor(() => expect(result.current.isAdmin).toBe(false));
    expect(result.current.user).not.toBeNull();
  });

  it("returns isAdmin=true when user_roles lookup returns the admin row", async () => {
    mockFrom.mockReturnValue(
      chainReturning({ data: { role: "admin" }, error: null })
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    emitAuthState("SIGNED_IN", { user: { id: "u1" } });
    await waitFor(() => expect(result.current.isAdmin).toBe(true));
  });

  it("falls back to isAdmin=false but keeps the user on transient Supabase error", async () => {
    // Regression guard: a 5xx / 429 from user_roles must NOT silently log
    // the admin out of the SPA; component-level UX should still degrade.
    mockFrom.mockReturnValue(
      chainReturning({ data: null, error: { code: "429", message: "Too many" } })
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    emitAuthState("SIGNED_IN", { user: { id: "u1" } });
    await waitFor(() => expect(result.current.isAdmin).toBe(false));
    // User session is preserved; only the role check fails.
    expect(result.current.user).not.toBeNull();
  });

  it("signIn surfaces a login error without throwing", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid credentials" },
    });
    const { result } = renderHook(() => useAuth(), { wrapper });
    let signInResult: { error: unknown; isAdmin: boolean } | undefined;
    await act(async () => {
      signInResult = await result.current.signIn("x@example.com", "wrong");
    });
    expect(signInResult?.error).toBeTruthy();
    expect(signInResult?.isAdmin).toBe(false);
  });

  it("signOut clears local user/session even if the SDK call fails", async () => {
    mockSignOut.mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useAuth(), { wrapper });
    // Seed with a session so we can confirm it is torn down.
    mockFrom.mockReturnValue(
      chainReturning({ data: { role: "admin" }, error: null })
    );
    emitAuthState("SIGNED_IN", { user: { id: "u1" } });
    await waitFor(() => expect(result.current.user).not.toBeNull());

    // Seed sessionStorage with the actual Supabase auth token key so we can
    // confirm signOut's failure-path scrubs the real key, not a placeholder.
    window.sessionStorage.setItem(STORAGE_KEY, "fake-jwt");

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAdmin).toBe(false);
    // signOut failure must scrub the persisted token instead of leaving it behind.
    expect(window.sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
