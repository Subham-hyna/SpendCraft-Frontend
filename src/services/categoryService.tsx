import axiosInstance from '@/services/axiosInstance';
import { Category, CreateUpdateCategoryResponse, GoogleLoginResponse } from '@/types/apiResponse';
import { removeCookie, setCookie, setToken, clearTokens } from '@/services/axiosInstance';

export const prefix = 'category';

export const categoryService = {
  // GET categories
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get(`/${prefix}`);
    return response.data;
  },

  // POST create category
  createCategory: async (payload: any): Promise<CreateUpdateCategoryResponse> => {
    const response = await axiosInstance.post(`/${prefix}`, payload);
    return response.data;
  },

  // PUT update category
  updateCategory: async (payload: any): Promise<CreateUpdateCategoryResponse> => {
    const response = await axiosInstance.patch(`/${prefix}/${payload._id}`, payload.data);
    return response.data;
  },

  // DELETE delete category
  deleteCategory: async (categoryId: string): Promise<string> => {
    const response = await axiosInstance.delete(`/${prefix}/${categoryId}`);
    return response.data;
  },
};
