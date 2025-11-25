import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, login, logout } from "@/store/thunks";
import { User } from "@/types/apiResponse";
interface AuthState {
  user: User | null;
  loading: boolean;
  is_authenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  is_authenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Login
        .addCase(login.pending, (state) => {
          state.loading = true;
          state.is_authenticated = false;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.is_authenticated = true;
        })
        .addCase(login.rejected, (state) => {
          state.loading = false;
          state.is_authenticated = false;
        })

        // Fetch User
        .addCase(fetchUser.pending, (state) => {
          state.loading = true;
          state.is_authenticated = false;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
          state.is_authenticated = true;
        })
        .addCase(fetchUser.rejected, (state) => {
          state.loading = false;
          state.is_authenticated = false;
        })
        
        // Logout
        .addCase(logout.pending, (state) => {
          state.loading = true;
        })
        .addCase(logout.fulfilled, (state) => {
          state.user = null;
        })
        .addCase(logout.rejected, (state) => {
          state.loading = false;
        });
    },
  });
  
  export default authSlice.reducer;
  