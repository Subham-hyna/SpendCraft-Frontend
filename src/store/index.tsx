import { configureStore } from '@reduxjs/toolkit';
import * as slices from '@/store/slices';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

export const makeStore = () =>
  configureStore({
    reducer: {
      expenses: slices.expenseSlice,
      auth: slices.authSlice,
      categories: slices.categorySlice,
      settings: slices.settingSlice,
      alerts: slices.alertSlice,  
      budgets: slices.budgetSlice,
      notifications: slices.notificationSlice,
    }
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;