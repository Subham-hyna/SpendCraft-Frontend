import React from 'react'
import BudgetScreen from '@/screens/BudgetScreen'
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Budget | SpendCraft",
  description: "Create and manage your budget",
};

const BudgetPage = () => {
  return (
    <BudgetScreen />
  )
}

export default BudgetPage