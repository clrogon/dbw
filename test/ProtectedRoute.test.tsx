import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ReactNode } from "react";

const useAuthMock = vi.fn();
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

import ProtectedRoute from "../src/components/admin/ProtectedRoute";

const ProtectedChild = () => <div>PROTECTED</div>;

function withRouter(children: ReactNode) {
  return (
    <MemoryRouter initialEntries={["/admin/secret"]}>
      <Routes>
        <Route path="/admin/secret" element={children} />
        <Route path="/admin/login" element={<div>LOGIN</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => vi.clearAllMocks());

describe("ProtectedRoute — access control", () => {
  it("renders a spinner while loading=true and does not reveal children", () => {
    useAuthMock.mockReturnValue({ user: null, isAdmin: false, loading: true });
    const { container } = render(
      withRouter(
        <ProtectedRoute>
          <ProtectedChild />
        </ProtectedRoute>
      )
    );
    expect(screen.queryByText("PROTECTED")).toBeNull();
    // Loading spinner is rendered (animate-spin div present).
    expect(container.querySelector(".animate-spin")).not.toBeNull();
  });

  it("redirects to /admin/login when user is null (logged out)", () => {
    useAuthMock.mockReturnValue({ user: null, isAdmin: false, loading: false });
    render(
      withRouter(
        <ProtectedRoute>
          <ProtectedChild />
        </ProtectedRoute>
      )
    );
    expect(screen.queryByText("PROTECTED")).toBeNull();
    expect(screen.getByText("LOGIN")).toBeTruthy();
  });

  it("redirects to /admin/login when user exists but is not an admin (privilege escalation guard)", () => {
    useAuthMock.mockReturnValue({
      user: { id: "u1" },
      isAdmin: false,
      loading: false,
    });
    render(
      withRouter(
        <ProtectedRoute>
          <ProtectedChild />
        </ProtectedRoute>
      )
    );
    expect(screen.queryByText("PROTECTED")).toBeNull();
    expect(screen.getByText("LOGIN")).toBeTruthy();
  });

  it("grants access only when user is present AND isAdmin=true", () => {
    useAuthMock.mockReturnValue({
      user: { id: "u1" },
      isAdmin: true,
      loading: false,
    });
    render(
      withRouter(
        <ProtectedRoute>
          <ProtectedChild />
        </ProtectedRoute>
      )
    );
    expect(screen.getByText("PROTECTED")).toBeTruthy();
    expect(screen.queryByText("LOGIN")).toBeNull();
  });
});
