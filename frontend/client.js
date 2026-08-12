const BASE_URL = "http://localhost:5153/api";

const TOKEN_KEY = "taskapi_token";
const USERNAME_KEY = "taskapi_username";

let authToken = sessionStorage.getItem(TOKEN_KEY);
let unauthorizedHandler = null;

export function setAuthToken(token, username) {
  authToken = token;
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
    if (username) sessionStorage.setItem(USERNAME_KEY, username);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
  }
}

export function getStoredSession() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const username = sessionStorage.getItem(USERNAME_KEY);
  return token && username ? { token, username } : null;
}

export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

function authHeaders() {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

async function handle(res) {
  if (res.status === 401 && unauthorizedHandler) {
    unauthorizedHandler();
  }
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