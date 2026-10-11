const SESSION_KEY = 'finanztitan_session_v1';

export const getSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    return session?.token && session?.user ? session : null;
  } catch {
    return null;
  }
};

export const getToken = () => getSession()?.token;

export const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const loginWithGoogle = async (idToken) => {
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
  if (!baseUrl) {
    throw new Error('Configura VITE_API_URL para conectar con el backend.');
  }

  const response = await fetch(`${baseUrl}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'No se pudo iniciar sesión con Google.');
  }

  return data;
};
