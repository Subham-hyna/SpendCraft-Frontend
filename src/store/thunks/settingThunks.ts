import { settingService } from '@/services/settingService';
import { createAsyncThunk } from '@reduxjs/toolkit';
// 🔹 Async Thunks (Redux way to handle async calls)
export const getSetting = createAsyncThunk('setting/get', async (_, { rejectWithValue }) => {
  try {
    const data = await settingService.getSetting();
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateSetting = createAsyncThunk('setting/update', async (payload: any, { rejectWithValue }) => {
  try {
    const data = await settingService.updateSetting(payload);
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});