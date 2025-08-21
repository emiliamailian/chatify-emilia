const API_BASE = 'https://chatify-api.up.railway.app';

// Hämtar CSRF och loggar status, headers och body
async function getCsrfToken() {
  console.groupCollapsed('[CSRF] PATCH /csrf');

  const res = await fetch(`${API_BASE}/csrf`, {
    method: 'PATCH',
    credentials: 'include',
    cache: 'no-store',
    headers: { Accept: 'application/json' }
  });

  const headersObj = Object.fromEntries(res.headers.entries());

  const clone = res.clone();
  let bodyText = '';
  try { bodyText = await clone.text(); } catch {}

  let bodyJson = {};
  try { bodyJson = bodyText ? JSON.parse(bodyText) : {}; } catch {}

  const headerToken =
    headersObj['x-csrf-token'] ||
    headersObj['csrf-token'] ||
    null;

  const bodyToken =
    (bodyJson && (bodyJson.csrfToken || bodyJson.csrf || bodyJson.token)) || null;

  const token = headerToken || bodyToken || null;

  console.log('status:', res.status);
  console.log('headers:', headersObj);
  console.log('body:', Object.keys(bodyJson).length ? bodyJson : bodyText);
  console.log('chosen token:', token);

  console.groupEnd();
  return token;
}

// Central fetch som loggar request + response
export default async function fetchClient(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const jwt = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  // För skrivande metoder: hämta CSRF och lägg på ENDAST X-CSRF-Token
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrf = await getCsrfToken();
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }

  console.groupCollapsed(`[API] ${method} ${path}`);
  console.log('request headers:', headers);
  console.log('request body:', options.body || null);

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    method,
    headers,
    credentials: 'include'
  });

  const resHeaders = Object.fromEntries(res.headers.entries());

  const clone = res.clone();
  let resText = '';
  try { resText = await clone.text(); } catch {}

  let data;
  try { data = resText ? JSON.parse(resText) : {}; } catch { data = { raw: resText }; }

  console.log('status:', res.status);
  console.log('response headers:', resHeaders);
  console.log('response body:', data);
  console.groupEnd();

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || res.statusText || 'Unknown error';
    return { success: false, status: res.status, message, data, headers: resHeaders };
  }
  return { success: true, status: res.status, data, headers: resHeaders };
}
