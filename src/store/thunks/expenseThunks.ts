import { createAsyncThunk } from '@reduxjs/toolkit';
// 🔹 Async Thunks (Redux way to handle async calls)
export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const data = [{ id: '1', name: 'Expense 1', amount: 100 }];
    return data;
  });
  
  export const deleteExpense = createAsyncThunk('expenses/delete', async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return id;
  });
  
  export const createExpense = createAsyncThunk('expenses/create', async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return { id: '1', name: 'Expense 1', amount: 100 };
  });