import { configureStore } from '@reduxjs/toolkit';
import { expenseSlice, authSlice } from '@/store/slices';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

export const makeStore = () =>
  configureStore({
    reducer: {
      expenses: expenseSlice,
      auth: authSlice,
    }
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;