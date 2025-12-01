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

export const createExpense = createAsyncThunk('expenses/create', async () => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return { id: '1', name: 'Expense 1', amount: 100 };
});

export const getExpenseById = createAsyncThunk('expenses/getById', async (id: string) => {
  const response = await expenseService.getById(id);
  return response;
});