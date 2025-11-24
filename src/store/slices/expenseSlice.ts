import { createSlice } from "@reduxjs/toolkit";
import { fetchExpenses, createExpense, deleteExpense } from "@/store/thunks";

interface Expense {
  id: string;
  name: string;
  amount: number;
}

interface ExpenseState {
  list: Expense[];
  loading: boolean;
}

const initialState: ExpenseState = {
  list: [],
  loading: false,
};

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Fetch Expenses
        .addCase(fetchExpenses.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchExpenses.fulfilled, (state, action) => {
          state.loading = false;
          state.list = action.payload;
        })
        .addCase(fetchExpenses.rejected, (state) => {
          state.loading = false;
        })
  
        // Create Expense
        .addCase(createExpense.fulfilled, (state, action) => {
          state.list.push(action.payload);
        })
  
        // Delete Expense
        .addCase(deleteExpense.fulfilled, (state, action) => {
          state.list = state.list.filter((exp) => exp.id !== action.payload);
        });
    },
  });
  
  export default expenseSlice.reducer;
  