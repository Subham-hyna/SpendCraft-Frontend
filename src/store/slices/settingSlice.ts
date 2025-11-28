import { createSlice } from "@reduxjs/toolkit";
import { Setting } from "@/types/apiResponse";
import { getSetting, updateSetting } from "../thunks/settingThunks";

interface SettingState {
  setting: Setting | null;
  fetch_setting_loading: boolean;
  update_setting_loading: boolean;
}

const initialState: SettingState = {
  setting: null,
  fetch_setting_loading: false,
  update_setting_loading: false,
};

const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Fetch Expenses
        .addCase(getSetting.pending, (state) => {
          state.fetch_setting_loading = true;
        })
        .addCase(getSetting.fulfilled, (state, action) => {
          state.fetch_setting_loading = false;
          state.setting = action.payload;
        })
        .addCase(getSetting.rejected, (state) => {
          state.fetch_setting_loading = false;
        })
        // Update Setting
        .addCase(updateSetting.pending, (state) => {
          state.update_setting_loading = true;
        })
        .addCase(updateSetting.fulfilled, (state, action) => {
          state.update_setting_loading = false;
          state.setting = action.payload;
        })
        .addCase(updateSetting.rejected, (state) => {
          state.update_setting_loading = false;
        })
    },
  });
  
  export default settingSlice.reducer;
  