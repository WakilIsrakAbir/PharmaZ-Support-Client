/** An error from the API, with the message and per-field errors the server sent. */
export class ApiError extends Error {
  constructor(status, message, fields = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

/**
 * Calls the Express API and returns its JSON.
 * Requests go to /api on this site, and Next.js forwards them (see next.config.mjs).
 */
export async function api(path, { method = "GET", body } = {}) {
  let response;

  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const fallback =
      response.status >= 500 ? "The server isn't responding right now. Please try again." : "Something went wrong.";
    throw new ApiError(response.status, data?.error?.message ?? fallback, data?.error?.fields);
  }

  return data;
}
