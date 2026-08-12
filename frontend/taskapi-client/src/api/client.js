const BASE_URL = "http://localhost:5153/api";

// Simple in-memory token store. Good tier: fine for a take-home. Better
// tier: move to an httpOnly cookie set by the server so JS (and any XSS
// payload) can never read the token at all.
let authToken = null;
export function setAuthToken(token) {
  authToken = token;
}

function authHeaders() {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  register: (username, password) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(handle),

  login: (username, password) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(handle),

  getTasks: () => fetch(`${BASE_URL}/tasks`, { headers: authHeaders() }).then(handle),

  getTask: (id) => fetch(`${BASE_URL}/tasks/${id}`, { headers: authHeaders() }).then(handle),

  createTask: (task) =>
    fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(task),
    }).then(handle),

  updateTask: (id, task) =>
    fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(task),
    }).then(handle),

  deleteTask: (id) =>
    fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE", headers: authHeaders() }).then(handle),
};
