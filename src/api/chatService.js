import fetchClient from './fetchClient';

export const getMessages = async () => await fetchClient('/messages', { method: 'GET' });
export const createMessage = async (message) => await fetchClient('/messages', { method: 'POST', body: JSON.stringify({ message }) });
export const deleteMessage = async (id) => await fetchClient(`/messages/${id}`, { method: 'DELETE' });
