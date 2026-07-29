const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch<T = any>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
