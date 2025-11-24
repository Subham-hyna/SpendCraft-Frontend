import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "@/store/thunks";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
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
        })
        .addCase(login.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(login.rejected, (state) => {
          state.loading = false;
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
  