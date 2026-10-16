const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "auth_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function getErrorMessage(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await response.json();

    if (body.message) return body.message;
    if (body.errors) return Object.values(body.errors).flat().join(" ");
    return body.error || "Ocurrió un error en el servidor.";
  }

  return (await response.text()) || "Ocurrió un error en el servidor.";
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  const token = getToken();

  headers.set("Accept", "application/json");

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) clearToken();
  if (!response.ok) throw new Error(await getErrorMessage(response));
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json")
    ? response.json()
    : response.text();
}

export const get = (path, options = {}) =>
  request(path, { ...options, method: "GET" });

export const post = (path, data, options = {}) =>
  request(path, { ...options, method: "POST", body: JSON.stringify(data) });

export const put = (path, data, options = {}) =>
  request(path, { ...options, method: "PUT", body: JSON.stringify(data) });

export const remove = (path, options = {}) =>
  request(path, { ...options, method: "DELETE" });

export { clearToken, getToken, TOKEN_KEY };

export default { get, post, put, delete: remove };
