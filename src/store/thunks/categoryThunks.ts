import { categoryService } from '@/services/categoryService';
import { createAsyncThunk } from '@reduxjs/toolkit';
// 🔹 Async Thunks (Redux way to handle async calls)
export const getCategories = createAsyncThunk('category/get', async (_, { rejectWithValue }) => {
  try {
    const data = await categoryService.getCategories();
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const createCategory = createAsyncThunk('category/create', async (payload: any, { rejectWithValue }) => {
  try {
    const data = await categoryService.createCategory(payload);
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateCategory = createAsyncThunk('category/update', async (payload: any, { rejectWithValue }) => {
  try {
    const data = await categoryService.updateCategory(payload);
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const deleteCategory = createAsyncThunk('category/delete', async (categoryId: string, { rejectWithValue }) => {
  try {
    const data = await categoryService.deleteCategory(categoryId);
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});