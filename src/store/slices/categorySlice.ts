import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, login, logout } from "@/store/thunks";
import { Category, User } from "@/types/apiResponse";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../thunks/categoryThunks";

interface CategoryState {
  categories: Category[];
  fetch_category_loading: boolean;
  create_update_category_loading: boolean;
  delete_category_loading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  fetch_category_loading: false,
  create_update_category_loading: false,
  delete_category_loading: false,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Get Categories
        .addCase(getCategories.pending, (state) => {
          state.fetch_category_loading = true;
        })
        .addCase(getCategories.fulfilled, (state, action) => {
          state.fetch_category_loading = false;
          state.categories = action.payload;
        })
        .addCase(getCategories.rejected, (state) => {
          state.fetch_category_loading = false;
        })

        // Create Category
        .addCase(createCategory.pending, (state) => {
          state.create_update_category_loading = true;
        })
        .addCase(createCategory.fulfilled, (state, action) => {
          state.create_update_category_loading = false;
        })
        .addCase(createCategory.rejected, (state) => {
          state.create_update_category_loading = false;
        })

        // Update Category
        .addCase(updateCategory.pending, (state) => {
          state.create_update_category_loading = true;
        })
        .addCase(updateCategory.fulfilled, (state, action) => {
          state.create_update_category_loading = false;
        })
        .addCase(updateCategory.rejected, (state) => {
          state.create_update_category_loading = false;
        })

        // Delete Category
        .addCase(deleteCategory.pending, (state) => {
          state.delete_category_loading = true;
        })
        .addCase(deleteCategory.fulfilled, (state, action) => {
          state.delete_category_loading = false;
          state.categories = state.categories.filter((category) => category._id !== action.payload);
        })
        .addCase(deleteCategory.rejected, (state) => {
          state.delete_category_loading = false;
        })
    },
  });
  
  export default categorySlice.reducer;
  