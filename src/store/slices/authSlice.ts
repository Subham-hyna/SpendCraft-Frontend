import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, login, logout } from "@/store/thunks";
import { User } from "@/types/apiResponse";
interface AuthState {
  user: User | null;
  login_loading: boolean;
  fetch_user_loading: boolean;
  logout_loading: boolean;
  is_authenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  login_loading: false,
  fetch_user_loading: true,
  is_authenticated: false,
  logout_loading: false,
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
        });
    },
  });
  
  export default authSlice.reducer;
  