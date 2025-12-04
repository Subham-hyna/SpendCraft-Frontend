"use client"
import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atomic/button';
import { logout } from '@/store/thunks/authThunks';
import { useAppDispatch, useAppSelector } from '@/store';
import toast from 'react-hot-toast';
import Layout from '@/components/composite/layout';
import { getBudgets } from '@/store/thunks/budgetThunks';
import Header2 from '@/components/composite/Header2/Header2';
import { Plus } from 'lucide-react';
import { BudgetType, BudgetStatus, Budget } from '@/types/apiResponse';
import { updateBudget } from '@/store/thunks/budgetThunks';
import CreateUpdateBudget from '@/components/composite/Drawer/CreateUpdateBudget';
import OverallBudgetCard from '@/components/composite/BudgetCard/OverallBudgetCard';
import CategoryBudgetCard from '@/components/composite/BudgetCard/CategoryBudgetCard';
import CategoryBudgetCardSkeleton from '@/components/composite/Skeleton/CategoryBudgetCardSkeleton';
import { getDayjsInUserTimezone, toISOUTC } from '@/lib/dateUtils';

const BudgetScreen = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { budgets, expenseStats, fetch_budgets_loading, create_update_budget_loading } = useAppSelector((state) => state.budgets);
    const { create_update_expense_loading} = useAppSelector((state) => state.expenses);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

    useEffect(() => {
      const now = getDayjsInUserTimezone();
      
      const startOfMonth = now.startOf('month');
      const endOfMonth = now.endOf('month');
      const payload = {
                start_date: toISOUTC(startOfMonth.toDate()),
                end_date: toISOUTC(endOfMonth.toDate())
            };
        dispatch(getBudgets(payload));
    }, [create_update_budget_loading, create_update_expense_loading]);

    // Get overall budget - memoized
    const overallBudget = useMemo(() => {
      return budgets?.find(budget => budget.type === BudgetType.OVERALL);
    }, [budgets]);
    
    // Filter category budgets (particular type) - memoized
    const categoryBudgets = useMemo(() => {
      return budgets?.filter(budget => budget.type === BudgetType.PARTICULAR) || [];
    }, [budgets]);

    // Calculate overall spent amount - memoized
    const overallSpent = useMemo(() => {
      return expenseStats?.total_amount || 0;
    }, [expenseStats]);

    // Helper function to get spent amount for a category budget
    const getCategorySpent = (categoryId: string | undefined): number => {
      if (!categoryId || !expenseStats) return 0;
      const categoryStat = expenseStats.categories.find(
        (stat) => stat.category_id === categoryId
      );
      return categoryStat?.total_amount || 0;
    };

  return (
    <Layout isHeaderVisible={false}>
      <Header2 title='Budget Management' description='Track your spending limits' />
      <div className="px-4 sm:px-6 -mt-8">
        <OverallBudgetCard
          budget={overallBudget}
          loading={fetch_budgets_loading}
          onEdit={() => {
            if (overallBudget) {
              setSelectedBudget(overallBudget);
              setDrawerOpen(true);
            }
          }}
          spent={overallSpent}
        />

      <div className="bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700 py-4 px-3 sm:p-6 shadow-sm">
        {!fetch_budgets_loading && <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-light text-gray-900 dark:text-gray-100">Category Budgets</h3>
          <button 
            onClick={() => {
              setSelectedBudget(null);
              setDrawerOpen(true);
            }}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-light hover:bg-indigo-600 transition-all flex items-center gap-1.5"
          >
            <Plus size={16} strokeWidth={1.5} />
            Add Category
          </button>
        </div>}

        <div className="space-y-4">
          {fetch_budgets_loading && categoryBudgets.length === 0 ? (
            <CategoryBudgetCardSkeleton />
          ) : categoryBudgets.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 font-light">
              <p>No category budgets found</p>
            </div>
          ) : (
            categoryBudgets.map((budget) => {
              // Calculate spent amount from expense stats
              const spent = getCategorySpent(budget.category_id?._id);
              
              return (
                <CategoryBudgetCard
                  key={budget._id}
                  budget={budget}
                  loading={fetch_budgets_loading}
                  onEdit={() => {
                    setSelectedBudget(budget);
                    setDrawerOpen(true);
                  }}
                  spent={spent}
                />
              );
            })
          )}
        </div>
      </div>
      </div>

      {/* Create/Update Budget Drawer */}
      <CreateUpdateBudget
        budget={selectedBudget}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        budgets={budgets}
        onClose={() => {
          setSelectedBudget(null);
        }}
      />
    </Layout>
  )
}

export default BudgetScreen