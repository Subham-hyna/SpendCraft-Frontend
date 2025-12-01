import { createSlice } from "@reduxjs/toolkit";
import { fetchExpenses, createExpense, deleteExpense, getExpenseById } from "@/store/thunks";
import { Expense, Pagination } from "@/types/apiResponse";
interface ExpenseState {
  expenses: Expense[];
  fetch_expenses_loading: boolean;
  hasMore: boolean;
  fetch_expense_by_id_loading: boolean;
  delete_expense_loading: boolean;
  expense: Expense | null;
}

const initialState: ExpenseState = {
  expenses: [],
  fetch_expenses_loading: false,
  hasMore: true,
  fetch_expense_by_id_loading: false,
  delete_expense_loading: false,
  expense: null,
};

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
      resetExpenses: (state) => {
        state.expenses = [];
        state.hasMore = true;
      },

      resetExpenseById: (state) => {
        state.expense = null;
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch Expenses
        .addCase(fetchExpenses.pending, (state) => {
          state.fetch_expenses_loading = true;
        })
        .addCase(fetchExpenses.fulfilled, (state, action) => {
          state.fetch_expenses_loading = false;
          
          state.expenses = action.payload.expenses;
          
          // Check if there are more items to load
          const { skip, limit, total } = action.payload.pagination;
          state.hasMore = skip + limit < total;
        })
        .addCase(fetchExpenses.rejected, (state) => {
          state.fetch_expenses_loading = false;
        })

        // Get Expense By Id
        .addCase(getExpenseById.pending, (state) => {
          state.fetch_expense_by_id_loading = true;
        })
        .addCase(getExpenseById.fulfilled, (state, action) => {
          state.fetch_expense_by_id_loading = false;
          state.expense = action.payload;
        })
        .addCase(getExpenseById.rejected, (state) => {
          state.fetch_expense_by_id_loading = false;
        })

        // Delete Expense
        .addCase(deleteExpense.pending, (state) => {
          state.delete_expense_loading = true;
        })
        .addCase(deleteExpense.fulfilled, (state, action) => {
          state.delete_expense_loading = false;
          state.expenses = state.expenses.filter((expense) => expense._id !== action.payload);
        })
        .addCase(deleteExpense.rejected, (state) => {
          state.delete_expense_loading = false;
        })
    },
  });
  
  export const { resetExpenses, resetExpenseById } = expenseSlice.actions;
  export default expenseSlice.reducer;
  