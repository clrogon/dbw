interface SafeErrorLike {
  code?: string;
  status?: number;
  name?: string;
}

/**
 * Returns non-sensitive error metadata safe for client-side console logs.
 */
export const getSafeErrorMeta = (error: unknown): SafeErrorLike => {
  if (!error || typeof error !== "object") {
    return {};
  }

  const candidate = error as Record<string, unknown>;

  return {
    code: typeof candidate.code === "string" ? candidate.code : undefined,
    status: typeof candidate.status === "number" ? candidate.status : undefined,
    name: typeof candidate.name === "string" ? candidate.name : undefined,
  };
};

/**
 * Logs only safe, non-PII metadata for operational debugging.
 */
export const logClientError = (context: string, error?: unknown) => {
  const safeMeta = getSafeErrorMeta(error);
  if (Object.keys(safeMeta).length > 0) {
    console.error(context, safeMeta);
    return;
  }

  console.error(context);
};
