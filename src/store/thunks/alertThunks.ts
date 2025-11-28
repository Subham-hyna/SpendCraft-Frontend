import { alertService } from '@/services/alertService';
import { createAsyncThunk } from '@reduxjs/toolkit';
// 🔹 Async Thunks (Redux way to handle async calls)
export const getAlert = createAsyncThunk('alert/get', async (_, { rejectWithValue }) => {
  try {
    const data = await alertService.getAlert();
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateAlert = createAsyncThunk('alert/update', async (payload: any, { rejectWithValue }) => {
  try {
    const data = await alertService.update(payload);
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});