import { createAsyncThunk } from '@reduxjs/toolkit';
import { budgetService } from '@/services/budgetService';
// 🔹 Async Thunks (Redux way to handle async calls)
export const getBudgets = createAsyncThunk('budgets/get', async (payload: any, { rejectWithValue }) => {
  try {
    const response = await budgetService.getBudgets(payload);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const createBudget = createAsyncThunk('budgets/create', async (payload: any, { rejectWithValue }) => {
  try {
  const response = await budgetService.createBudget(payload);
  return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateBudget = createAsyncThunk('budgets/update', async (payload: any, { rejectWithValue }) => {
  try {
  const response = await budgetService.updateBudget(payload.id, payload.data);
  return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});