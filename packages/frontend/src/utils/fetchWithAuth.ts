export const fetchWithAuth = async (url: string, options?: RequestInit) => {

  const token = localStorage.getItem('token')
  const headers = token ? {...options?.headers,
    Authorization: `Bearer ${token}`,
  } : options?.headers

  return fetch(url, {...options, headers})
}
