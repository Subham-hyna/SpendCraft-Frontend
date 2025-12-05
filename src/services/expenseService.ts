import axiosInstance from '@/services/axiosInstance';
import { Expense, FetchExpensesPayload, FetchExpensesResponse, FrencyDataResponse, MonthlyExpensesResponse } from '@/types/apiResponse';

export const prefix = 'expense';

export const expenseService = {
  // GET all expenses
  getAll: async (payload: FetchExpensesPayload): Promise<FetchExpensesResponse> => {
    const response = await axiosInstance.get(`/${prefix}`, { params: payload });
    return response.data;
  },

  // GET single expense
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/${prefix}/${id}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/${prefix}/${id}`);
    return response.data;
  },

  create: async (payload: any) => {
    const response = await axiosInstance.post(`/${prefix}`, payload);
    return response.data;
  },

  update: async (id: string, payload: any) => {
    const response = await axiosInstance.patch(`/${prefix}/${id}`, payload);
    return response.data;
  },

  userQuery: async (query: string): Promise<Expense> => {
    const response = await axiosInstance.post(`/${prefix}/user-query`, { query }, {timeout: 90000000});
    return response.data;
  },

  getMonthlyExpenses: async (payload: any): Promise<MonthlyExpensesResponse> => {
    const response = await axiosInstance.get(`/${prefix}/monthly-expenses`, { params: payload });
    return response.data;
  },

  getRangeExpenses: async (payload: any): Promise<FrencyDataResponse> => {
    const response = await axiosInstance.get(`/${prefix}/frequency`, { params: payload });
    return response.data;
  },
};
