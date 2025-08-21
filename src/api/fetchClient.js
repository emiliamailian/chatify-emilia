const API_BASE = 'https://chatify-api.up.railway.app';

// Hämta CSRF-token från /csrf (läser både headers och body)
async function getCsrfToken() {
  const res = await fetch(`${API_BASE}/csrf`, {
    method: 'PATCH',
    credentials: 'include',   // viktigt för CSRF-cookie
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  // 1) prova headers
  const headerToken =
    res.headers.get('x-csrf-token') ||
    res.headers.get('csrf-token');

  // 2) prova JSON-body
  let bodyToken = null;
  try {
    const data = await res.json();
    bodyToken = data?.csrfToken || data?.csrf || data?.token || null;
  } catch {}

  const token = headerToken || bodyToken || null;
  console.info('[CSRF] token =', token);
  return token;
}

// Central fetch
export default async function fetchClient(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const jwt = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  // Endast för skrivande anrop skickar vi CSRF-header
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrf = await getCsrfToken();
    if (csrf) headers['X-CSRF-Token'] = csrf; // bara denna header
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

  if (!res.ok) {
    const message = data?.message || data?.error || res.statusText || 'Unknown error';
    return { success: false, status: res.status, message, data };
  }
  return { success: true, status: res.status, data };
}