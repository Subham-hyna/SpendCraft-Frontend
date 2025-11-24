import { authService } from '@/services/authService';
import { clearCookies } from '@/services/axiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';
// 🔹 Async Thunks (Redux way to handle async calls)
export const login = createAsyncThunk('auth/login', async (payload: any) => {
    const data = await authService.login(payload);
    return data;
  });
  
  export const logout = createAsyncThunk('auth/logout', async () => {
    const data = await authService.logout();
    clearCookies(); 
    return data;
  });