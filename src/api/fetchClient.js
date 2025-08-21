const API_BASE = 'https://chatify-api.up.railway.app';

let csrfTokenCache = null;

// Hämtar CSRF-token från /csrf (JSON eller headers). Ingen förbjuden header används.
async function fetchCsrfToken() {
  const res = await fetch(`${API_BASE}/csrf`, {
    method: 'PATCH',
    credentials: 'include',   // viktigt: skicka/kvitto på cookie
    cache: 'no-store',
  });

  // Försök läsa JSON-body
  let data = {};
  try { data = await res.json(); } catch { /* tom body är ok */ }

  // Prova header-varianter också
  const h = Object.fromEntries(res.headers.entries());
  const headerToken =
    h['x-csrf-token'] ||
    h['csrf-token'] ||
    h['x-xsrf-token'] ||
    h['x-csrf'] ||
    null;

  // Välj första som finns
  return data?.csrfToken || data?.csrf || data?.token || headerToken || null;
}

async function ensureCsrf() {
  if (csrfTokenCache) return csrfTokenCache;
  csrfTokenCache = await fetchCsrfToken();
  return csrfTokenCache;
}

/**
 * Central fetch:
 * - Lägger på Authorization: Bearer <jwt> om finns
 * - För POST/PUT/PATCH/DELETE: hämtar CSRF och skickar i headern (X-CSRF-Token)
 * - credentials: 'include' för att få/returnera CSRF-cookie
 */
export default async function fetchClient(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const jwt = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  // SKRIVANDE metoder => hämta CSRF och skicka headern
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrf = await ensureCsrf();     // <-- viktigt: väntar in token
    if (csrf) {
      headers['X-CSRF-Token'] = csrf;    // den varianten API:t förväntar sig
      // extra kompatibilitet (skadar inte):
      headers['CSRF-Token']   = csrf;
      headers['X-XSRF-Token'] = csrf;
    }
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
