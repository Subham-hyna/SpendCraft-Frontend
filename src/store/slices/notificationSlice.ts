import { createSlice } from "@reduxjs/toolkit";
import { Notification } from "@/types/apiResponse";
import { getNotifications, markAsRead, markAllAsRead } from "../thunks/notificationThunks";

interface NotificationState {
  notifications: Notification[];
  fetch_notifications_loading: boolean;
  mark_as_read_notification_loading: boolean;
  mark_all_as_read_notification_loading: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  fetch_notifications_loading: false,
  mark_as_read_notification_loading: false,
  mark_all_as_read_notification_loading: false,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Fetch Notifications
        .addCase(getNotifications.pending, (state) => {
          state.fetch_notifications_loading = true;
        })
        .addCase(getNotifications.fulfilled, (state, action) => {
          state.fetch_notifications_loading = false;
          state.notifications = action.payload;
        })
        .addCase(getNotifications.rejected, (state) => {
          state.fetch_notifications_loading = false;
        })
        // Mark as Read Notification
        .addCase(markAsRead.pending, (state) => {
          state.mark_as_read_notification_loading = true;
        })
        .addCase(markAsRead.fulfilled, (state, action) => {
          state.mark_as_read_notification_loading = false;
        })
        .addCase(markAsRead.rejected, (state) => {
          state.mark_as_read_notification_loading = false;
        })
        // Mark All as Read Notification
        .addCase(markAllAsRead.pending, (state) => {
          state.mark_all_as_read_notification_loading = true;
        })
        .addCase(markAllAsRead.fulfilled, (state, action) => {
          state.mark_all_as_read_notification_loading = false;
        })
        .addCase(markAllAsRead.rejected, (state) => {
          state.mark_all_as_read_notification_loading = false;
        })
    },
  });
  
  export default notificationSlice.reducer;    
  