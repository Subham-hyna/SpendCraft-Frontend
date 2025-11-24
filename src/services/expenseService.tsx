import axiosInstance from '@/services/axiosInstance';

export const expenseService = {
  // GET all expenses
  getAll: async () => {
    const response = await axiosInstance.get('/expenses');
    return response.data;
  },

  // GET single expense
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/expenses/${id}`);
    return response.data;
  }
};
