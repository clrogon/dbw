import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Regression tests for the react-router-dom v6 -> v7 upgrade. These exercise
// the two patterns the app relies on most heavily: the admin ProtectedRoute
// guard (Navigate + auth context) and the Booking -> ThankYou flow that
// passes a WhatsApp URL via router state (not the query string).

vi.mock("@/hooks/useAuth", () => {
  const state: { user: unknown; isAdmin: boolean; loading: boolean } = {
    user: null,
    isAdmin: false,
    loading: false,
  };
  return {
    __authState: state,
    useAuth: () => state,
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Booking posts to WhatsApp via window.open; stub it so jsdom doesn't warn.
vi.stubGlobal("open", vi.fn());

import ProtectedRoute from "@/components/admin/ProtectedRoute";
import * as authModule from "@/hooks/useAuth";
import Booking from "@/pages/Booking";
import ThankYou from "@/pages/ThankYou";

describe("react-router-dom v7: ProtectedRoute guard", () => {
  it("redirects unauthenticated users to /admin/login via <Navigate>", () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin/login" element={<div>Login Page</div>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div>Admin Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
  });

  it("renders protected children once the user is an authenticated admin", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authModule as any).__authState.user = { id: "u1" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authModule as any).__authState.isAdmin = true;

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin/login" element={<div>Login Page</div>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div>Admin Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authModule as any).__authState.user = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authModule as any).__authState.isAdmin = false;
  });
});

describe("react-router-dom v7: Booking -> ThankYou state handoff", () => {
  it("navigates from /reservar to /obrigado carrying whatsappUrl in location.state", async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/reservar"]}>
          <Routes>
            <Route path="/reservar" element={<Booking />} />
            <Route path="/obrigado" element={<ThankYou />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    // Step 1: choose a service
    fireEvent.click(screen.getByRole("button", { name: /Actividades Aquáticas/i }));
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));

    // Step 2: fill required contact fields (goNext awaits async form.trigger(),
    // so the step-2 fields appear only after that microtask resolves)
    await waitFor(() => expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument());
    fireEvent.input(screen.getByLabelText(/Nome completo/i), { target: { value: "Maria Silva" } });
    fireEvent.input(screen.getByLabelText(/^Email/i), { target: { value: "maria@example.com" } });
    fireEvent.input(screen.getByLabelText(/Telefone \/ WhatsApp/i), { target: { value: "922569283" } });
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));

    // Step 3: submit
    await waitFor(() => expect(screen.getByRole("button", { name: /confirmar inscrição/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /confirmar inscrição/i }));

    await waitFor(() => {
      expect(screen.getByText(/Pedido recebido com sucesso/i)).toBeInTheDocument();
    });

    // location.state.whatsappUrl survived the v7 navigate() and is rendered
    // as the "reenviar" link, proving state-based navigation still works.
    expect(screen.getByText(/Reenviar no WhatsApp/i)).toBeInTheDocument();
    expect(screen.getByText(/Maria Silva/i)).toBeInTheDocument();
    expect(window.open).toHaveBeenCalled();
  });
});
