const API_BASE_URL = (import.meta.env.PROD ? '/api/v1' : import.meta.env.VITE_API_URL || '/api/v1').replace(/\/+$/, '');
const API_URL = API_BASE_URL.endsWith('/api/v1') ? API_BASE_URL : `${API_BASE_URL}/api/v1`;
let accessTokenVersion = 0;
let refreshInFlight;

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function sendRequest(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError('We couldn’t reach MediSync. Check your connection and try again.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      result.message || 'Something went wrong. Please try again.',
      response.status
    );
  }
  return result;
}

export async function apiRequest(path, options = {}) {
  const versionAtRequest = accessTokenVersion;
  try {
    return await sendRequest(path, options);
  } catch (error) {
    if (error.status !== 401 || path.startsWith('/auth/')) throw error;

    if (accessTokenVersion === versionAtRequest) {
      refreshInFlight ??= sendRequest('/auth/refresh', { method: 'POST' })
        .then(() => { accessTokenVersion++; })
        .finally(() => { refreshInFlight = undefined; });
      await refreshInFlight;
    }

    return sendRequest(path, options);
  }
}

export async function restoreSession() {
  try {
    return (await apiRequest('/auth/me')).data.user;
  } catch (error) {
    if (error.status !== 401) throw error;
  }

  await apiRequest('/auth/refresh', { method: 'POST' });
  return (await apiRequest('/auth/me')).data.user;
}
