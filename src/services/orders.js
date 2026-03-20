import { supabase } from './supabase';

export const createOrder = async ({ title, subject, pages, deadline, instructions, userId }) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ title, subject, pages, deadline, instructions, user_id: userId, status: 'Pending', cost: pages * 10 }])
    .select()
    .single();
  return { data, error };
};

export const getUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getOrderById = async (id) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};
