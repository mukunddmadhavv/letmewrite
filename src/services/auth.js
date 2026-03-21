const BASE_URL = import.meta.env.DEV ? 'http://localhost:5001' : 'https://letmewrite.onrender.com';
const API_URL = `${BASE_URL}/api/auth`;

export const signUp = async ({ username, phone, password }) => {
  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signIn = async ({ username, password }) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { error: null };
};

export const getSession = async () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user) {
    return { user: JSON.parse(user), token };
  }
  return null;
};
