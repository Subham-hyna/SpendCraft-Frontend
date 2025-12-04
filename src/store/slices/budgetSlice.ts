import { createSlice } from "@reduxjs/toolkit";
import { Budget, ExpenseStats } from "@/types/apiResponse";
import { getAlert, updateAlert } from "../thunks/alertThunks";
import { createBudget, getBudgets, updateBudget } from "../thunks/budgetThunks";

interface BudgetState {
  budgets: Budget[];
  expenseStats: ExpenseStats | null;
  fetch_budgets_loading: boolean;
  create_update_budget_loading: boolean;
}

const initialState: BudgetState = {
  budgets: [],
  expenseStats: null,
  fetch_budgets_loading: false,
  create_update_budget_loading: false,
};

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Fetch Expenses
        .addCase(getBudgets.pending, (state) => {
          state.fetch_budgets_loading = true;
        })
        .addCase(getBudgets.fulfilled, (state, action) => {
          state.fetch_budgets_loading = false;
          state.budgets = action.payload.budgets;
          state.expenseStats = action.payload.expenseStats;
        })
        .addCase(getBudgets.rejected, (state) => {
          state.fetch_budgets_loading = false;
        })
        // Update Setting
        .addCase(createBudget.pending, (state) => {
          state.create_update_budget_loading = true;
        })
        .addCase(createBudget.fulfilled, (state, action) => {
          state.create_update_budget_loading = false;
        })
        .addCase(createBudget.rejected, (state) => {
          state.create_update_budget_loading = false;
        })
        // Update Budget
        .addCase(updateBudget.pending, (state) => {
          state.create_update_budget_loading = true;
        })
        .addCase(updateBudget.fulfilled, (state, action) => {
          state.create_update_budget_loading = false;
        })
        .addCase(updateBudget.rejected, (state) => {
          state.create_update_budget_loading = false;
        })
    },
  });
  
  export default budgetSlice.reducer;    
  