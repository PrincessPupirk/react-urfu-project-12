const buildHeaders = ({ token, body } = {}) => ({
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...(body ? { 'Content-Type': 'application/json' } : {}),
});

const request = async (method, path, { token, body } = {}) => {
  const response = await fetch(`/api/v1${path}`, {
    method,
    headers: buildHeaders({ token, body }),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};

export const getChannels = (token) => request('GET', '/channels', { token });

export const getMessages = (token) => request('GET', '/messages', { token });

export const postMessage = (token, body) => request('POST', '/messages', { token, body });

export const postChannel = (token, body) => request('POST', '/channels', { token, body });

export const patchChannel = (token, id, body) => request('PATCH', `/channels/${id}`, { token, body });

export const deleteChannel = (token, id) => request('DELETE', `/channels/${id}`, { token });

export const postSignup = async (body) => {
  const response = await fetch('/api/v1/signup', {
    method: 'POST',
    headers: buildHeaders({ body }),
    body: JSON.stringify(body),
  });

  if (response.status === 409) {
    const error = new Error('Conflict');
    error.status = 409;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export default request;
