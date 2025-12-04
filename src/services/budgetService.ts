import axiosInstance from '@/services/axiosInstance';
import { Budget, GetBudgetsResponse } from '@/types/apiResponse';

export const prefix = 'budget';

export const budgetService = {
  getBudgets: async (payload: any): Promise<GetBudgetsResponse> => {
    const response = await axiosInstance.get(`/${prefix}`, { params: payload });
    return response.data;
  },

  createBudget: async (payload: any): Promise<Budget> => {
    const response = await axiosInstance.post(`/${prefix}`, payload);
    return response.data;
  },

  updateBudget: async (id: string, payload: any): Promise<Budget> => {
    const response = await axiosInstance.patch(`/${prefix}/${id}`, payload);
    return response.data;
  },
};