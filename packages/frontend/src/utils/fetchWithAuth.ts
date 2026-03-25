export const fetchWithAuth = async (
  url: string,
  options?: RequestInit,
  token?: string,
) => {
  const headers = token
    ? { ...options?.headers, Authorization: `Bearer ${token}` }
    : options?.headers;

  return fetch(url, { ...options, headers });
};
