import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '@/services/notificationService';
// 🔹 Async Thunks (Redux way to handle async calls)
export const getNotifications = createAsyncThunk('notifications/get', async (_, { rejectWithValue }) => {
  try {
    const response = await notificationService.getNotifications();
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await notificationService.markAsRead(id);
      // Refetch notifications after marking as read
      await dispatch(getNotifications());
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await notificationService.markAllAsRead();
      await dispatch(getNotifications());
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);