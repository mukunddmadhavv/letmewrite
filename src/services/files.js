const BASE_URL = import.meta.env.DEV ? 'http://localhost:5001' : 'https://letmewrite.onrender.com';
const API_URL = `${BASE_URL}/api/files`;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: getHeaders(),
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return { data: data.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getUserFiles = async () => {
  try {
    const res = await fetch(API_URL, {
      headers: { 'Content-Type': 'application/json', ...getHeaders() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch files');
    return { data: data.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
