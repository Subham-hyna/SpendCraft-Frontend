"use client"
import React, { useEffect, useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store';
import Layout from '@/components/composite/layout';
import CreateUpdateExpense from '@/components/composite/Drawer/CreateUpdateExpense';
import ViewExpense from '@/components/composite/Drawer/ViewExpense';
import HeaderCard from '@/components/composite/HomeScreen/HeaderCard';
import ExpenseSection from '@/components/composite/HomeScreen/ExpenseSection';
import BudgetSection from '@/components/composite/HomeScreen/BudgetSection';
import QuickLinks from '@/components/composite/HomeScreen/QuickLinks';
import { AlertDialogComponent } from '@/components/composite/AlertDialog';
import { Expense, BudgetType } from '@/types/apiResponse';
import { getBudgets } from '@/store/thunks/budgetThunks';
import { fetchExpenses, userQuery, deleteExpense } from '@/store/thunks/expenseThunks';
import { resetUserQuery } from '@/store/slices/expenseSlice';
import { toISOUTC } from '@/lib/dateUtils';
import { getDayjsInUserTimezone } from '@/lib/dateUtils';

const HomeScreen = () => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isViewExpenseModalOpen, setIsViewExpenseModalOpen] = useState(false);
  const [editExpenseDrawerOpen, setEditExpenseDrawerOpen] = useState(false);
  const [deleteExpenseDrawerOpen, setDeleteExpenseDrawerOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const { budgets, expenseStats, fetch_budgets_loading } = useAppSelector((state) => state.budgets);
  const { expenses, create_update_expense_loading, fetch_expenses_loading, delete_expense_loading, user_query_expense } = useAppSelector((state) => state.expenses);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    const now = getDayjsInUserTimezone();
    await Promise.all([
      dispatch(getBudgets({ start_date: toISOUTC(now.startOf('month').toDate()), end_date: toISOUTC(now.endOf('month').toDate()) })),
      dispatch(fetchExpenses({ start_date: toISOUTC(now.startOf('day').toDate()), end_date: toISOUTC(now.endOf('day').toDate()) }))
    ]);
  }

  useEffect(() => {
    fetchData();
  }, [dispatch, create_update_expense_loading]);

  // Calculate this month's total spending
  const thisMonthSpending = useMemo(() => {
    return expenseStats?.total_amount || 0;
  }, [expenseStats]);

  // Get overall budget
  const overallBudget = useMemo(() => {
    return budgets?.find(budget => budget.type === BudgetType.OVERALL);
  }, [budgets]);

  // Calculate budget left
  const budgetLeft = useMemo(() => {
    if (!overallBudget) return 0;
    return Math.max(0, overallBudget.amount - thisMonthSpending);
  }, [overallBudget, thisMonthSpending]);

  // Calculate today's total expenses
  const todayTotal = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const handleOpenExpenseModal = (query: string) => {
    dispatch(userQuery(query));
  };

  useEffect(() => {
    if (user_query_expense) {
      setSelectedExpense(user_query_expense);
      setIsExpenseModalOpen(true);
      dispatch(resetUserQuery());
    }
  }, [user_query_expense]);

  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setSelectedExpenseId(expense._id);
    setIsViewExpenseModalOpen(true);
  };

  const handleViewExpenseClose = (open: boolean) => {
    setIsViewExpenseModalOpen(open);
    if (!open) {
      setSelectedExpense(null);
      setSelectedExpenseId(null);
    }
  };

  // Handle edit expense
  const handleEditExpense = (expenseId: string) => {
    // Find the expense data from expenses
    const expenseData = expenses.find(exp => exp._id === expenseId);
    if (expenseData) {
      setExpenseToEdit(expenseData);
      setEditExpenseDrawerOpen(true);
      // Close the view expense drawer when opening edit
      setIsViewExpenseModalOpen(false);
    }
  };

  // Handle edit expense drawer close
  const handleEditExpenseClose = (open: boolean) => {
    setEditExpenseDrawerOpen(open);
    if (!open) {
      setExpenseToEdit(null);
    }
  };

  // Handle delete expense - opens the confirmation dialog
  const handleDeleteExpense = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    // Find the expense data from expenses
    const expenseData = expenses.find(exp => exp._id === expenseId);
    setSelectedExpense(expenseData || null);
    setDeleteExpenseDrawerOpen(true);
  };

  // Handle confirm delete - actually deletes the expense
  const handleConfirmDelete = async () => {
    if (selectedExpenseId) {
      try {
        await dispatch(deleteExpense(selectedExpenseId)).unwrap();
        // Close the view expense drawer if it's open
        setIsViewExpenseModalOpen(false);
        setDeleteExpenseDrawerOpen(false);
        setSelectedExpenseId(null);
        setSelectedExpense(null);
        // Refresh data after delete
        fetchData();
      } catch (error) {
        console.error('Failed to delete expense:', error);
      }
    }
  };

  const handleDeleteExpenseCancel = () => {
    setSelectedExpenseId(null);
    setSelectedExpense(null);
    setDeleteExpenseDrawerOpen(false);
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 pt-4 space-y-4 pb-8">
        {/* Header Card - Stats, Voice Input, Add Expense Button */}
        <HeaderCard
          thisMonthSpending={thisMonthSpending}
          budgetLeft={budgetLeft}
          headerLoading={fetch_budgets_loading}
          onAddExpense={handleOpenExpenseModal}
        />

        {/* Today's Expenses Section */}
        <ExpenseSection
          expenses={expenses}
          todayTotal={todayTotal}
          isLoading={fetch_expenses_loading}
          onExpenseClick={handleExpenseClick}
        />

        {/* Budget Overview Section */}
        <BudgetSection
          budgets={budgets || []}
          expenseStats={expenseStats || undefined}
          isLoading={fetch_budgets_loading}
        />

        {/* Quick Actions Section */}
        <QuickLinks />
      </div>

      {/* Create Expense Modal */}
      <CreateUpdateExpense
        open={isExpenseModalOpen}
        onOpenChange={setIsExpenseModalOpen}
        expense={selectedExpense}
      />

      {/* Edit Expense Modal */}
      <CreateUpdateExpense
        open={editExpenseDrawerOpen}
        onOpenChange={handleEditExpenseClose}
        expense={expenseToEdit}
        expenseId={expenseToEdit?._id || null}
      />

      {/* View Expense Modal */}
      <ViewExpense
        open={isViewExpenseModalOpen}
        onOpenChange={handleViewExpenseClose}
        expenseId={selectedExpenseId}
        expenseData={selectedExpense}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialogComponent
        title="Delete Expense"
        description={`Are you sure you want to delete "${selectedExpense?.title}"? This action cannot be undone and will remove all associated line items.`}
        actionLabel="Delete"
        cancelLabel="Cancel"
        onAction={handleConfirmDelete}
        onCancel={handleDeleteExpenseCancel}
        loading={delete_expense_loading}
        variant="destructive"
        open={deleteExpenseDrawerOpen}
        onOpenChange={setDeleteExpenseDrawerOpen}
      />
    </Layout>
  )
}

export default HomeScreen