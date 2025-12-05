'use client'
import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/composite/layout';
import { useAppDispatch, useAppSelector } from '@/store';
import { getMonthlyExpenses, deleteExpense } from '@/store/thunks/expenseThunks';
import { getUserTimezone, getDayjsInUserTimezone } from '@/lib/dateUtils';
import Header2 from '@/components/composite/Header2/Header2';
import MonthFilter from '@/components/composite/CalendarScreen/MonthFilter';
import StatsCards from '@/components/composite/CalendarScreen/StatsCards';
import Calendar, { CalendarDay } from '@/components/composite/CalendarScreen/Calendar';
import Legend from '@/components/composite/CalendarScreen/Legend';
import CategoryStats from '@/components/composite/CalendarScreen/CategoryStats';
import CalendarScreenSkeleton from '@/components/composite/Skeleton/CalendarScreenSkeleton';
import DateExpensesDrawer from '@/components/composite/Drawer/DateExpensesDrawer';
import ViewExpense from '@/components/composite/Drawer/ViewExpense';
import CreateUpdateExpense from '@/components/composite/Drawer/CreateUpdateExpense';
import { AlertDialogComponent } from '@/components/composite/AlertDialog';
import { Expense } from '@/types/apiResponse';
import { toISOUTC } from '@/lib/dateUtils';
import dayjs, { Dayjs } from 'dayjs';

const CalendarScreen = () => {
  const dispatch = useAppDispatch();
  const { monthly_expenses, monthly_expenses_loading, delete_expense_loading } = useAppSelector((state) => state.expenses);
  const { create_update_expense_loading } = useAppSelector((state) => state.expenses);

  const [currentDate, setCurrentDate] = useState(() => getDayjsInUserTimezone());
  const [dateExpensesDrawerOpen, setDateExpensesDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [viewExpenseDrawerOpen, setViewExpenseDrawerOpen] = useState(false);
  const [editExpenseDrawerOpen, setEditExpenseDrawerOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [selectedExpenseData, setSelectedExpenseData] = useState<Expense | null>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [deleteExpenseDrawerOpen, setDeleteExpenseDrawerOpen] = useState(false);

  // Calculate month start and end dates
  const monthStart = useMemo(() => currentDate.startOf('month'), [currentDate]);
  const monthEnd = useMemo(() => currentDate.endOf('month'), [currentDate]);

  // Fetch monthly expenses when month changes
  useEffect(() => {
    dispatch(getMonthlyExpenses({
      start_date: toISOUTC(monthStart.toDate()),
      end_date: toISOUTC(monthEnd.toDate()),
      timezone: getUserTimezone()
    }));
  }, [dispatch, monthStart, monthEnd, create_update_expense_loading]);


  // Calculate calendar days
  const calendarDays = useMemo(() => {
    const days: CalendarDay[] = [];
    const firstDayOfMonth = monthStart.day(); // 0 = Sunday, 6 = Saturday
    const daysInMonth = monthStart.daysInMonth();
    const today = getDayjsInUserTimezone();
    
    // Create a map of date to expense data
    const expenseMap = new Map<string, { amount: number; count: number }>();
    
    if (monthly_expenses?.expenseData?.data) {
      monthly_expenses.expenseData.data.forEach((dayData) => {
        if (!dayData.period) return;
        
        // Parse the period date - it should be in YYYY-MM-DD format
        // Handle both string dates and ensure proper formatting
        let dateStr: string;
        if (typeof dayData.period === 'string') {
          // If it's already in YYYY-MM-DD format, use it directly
          if (/^\d{4}-\d{2}-\d{2}$/.test(dayData.period)) {
            dateStr = dayData.period;
          } else {
            // Otherwise parse it with dayjs in user timezone
            dateStr = getDayjsInUserTimezone(dayData.period).format('YYYY-MM-DD');
          }
        } else {
          dateStr = getDayjsInUserTimezone(dayData.period).format('YYYY-MM-DD');
        }
        
        // Calculate total_amount and expense_count
        // The API may provide these directly, or we calculate from expenses array
        const totalAmount = (dayData as any).total_amount ?? 
          (dayData.expenses?.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0) ?? 0);
        const expenseCount = (dayData as any).expense_count ?? 
          (dayData.expenses?.length ?? 0);
        
        // Store all data in map (we'll handle display logic separately)
        expenseMap.set(dateStr, {
          amount: totalAmount,
          count: expenseCount
        });
      });
    }

    // Generate calendar days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = monthStart.date(i);
      const dateStr = date.format('YYYY-MM-DD');
      const expenseInfo = expenseMap.get(dateStr);
      const isToday = date.isSame(today, 'day');
      
      // Get amount and count, use null if not in map or if amount is 0
      const amount = expenseInfo && expenseInfo.amount > 0 ? expenseInfo.amount : null;
      const expenseCount = expenseInfo && expenseInfo.count > 0 ? expenseInfo.count : null;
      
      // Determine color based on amount
      let color = '';
      let textColor = 'text-gray-600 dark:text-gray-400'; // Make dates without expenses more visible
      
      if (amount !== null && amount > 0) {
        if (amount < 500) {
          color = 'bg-emerald-50 dark:bg-emerald-900/30';
          textColor = 'text-emerald-600 dark:text-emerald-400';
        } else if (amount >= 500 && amount <= 1000) {
          color = 'bg-amber-50 dark:bg-amber-900/30';
          textColor = 'text-amber-600 dark:text-amber-400';
        } else {
          color = 'bg-rose-50 dark:bg-rose-900/30';
          textColor = 'text-rose-600 dark:text-rose-400';
        }
      }

      days.push({
        date: i,
        amount,
        expenses: expenseCount,
        color,
        textColor,
        isToday
      });
    }

    return { days, firstDayOfMonth };
  }, [monthStart, monthly_expenses, currentDate]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!monthly_expenses?.expenseData) {
      return {
        totalSpent: 0,
        totalExpenses: 0,
        avgPerDay: 0
      };
    }

    const { total_amount, total_expense_count, average_expense_amount } = monthly_expenses.expenseData;
    
    return {
      totalSpent: total_amount || 0,
      totalExpenses: total_expense_count || 0,
      avgPerDay: average_expense_amount || 0
    };
  }, [monthly_expenses, monthStart]);

  // Get top categories
  const topCategories = useMemo(() => {
    if (!monthly_expenses?.categoryData?.categories) {
      return [];
    }

    // Create a copy of the array before sorting (Redux state is immutable)
    const categories = [...monthly_expenses.categoryData.categories]
      .sort((a, b) => b.total_amount - a.total_amount)
      .map((cat, index) => {
        const totalAmount = monthly_expenses.categoryData.total_amount;
        const percentage = totalAmount > 0 ? Math.round((cat.total_amount / totalAmount) * 100) : 0;
        
        // Determine color based on rank
        let color = 'bg-emerald-50';
        if (index === 1) color = 'bg-rose-50';
        else if (index === 2) color = 'bg-amber-50';

        return {
          rank: index + 1,
          name: cat.category.name,
          icon: cat.category.icon || '💰',
          percentage,
          amount: cat.total_amount,
          color
        };
      });

    return categories;
  }, [monthly_expenses]);

  // Handle date change from MonthFilter
  const handleDateChange = (date: ReturnType<typeof getDayjsInUserTimezone>) => {
    setCurrentDate(date);
  };

  // Handle date click from Calendar
  const handleDateClick = (date: Dayjs) => {
    setSelectedDate(date);
    setDateExpensesDrawerOpen(true);
  };

  // Get expenses for selected date from monthly_expenses data
  const getExpensesForDate = (date: Dayjs): Expense[] => {
    if (!monthly_expenses?.expenseData?.data) return [];
    
    const dateStr = date.format('YYYY-MM-DD');
    const dayData = monthly_expenses.expenseData.data.find((dayData) => {
      if (!dayData.period) return false;
      
      let periodStr: string;
      if (typeof dayData.period === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dayData.period)) {
          periodStr = dayData.period;
        } else {
          periodStr = getDayjsInUserTimezone(dayData.period).format('YYYY-MM-DD');
        }
      } else {
        periodStr = getDayjsInUserTimezone(dayData.period).format('YYYY-MM-DD');
      }
      
      return periodStr === dateStr;
    });
    
    return dayData?.expenses || [];
  };

  // Handle expense click from DateExpensesDrawer
  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpenseId(expense._id);
    setSelectedExpenseData(expense);
    setViewExpenseDrawerOpen(true);
    setDateExpensesDrawerOpen(false);
  };

  // Handle view expense drawer close
  const handleViewExpenseClose = (open: boolean) => {
    setViewExpenseDrawerOpen(open);
    if (!open) {
      setSelectedExpenseId(null);
      setSelectedExpenseData(null);
    }
  };

  // Handle edit expense
  const handleEditExpense = (expenseId: string) => {
    const expenseData = selectedExpenseData;
    if (expenseData && expenseData._id === expenseId) {
      setExpenseToEdit(expenseData);
      setEditExpenseDrawerOpen(true);
      setViewExpenseDrawerOpen(false);
    }
  };

  // Handle edit expense drawer close
  const handleEditExpenseClose = (open: boolean) => {
    setEditExpenseDrawerOpen(open);
    if (!open) {
      setExpenseToEdit(null);
      // Refresh monthly expenses after update
      dispatch(getMonthlyExpenses({
        start_date: toISOUTC(monthStart.toDate()),
        end_date: toISOUTC(monthEnd.toDate()),
        timezone: getUserTimezone()
      }));
      // Refresh monthly expenses which will update the date expenses drawer
      dispatch(getMonthlyExpenses({
        start_date: toISOUTC(monthStart.toDate()),
        end_date: toISOUTC(monthEnd.toDate()),
        timezone: getUserTimezone()
      }));
    }
  };

  // Handle delete expense - opens the confirmation dialog
  const handleDeleteExpense = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setDeleteExpenseDrawerOpen(true);
  };

  // Handle confirm delete - actually deletes the expense
  const handleConfirmDelete = async () => {
    if (selectedExpenseId) {
      try {
        await dispatch(deleteExpense(selectedExpenseId)).unwrap();
        setViewExpenseDrawerOpen(false);
        setDeleteExpenseDrawerOpen(false);
        setSelectedExpenseId(null);
        setSelectedExpenseData(null);
        // Refresh monthly expenses after delete
        dispatch(getMonthlyExpenses({
          start_date: toISOUTC(monthStart.toDate()),
          end_date: toISOUTC(monthEnd.toDate()),
          timezone: getUserTimezone()
        }));
        // Refresh monthly expenses which will update the date expenses drawer
        dispatch(getMonthlyExpenses({
          start_date: toISOUTC(monthStart.toDate()),
          end_date: toISOUTC(monthEnd.toDate()),
          timezone: getUserTimezone()
        }));
      } catch (error) {
        console.error('Failed to delete expense:', error);
      }
    }
  };

  const handleDeleteExpenseCancel = () => {
    setSelectedExpenseId(null);
    setSelectedExpenseData(null);
    setDeleteExpenseDrawerOpen(false);
  };

  if (monthly_expenses_loading) {
    return <CalendarScreenSkeleton />;
  }

  return (
    <Layout isHeaderVisible={false}>
      <Header2 title="Calendar" description="View your monthly expenses" />
      <div className="px-4 -mt-5 pb-24">
        <MonthFilter currentDate={currentDate} onDateChange={handleDateChange} />
        
        <StatsCards 
          totalSpent={stats.totalSpent}
          totalExpenses={stats.totalExpenses}
          avgPerDay={stats.avgPerDay}
        />

        <Calendar 
          days={calendarDays.days}
          firstDayOfMonth={calendarDays.firstDayOfMonth}
          monthStart={monthStart}
          onDateClick={handleDateClick}
        />

        <Legend />

        <CategoryStats topCategories={topCategories} />
      </div>

      {/* Date Expenses Drawer */}
      <DateExpensesDrawer
        open={dateExpensesDrawerOpen}
        onOpenChange={setDateExpensesDrawerOpen}
        selectedDate={selectedDate}
        expenses={selectedDate ? getExpensesForDate(selectedDate) : []}
        onExpenseClick={handleExpenseClick}
      />

      {/* View Expense Drawer */}
      <ViewExpense
        open={viewExpenseDrawerOpen}
        onOpenChange={handleViewExpenseClose}
        expenseId={selectedExpenseId}
        expenseData={selectedExpenseData}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      {/* Edit Expense Drawer */}
      <CreateUpdateExpense
        open={editExpenseDrawerOpen}
        onOpenChange={handleEditExpenseClose}
        expense={expenseToEdit}
        expenseId={expenseToEdit?._id || null}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialogComponent
        title="Delete Expense"
        description={`Are you sure you want to delete "${selectedExpenseData?.title}"? This action cannot be undone and will remove all associated line items.`}
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
  );
};

export default CalendarScreen;