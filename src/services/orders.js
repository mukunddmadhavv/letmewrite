const BASE_URL = import.meta.env.DEV ? 'http://localhost:5001' : 'https://letmewrite.onrender.com';
const API_URL = `${BASE_URL}/api/orders`;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const createOrder = async (orderData) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create order');
    return { data: data.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getUserOrders = async () => {
  try {
    const res = await fetch(API_URL, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
    return { data: data.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
