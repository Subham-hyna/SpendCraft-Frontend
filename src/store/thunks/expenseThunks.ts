import { createAsyncThunk } from '@reduxjs/toolkit';
import { expenseService } from '@/services/expenseService';
import { FetchExpensesPayload } from '@/types/apiResponse';
// 🔹 Async Thunks (Redux way to handle async calls)
export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async (payload: FetchExpensesPayload) => {
  const response = await expenseService.getAll(payload);
  return response;
});

export const deleteExpense = createAsyncThunk('expenses/delete', async (id: string) => {
  await expenseService.delete(id);
  return id;
});

export const createExpense = createAsyncThunk('expenses/create', async (payload: any) => {
  const response = await expenseService.create(payload);
  return response;
});

export const getExpenseById = createAsyncThunk('expenses/getById', async (id: string, { rejectWithValue }) => {
  try {
    const response = await expenseService.getById(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateExpense = createAsyncThunk('expenses/update', async (payload: any, { rejectWithValue }) => {
  try {
  const response = await expenseService.update(payload.id, payload.data);
  return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
  
});

export const userQuery = createAsyncThunk('expenses/userQuery', async (query: string) => {
  const response = await expenseService.userQuery(query);
  return response;
});

export const getMonthlyExpenses = createAsyncThunk('expenses/getMonthlyExpenses', async (payload: any) => {
  const response = await expenseService.getMonthlyExpenses(payload);
  return response;
});

export const getRangeExpenses = createAsyncThunk('expenses/getRangeExpenses', async (payload: any) => {
  const response = await expenseService.getRangeExpenses(payload);
  return response;
});