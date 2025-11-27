import { authService } from '@/services/authService';
import { clearTokens, removeCookie } from '@/services/axiosInstance';
import { categoryService } from '@/services/categoryService';
import { userService } from '@/services/userService';
import { createAsyncThunk } from '@reduxjs/toolkit';
// 🔹 Async Thunks (Redux way to handle async calls)
export const getCategories = createAsyncThunk('category/getCategories', async (_, { rejectWithValue }) => {
  try {
    const data = await categoryService.getCategories();
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const createCategory = createAsyncThunk('category/createCategory', async (payload: any, { rejectWithValue }) => {
  try {
    const data = await categoryService.createCategory(payload);
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateCategory = createAsyncThunk('category/updateCategory', async (payload: any, { rejectWithValue }) => {
  try {
    const data = await categoryService.updateCategory(payload);
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const deleteCategory = createAsyncThunk('category/deleteCategory', async (categoryId: string, { rejectWithValue }) => {
  try {
    const data = await categoryService.deleteCategory(categoryId);
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});