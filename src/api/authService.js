import fetchClient from './fetchClient';

export async function registerUser(form) {
  const payload = { ...form };
  if (!payload.avatar) delete payload.avatar;
  return await fetchClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function login(form) {
  return await fetchClient('/auth/token', {
    method: 'POST',
    body: JSON.stringify(form),
  });
}
