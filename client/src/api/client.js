import { readAuth } from './authStorage';

const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (auth) {
    const session = readAuth();
    if (session?.token) {
      headers.Authorization = `Bearer ${session.token}`;
    }
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch (err) {
    const error = new Error('Cannot reach the server. Start the API and try again.');
    error.status = 0;
    throw error;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    error.body = data;
    throw error;
  }
  return data;
}
