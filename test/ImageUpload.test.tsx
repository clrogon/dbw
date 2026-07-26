import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mocks must be defined with vi.hoisted-style: vi.mock factories are hoisted,
// so we reference mocks declared here directly (no closure of late consts).
const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();
const mockStorageFrom = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    storage: {
      from: (...args: unknown[]) => mockStorageFrom(...args),
    },
  },
}));

const toastSpy = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastSpy }),
}));

// Import AFTER mocks are registered.
import ImageUpload from "../src/components/admin/ImageUpload";

function makeFile(name: string, type: string, sizeBytes: number): File {
  // jsdom File constructor accepts BlobPart[]; fake content doesn't need to
  // match size because the validation reads `file.size` directly.
  const blob = new Blob(["x"], { type });
  const file = new File([blob], name, { type });
  // Override size for tests that need a large-but-lightweight file.
  Object.defineProperty(file, "size", {
    value: sizeBytes,
    configurable: true,
  });
  return file;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockStorageFrom.mockReturnValue({
    upload: (...args: unknown[]) => mockUpload(...args),
    getPublicUrl: (...args: unknown[]) => mockGetPublicUrl(...args),
  });
  mockGetPublicUrl.mockReturnValue({
    data: { publicUrl: "https://example.supabase.co/storage/v1/object/public/cms-images/x.jpg" },
  });
});

describe("ImageUpload — client-side validation (defense-in-depth)", () => {
  it("rejects a file larger than 5 MB", async () => {
    mockUpload.mockResolvedValue({ error: null });
    render(<ImageUpload value={null} onChange={() => {}} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [makeFile("big.jpg", "image/jpeg", 5 * 1024 * 1024 + 1)] },
    });

    await waitFor(() =>
      expect(
        toastSpy.mock.calls.find((c) => c[0]?.title === "Ficheiro demasiado grande")
      ).toBeTruthy()
    );
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it("rejects a file whose MIME type is not in the image allowlist (e.g. SVG)", async () => {
    // SVG is intentionally excluded (stored XSS vector).
    render(<ImageUpload value={null} onChange={() => {}} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [makeFile("evil.svg", "image/svg+xml", 1024)] },
    });

    await waitFor(() =>
      expect(
        toastSpy.mock.calls.find((c) => c[0]?.title === "Tipo de ficheiro inválido")
      ).toBeTruthy()
    );
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it("rejects a renamed executable with an allowed MIME (extension check)", async () => {
    // A .jpg MIME but an .exe extension must not slip through.
    render(<ImageUpload value={null} onChange={() => {}} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [makeFile("payload.exe", "image/jpeg", 1024)] },
    });

    await waitFor(() =>
      expect(
        toastSpy.mock.calls.find((c) => c[0]?.title === "Extensão inválida")
      ).toBeTruthy()
    );
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it("uploads a valid PNG and forwards the public URL to onChange", async () => {
    const onChange = vi.fn();
    render(<ImageUpload value={null} onChange={onChange} folder="hero" />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [makeFile("photo.png", "image/png", 1024)] },
    });

    await waitFor(() => expect(mockUpload).toHaveBeenCalled());
    expect(onChange).toHaveBeenCalledWith(
      "https://example.supabase.co/storage/v1/object/public/cms-images/x.jpg"
    );
    // Upload path must be prefixed with the safe folder name.
    const uploadPath = mockUpload.mock.calls[0][0];
    expect(uploadPath.startsWith("hero/")).toBe(true);
  });

  it("falls back to the 'general' folder when given an unexpected folder", async () => {
    render(
      <ImageUpload value={null} onChange={() => {}} folder="../../etc/passwd" />
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [makeFile("photo.png", "image/png", 1024)] },
    });

    await waitFor(() => expect(mockUpload).toHaveBeenCalled());
    const uploadPath = mockUpload.mock.calls[0][0];
    expect(uploadPath.startsWith("general/")).toBe(true);
    // Path traversal must not reach the storage layer.
    expect(uploadPath.includes("..")).toBe(false);
  });

  it("surfaces an upload error via toast and does not call onChange", async () => {
    mockUpload.mockResolvedValue({ error: { message: "Network down" } });
    const onChange = vi.fn();
    render(<ImageUpload value={null} onChange={onChange} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [makeFile("photo.png", "image/png", 1024)] },
    });

    await waitFor(() =>
      expect(
        toastSpy.mock.calls.find((c) => c[0]?.title === "Erro no upload")
      ).toBeTruthy()
    );
    expect(onChange).not.toHaveBeenCalled();
  });
});
