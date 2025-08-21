// src/api/authService.js
const API = 'https://chatify-api.up.railway.app';

// Hämtar CSRF-token från /csrf som JSON (utan cookies och extra headers)
async function getCsrf() {
  const res = await fetch(`${API}/csrf`, { method: 'PATCH' });
  const data = await res.json().catch(() => ({}));
  return data?.csrfToken || data?.csrf || data?.token || null;
}


// Registrera användare
export async function register({ username, email, password, avatar }) {
  const csrf = await getCsrf();
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(csrf ? { 'X-CSRF-Token': csrf } : {})
    },
    body: JSON.stringify({ username, email, password, avatar })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || data?.error || 'Registrering misslyckades');
  }
  return data;
}

// Logga in och få JWT
export async function login({ username, password }) {
  const csrf = await getCsrf();
  const res = await fetch(`${API}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(csrf ? { 'X-CSRF-Token': csrf } : {})
    },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.token) {
    throw new Error(data?.message || data?.error || 'Invalid credentials');
  }
  return data; // { token, ... }
}
