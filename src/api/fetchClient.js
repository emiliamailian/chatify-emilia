const API_BASE = 'https://chatify-api.up.railway.app';

let csrfTokenCache = null;

async function ensureCsrf() {
  if (csrfTokenCache) return csrfTokenCache;

  const res = await fetch(`${API_BASE}/csrf`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  // prova läsa JSON
  let data = {};
  try { data = await res.json(); } catch { /* kan vara tom body */ }

  // plocka också från headers om JSON saknas
  const h = Object.fromEntries(res.headers.entries());
  const headerToken =
    h['x-csrf-token'] ||
    h['csrf-token'] ||
    h['x-xsrf-token'] ||
    h['x-csrf'] ||
    null;

  csrfTokenCache =
    data?.csrfToken || data?.csrf || data?.token || headerToken || null;

  if (!csrfTokenCache) {
    console.warn('CSRF token saknas efter /csrf – kontrollera tredjepartscookies och Netlify/HTTPS.');
  }
  return csrfTokenCache;
}

/**
 * Central fetch:
 * - Authorization: Bearer <jwt> om finns
 * - X-CSRF-Token på POST/PUT/PATCH/DELETE
 * - credentials: include
 */
export default async function fetchClient(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const jwt = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers || {}),
  };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrf = await ensureCsrf();
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    method,
    headers,
    credentials: 'include',
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

  const headersObj = Object.fromEntries(res.headers.entries());

  if (!res.ok) {
    const message = data?.message || data?.error || res.statusText || 'Unknown error';
    return { success: false, status: res.status, message, data, headers: headersObj };
  }
  return { success: true, status: res.status, data, headers: headersObj };
}
