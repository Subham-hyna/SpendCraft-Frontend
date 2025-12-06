import { createSlice } from "@reduxjs/toolkit";
import { fetchExpenses, createExpense, deleteExpense, getExpenseById, updateExpense, userQuery, getMonthlyExpenses, getRangeExpensesByCategory, getRangeExpensesByFrequency } from "@/store/thunks";
import { CategoryDataResponse, Expense, FrequencyDataResponse, MonthlyExpensesResponse, Pagination } from "@/types/apiResponse";
interface ExpenseState {
  expenses: Expense[];
  fetch_expenses_loading: boolean;
  hasMore: boolean;
  fetch_expense_by_id_loading: boolean;
  delete_expense_loading: boolean;
  expense: Expense | null;
  create_update_expense_loading: boolean;
  user_query_loading: boolean;
  user_query_expense: Expense | null;
  monthly_expenses_loading: boolean;
  monthly_expenses: MonthlyExpensesResponse | null;
  range_expenses_by_frequency_loading: boolean;
  range_expenses_by_frequency: FrequencyDataResponse | null;
  range_expenses_by_category_loading: boolean;
  range_expenses_by_category: CategoryDataResponse | null;
}

const initialState: ExpenseState = {
  expenses: [],
  fetch_expenses_loading: false,
  hasMore: true,
  fetch_expense_by_id_loading: false,
  delete_expense_loading: false,
  expense: null,
  create_update_expense_loading: false,
  user_query_loading: false,
  user_query_expense: null,
  monthly_expenses_loading: false,
  monthly_expenses: null,
  range_expenses_by_frequency_loading: false,
  range_expenses_by_category_loading: false,
  range_expenses_by_frequency: null,
  range_expenses_by_category: null,
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

      resetUserQuery: (state) => {
        state.user_query_expense = null;
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

        // Create Expense
        .addCase(createExpense.pending, (state) => {
          state.create_update_expense_loading = true;
        })
        .addCase(createExpense.fulfilled, (state, action) => {
          state.create_update_expense_loading = false;
        })
        .addCase(createExpense.rejected, (state) => {
          state.create_update_expense_loading = false;
        })

        // Update Expense
        .addCase(updateExpense.pending, (state) => {
          state.create_update_expense_loading = true;
        })
        .addCase(updateExpense.fulfilled, (state, action) => {
          state.create_update_expense_loading = false;
        })
        .addCase(updateExpense.rejected, (state) => {
          state.create_update_expense_loading = false;
        })

        // User Query
        .addCase(userQuery.pending, (state) => {
          state.user_query_loading = true;
        })
        .addCase(userQuery.fulfilled, (state, action) => {
          state.user_query_expense = action.payload;
          state.user_query_loading = false;
        })
        .addCase(userQuery.rejected, (state) => {
          state.user_query_loading = false;
        })

        // Get Monthly Expenses
        .addCase(getMonthlyExpenses.pending, (state) => {
          state.monthly_expenses_loading = true;
        })
        .addCase(getMonthlyExpenses.fulfilled, (state, action) => {
          state.monthly_expenses_loading = false;
          state.monthly_expenses = action.payload;
        })
        .addCase(getMonthlyExpenses.rejected, (state) => {
          state.monthly_expenses_loading = false;
        })

        // Get Range Expenses
        .addCase(getRangeExpensesByFrequency.pending, (state) => {
          state.range_expenses_by_frequency_loading = true;
        })
        .addCase(getRangeExpensesByFrequency.fulfilled, (state, action) => {
          state.range_expenses_by_frequency_loading = false;
          state.range_expenses_by_frequency = action.payload;
        })
        .addCase(getRangeExpensesByFrequency.rejected, (state) => {
          state.range_expenses_by_frequency_loading = false;
        })

        // Get Range Expenses By Category
        .addCase(getRangeExpensesByCategory.pending, (state) => {
          state.range_expenses_by_category_loading = true;
        })
        .addCase(getRangeExpensesByCategory.fulfilled, (state, action) => {
          state.range_expenses_by_category_loading = false;
          state.range_expenses_by_category = action.payload;
        })
        .addCase(getRangeExpensesByCategory.rejected, (state) => {  
          state.range_expenses_by_category_loading = false;
        })
    },
  });
  
  export const { resetExpenses, resetExpenseById, resetUserQuery } = expenseSlice.actions;
  export default expenseSlice.reducer;
  