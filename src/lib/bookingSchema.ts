import { z } from "zod";

/**
 * Public booking form schema (multi-step).
 * Extracted from Booking.tsx so it can be unit-tested without mounting the
 * page component. The form is intentionally permissive about optional fields
 * (per-step validation runs via `form.trigger`); the final submit re-validates
 * the whole object.
 *
 * `website` is a honeypot: it is invisible to humans but a collapsing target
 * for naive bots that autofill named fields. Submit-time code rejects any form
 * that arrives with a non-empty `website`.
 */
export const bookingSchema = z.object({
  servico: z.enum(["aquaticas", "personalizado", "laboral", "grupo"], {
    required_error: "Seleccione um serviço",
  }),
  nome: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  telefone: z.string().trim().min(9, "Número de telefone inválido").max(20),
  empresa: z.string().trim().max(100).optional(),
  tipoCliente: z.enum(["adulto", "crianca"]).optional(),
  experienciaNatacao: z.enum(["sim", "nao"]).optional(),
  numColaboradores: z.string().trim().max(10).optional(),
  mensagem: z.string().trim().max(500).optional(),
  website: z.string().trim().max(500).optional(),
});

export type BookingForm = z.infer<typeof bookingSchema>;

export const SERVICE_LABELS: Record<string, string> = {
  aquaticas: "Actividades Aquáticas",
  personalizado: "Treino Personalizado",
  laboral: "Ginástica Laboral",
  grupo: "Aulas em Grupo",
};

/**
 * Minimum interval between successful booking submissions from a single
 * session. Scripted abuse against the WhatsApp number was identified during
 * the pre-mortem: a headless tour of `/reservar` can fire many `wa.me` deep
 * links per minute against a publicly-harvestable phone number, which risks
 * a WhatsApp Business reputation ban. 30 seconds is enough to make
 * scripted flooding uneconomic while keeping the form usable for a real
 * human the second time.
 */
export const BOOKING_THROTTLE_MS = 30_000;

export const BOOKING_THROTTLE_STORAGE_KEY = "dbw-booking-last-submit-ts";
