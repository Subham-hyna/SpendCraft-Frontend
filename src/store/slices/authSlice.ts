import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, login, logout, profileStats, updateUser, uploadImage } from "@/store/thunks";
import { ProfileStatsResponse, User } from "@/types/apiResponse";
interface AuthState {
  user: User | null;
  login_loading: boolean;
  fetch_user_loading: boolean;
  logout_loading: boolean;
  upload_image_loading: boolean;
  profile_stats_loading: boolean;
  update_user_loading: boolean;
  profile_stats: ProfileStatsResponse | null;
  is_authenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  login_loading: false,
  fetch_user_loading: true,
  profile_stats: null,
  is_authenticated: false,
  logout_loading: false,
  profile_stats_loading: false,
  upload_image_loading: false,
  update_user_loading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Login
        .addCase(login.pending, (state) => {
          state.login_loading = true;
          state.is_authenticated = false;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.login_loading = false;
          state.user = action.payload.user;
          state.is_authenticated = true;
        })
        .addCase(login.rejected, (state) => {
          state.login_loading = false;
          state.is_authenticated = false;
        })

        // Fetch User
        .addCase(fetchUser.pending, (state) => {
          state.fetch_user_loading = true;
          state.is_authenticated = false;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
          state.fetch_user_loading = false;
          state.user = action.payload;
          state.is_authenticated = true;
        })
        .addCase(fetchUser.rejected, (state) => {
          state.fetch_user_loading = false;
          state.is_authenticated = false;
        })
        
        // Logout
        .addCase(logout.pending, (state) => {
          state.logout_loading = true;
        })
        .addCase(logout.fulfilled, (state) => {
          state.user = null;
          state.logout_loading = false;
        })
        .addCase(logout.rejected, (state) => {
          state.logout_loading = false;
        })

        // Upload Image
        .addCase(uploadImage.pending, (state) => {
          state.upload_image_loading = true;
        })
        .addCase(uploadImage.fulfilled, (state, action) => {
          state.upload_image_loading = false;
          state.user = action.payload;
        })
        .addCase(uploadImage.rejected, (state) => {
          state.upload_image_loading = false;
        })

        // Profile Stats
        .addCase(profileStats.pending, (state) => {
          state.profile_stats_loading = true;
        })
        .addCase(profileStats.fulfilled, (state, action) => {
          state.profile_stats_loading = false;
          state.profile_stats = action.payload;
        })
        .addCase(profileStats.rejected, (state) => {
          state.profile_stats_loading = false;
        })

        // Update User
        .addCase(updateUser.pending, (state) => {
          state.update_user_loading = true;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
          state.update_user_loading = false;
          state.user = action.payload;
        })
        .addCase(updateUser.rejected, (state) => {
          state.update_user_loading = false;
        })  
    },
  });
  
  export default authSlice.reducer;
  