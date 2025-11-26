import { authService } from '@/services/authService';
import { clearCookies } from '@/services/axiosInstance';
import { userService } from '@/services/userService';
import { createAsyncThunk } from '@reduxjs/toolkit';
// 🔹 Async Thunks (Redux way to handle async calls)
export const login = createAsyncThunk('auth/login', async (payload: any, { rejectWithValue }) => {
  try {
    const data = await authService.login(payload);
    return data;
  } catch (error: any) {
    // Preserve the full error structure so we can access response.data.message
    return rejectWithValue(error);
  }
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  const data = await userService.fetchUser();
  return data;
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const data = await authService.logout();
    clearCookies(); 
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});