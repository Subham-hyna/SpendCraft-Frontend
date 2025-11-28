import { createSlice } from "@reduxjs/toolkit";
import { Alert } from "@/types/apiResponse";
import { getAlert, updateAlert } from "../thunks/alertThunks";

interface AlertState {
  alert: Alert | null;
  fetch_alert_loading: boolean;
  update_alert_loading: boolean;
}

const initialState: AlertState = {
  alert: null,
  fetch_alert_loading: false,
  update_alert_loading: false,
};

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Fetch Expenses
        .addCase(getAlert.pending, (state) => {
          state.fetch_alert_loading = true;
        })
        .addCase(getAlert.fulfilled, (state, action) => {
          state.fetch_alert_loading = false;
          state.alert = action.payload;
        })
        .addCase(getAlert.rejected, (state) => {
          state.fetch_alert_loading = false;
        })
        // Update Setting
        .addCase(updateAlert.pending, (state) => {
          state.update_alert_loading = true;
        })
        .addCase(updateAlert.fulfilled, (state, action) => {
          state.update_alert_loading = false;
          state.alert = action.payload;
        })
        .addCase(updateAlert.rejected, (state) => {
          state.update_alert_loading = false;
        })
    },
  });
  
  export default alertSlice.reducer;
  