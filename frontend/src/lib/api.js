const BASE_URL = "http://localhost:5000/api";

/**
 * Core fetch wrapper.
 * - Always sends credentials (the httpOnly JWT cookie)
 * - Throws an Error with the server's message on non-2xx responses
 */
async function request(path, options = {}) {
  const { body, ...rest } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      json?.message || json?.error || `Request failed: ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.data = json;
    throw err;
  }

  return json;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),

  register: (data) =>
    request("/auth/register", { method: "POST", body: data }),

  me: () => request("/auth/me"),

  logout: () => request("/auth/logout", { method: "POST" }),
};

// ── Departments ───────────────────────────────────────────────────────────────

export const departmentsApi = {
  list: () => request("/departments"),
  get: (id) => request(`/departments/${id}`),
  create: (data) => request("/departments", { method: "POST", body: data }),
  update: (id, data) =>
    request(`/departments/${id}`, { method: "PATCH", body: data }),
  delete: (id) => request(`/departments/${id}`, { method: "DELETE" }),
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const usersApi = {
  list: () => request("/users"),
  get: (id) => request(`/users/${id}`),
  create: (data) => request("/users", { method: "POST", body: data }),
  update: (id, data) => request(`/users/${id}`, { method: "PATCH", body: data }),
  delete: (id) => request(`/users/${id}`, { method: "DELETE" }),
};

// ── Assets ────────────────────────────────────────────────────────────────────

export const assetsApi = {
  list: (params) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/assets${qs}`);
  },
  get: (id) => request(`/assets/${id}`),
  create: (data) => request("/assets", { method: "POST", body: data }),
  update: (id, data) =>
    request(`/assets/${id}`, { method: "PATCH", body: data }),
  delete: (id) => request(`/assets/${id}`, { method: "DELETE" }),
};
