import React from 'react'
import ExpenseScreen from '@/screens/ExpenseScreen'
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Expense | SpendCraft",
  description: "Expense page",
};

const ExpensePage = () => {
  return (
    <ExpenseScreen />
  )
}

export default ExpensePage