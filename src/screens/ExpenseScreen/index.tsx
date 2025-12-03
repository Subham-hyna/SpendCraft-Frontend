'use client';
import ExpenseSort from '@/components/composite/Drawer/ExpenseSort';
import ExpenseFilter from '@/components/composite/Drawer/ExpenseFilter';
import ExpenseCard from '@/components/composite/ExpenseCard';
import ExpenseSearchBar from '@/components/composite/ExpenseSearchBar';
import Header2 from '@/components/composite/Header2/Header2';
import Layout from '@/components/composite/layout';
import ViewExpense from '@/components/composite/Drawer/ViewExpense';
import CreateUpdateExpense from '@/components/composite/Drawer/CreateUpdateExpense';
import { useAppDispatch, useAppSelector } from '@/store';
import { resetExpenses } from '@/store/slices/expenseSlice';
import { fetchExpenses, deleteExpense } from '@/store/thunks/expenseThunks';
import { getCategories } from '@/store/thunks/categoryThunks';
import { Expense, FetchExpensesPayload } from '@/types/apiResponse';
import { getDayjsInUserTimezone, toISOUTC } from '@/lib/dateUtils';
import React, { useEffect, useState, useRef, useCallback } from 'react'
import ExpenseScreenSkeleton from '@/components/composite/Skeleton/ExpenseScreenSkeleton';
import { Spinner } from '@/components/atomic/spinner';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertDialogComponent } from '@/components/composite/AlertDialog';

export const ExpenseScreen = () => {
    const [sortDrawerOpen, setSortDrawerOpen] = useState<boolean>(false);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
    const [viewExpenseDrawerOpen, setViewExpenseDrawerOpen] = useState<boolean>(false);
    const [editExpenseDrawerOpen, setEditExpenseDrawerOpen] = useState<boolean>(false);
    const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
    const [selectedExpenseData, setSelectedExpenseData] = useState<Expense | null>(null);
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
    const [sort, setSort] = useState<string>('date_recent_to_old');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedDateRange, setSelectedDateRange] = useState<string[]>([]);
    const [amountMin, setAmountMin] = useState<string>('');
    const [amountMax, setAmountMax] = useState<string>('');
    const [customDateFrom, setCustomDateFrom] = useState<string>('');
    const [customDateTo, setCustomDateTo] = useState<string>('');
    const [deleteExpenseDrawerOpen, setDeleteExpenseDrawerOpen] = useState<boolean>(false);
    // Local state for expenses to avoid duplicacy
    const [localExpenses, setLocalExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    const { expenses, fetch_expenses_loading, hasMore, delete_expense_loading, create_update_expense_loading } = useAppSelector((state: any) => state.expenses);
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Intersection Observer ref
    const observerTarget = useRef<HTMLDivElement>(null);

    // Handle URL parameter for opening expense detail (fetch from API)
    useEffect(() => {
        const expenseId = searchParams.get('id');
        if (expenseId) {
            setSelectedExpenseId(expenseId);
            setSelectedExpenseData(null); // No data passed, will fetch from API
            setViewExpenseDrawerOpen(true);
        }
    }, [searchParams]);

    // Sync Redux expenses to local state and remove duplicates
    useEffect(() => {
        if (expenses && expenses.length > 0) {
            if (currentPage === 1) {
                // First page - replace expenses
                const uniqueExpenses = expenses.reduce((acc: Expense[], current: Expense) => {
                    const exists = acc.find(item => item._id === current._id);
                    if (!exists) {
                        acc.push(current);
                    }
                    return acc;
                }, []);
                setLocalExpenses(uniqueExpenses);
            } else {
                // Subsequent pages - append expenses
                setLocalExpenses(prev => {
                    const combined = [...prev, ...expenses];
                    // Remove duplicates from combined array
                    const uniqueExpenses = combined.reduce((acc: Expense[], current: Expense) => {
                        const exists = acc.find(item => item._id === current._id);
                        if (!exists) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);
                    return uniqueExpenses;
                });
            }
        } else if (currentPage === 1) {
            setLocalExpenses([]);
        }
        setIsLoading(fetch_expenses_loading && currentPage === 1);
        setIsLoadingMore(fetch_expenses_loading && currentPage > 1);
    }, [expenses, fetch_expenses_loading, currentPage]);

    // Convert date range selection to API dates
    const getDateRangeFromSelection = useCallback(() => {
        if (selectedDateRange.includes('Custom Range') && customDateFrom && customDateTo) {
            return { start_date: customDateFrom, end_date: customDateTo };
        }

        const now = getDayjsInUserTimezone();

        if (selectedDateRange.includes('Today')) {
            const startOfDay = now.startOf('day');
            const endOfDay = now.endOf('day');
            return {
                start_date: toISOUTC(startOfDay.toDate()),
                end_date: toISOUTC(endOfDay.toDate())
            };
        }

        if (selectedDateRange.includes('Yesterday')) {
            const yesterday = now.subtract(1, 'day');
            const startOfYesterday = yesterday.startOf('day');
            const endOfYesterday = yesterday.endOf('day');
            return {
                start_date: toISOUTC(startOfYesterday.toDate()),
                end_date: toISOUTC(endOfYesterday.toDate())
            };
        }

        if (selectedDateRange.includes('This Week')) {
            const startOfWeek = now.startOf('week');
            return {
                start_date: toISOUTC(startOfWeek.toDate()),
                end_date: toISOUTC(now.toDate())
            };
        }

        if (selectedDateRange.includes('This Month')) {
            const startOfMonth = now.startOf('month');
            return {
                start_date: toISOUTC(startOfMonth.toDate()),
                end_date: toISOUTC(now.toDate())
            };
        }

        if (selectedDateRange.includes('Last Month')) {
            const lastMonth = now.subtract(1, 'month');
            const startOfLastMonth = lastMonth.startOf('month');
            const endOfLastMonth = lastMonth.endOf('month');
            return {
                start_date: toISOUTC(startOfLastMonth.toDate()),
                end_date: toISOUTC(endOfLastMonth.toDate())
            };
        }

        return {};
    }, [selectedDateRange, customDateFrom, customDateTo]);

    // Fetch expenses with all filters applied
    const fetchExpensesWithFilters = useCallback((page: number = 1) => {
        const limit = 10;
        const skip = (page - 1) * limit;

        const payload: FetchExpensesPayload = {
            sort: sort,
            limit: limit,
            skip: skip,
            ...(searchQuery && { q: searchQuery }),
            ...(selectedCategories.length > 0 && { category_ids: selectedCategories.join(',') }),
            ...(amountMin && { min_amount: parseFloat(amountMin) }),
            ...(amountMax && { max_amount: parseFloat(amountMax) }),
            ...getDateRangeFromSelection(),
        };

        if (page === 1) {
            // Reset local state before fetching new data
            setLocalExpenses([]);
            setIsLoading(true);
            dispatch(resetExpenses());
        }
        
        dispatch(fetchExpenses(payload));
    }, [sort, searchQuery, selectedCategories, amountMin, amountMax, dispatch, getDateRangeFromSelection, create_update_expense_loading]);

    // Fetch expenses when filters or sort change
    useEffect(() => {
        setCurrentPage(1);
        fetchExpensesWithFilters(1);
    }, [sort, searchQuery, selectedCategories, selectedDateRange, amountMin, amountMax, customDateFrom, customDateTo, fetchExpensesWithFilters]);

    const handleFilterApply = (filters: {
        categories: string[];
        dateRange: string[];
        amountMin: string;
        amountMax: string;
        customDateFrom?: string;
        customDateTo?: string;
    }) => {
        setSelectedCategories(filters.categories);
        setSelectedDateRange(filters.dateRange);
        setAmountMin(filters.amountMin);
        setAmountMax(filters.amountMax);
        setCustomDateFrom(filters.customDateFrom || '');
        setCustomDateTo(filters.customDateTo || '');
    };

    // Load more expenses
    const loadMoreExpenses = useCallback(() => {
        if (!isLoadingMore && hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchExpensesWithFilters(nextPage);
        }
    }, [isLoadingMore, hasMore, currentPage, fetchExpensesWithFilters]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
                    loadMoreExpenses();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, isLoadingMore, isLoading, loadMoreExpenses]);

    // Handle expense card click (use data from props, no API call)
    const handleExpenseClick = (expense: Expense) => {
        setSelectedExpenseId(expense._id);
        setSelectedExpenseData(expense); // Pass the expense data
        setViewExpenseDrawerOpen(true);
    };

    // Handle drawer close
    const handleViewExpenseClose = (open: boolean) => {
        setViewExpenseDrawerOpen(open);
        if (!open) {
            setSelectedExpenseId(null);
            setSelectedExpenseData(null);
            // Remove id from URL
            router.push('/expense');
        }
    };

    // Handle edit expense
    const handleEditExpense = (expenseId: string) => {
        // Find the expense data from local expenses
        const expenseData = localExpenses.find(exp => exp._id === expenseId);
        if (expenseData) {
            setExpenseToEdit(expenseData);
            setEditExpenseDrawerOpen(true);
            // Close the view expense drawer when opening edit
            setViewExpenseDrawerOpen(false);
        }
    };

    // Handle edit expense drawer close
    const handleEditExpenseClose = (open: boolean) => {
        setEditExpenseDrawerOpen(open);
        if (!open) {
            setExpenseToEdit(null);
            // Refresh expenses list after update
            fetchExpensesWithFilters(currentPage);
        }
    };

    // Handle delete expense - opens the confirmation dialog
    const handleDeleteExpense = (expenseId: string) => {
        setSelectedExpenseId(expenseId);
        // Find the expense data from local expenses
        const expenseData = localExpenses.find(exp => exp._id === expenseId);
        setSelectedExpenseData(expenseData || null);
        setDeleteExpenseDrawerOpen(true);
    };

    // Handle confirm delete - actually deletes the expense
    const handleConfirmDelete = async () => {
        if (selectedExpenseId) {
            try {
                await dispatch(deleteExpense(selectedExpenseId)).unwrap();
                // Close the view expense drawer if it's open
                setViewExpenseDrawerOpen(false);
                setDeleteExpenseDrawerOpen(false);
                setSelectedExpenseId(null);
                setSelectedExpenseData(null);
                // Update local expenses list to remove deleted expense
                setLocalExpenses(prev => prev.filter(exp => exp._id !== selectedExpenseId));
            } catch (error) {
                console.error('Failed to delete expense:', error);
                // You can add toast notification here
            }
        }
    };

    const handleDeleteExpenseCancel = () => {
        setSelectedExpenseId(null);
        setSelectedExpenseData(null);
        setDeleteExpenseDrawerOpen(false);
    };

    return (
        <Layout isHeaderVisible={false}>
            <Header2 title="Expenses" description="Manage your expenses" />
            <div className="px-4 sm:px-6 -mt-8 space-y-4 pb-8">
                <ExpenseSearchBar
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSortClick={() => setSortDrawerOpen(true)}
                    onFilterClick={() => setFilterDrawerOpen(true)}
                    hasActiveSort={sort !== 'date_recent_to_old'}
                    hasActiveFilters={selectedCategories.length > 0 || selectedDateRange.length > 0 || !!amountMin || !!amountMax}
                />
                {/* Expenses List */}
                <div className="space-y-3">
                    {isLoading && localExpenses.length === 0 ? (
                        <ExpenseScreenSkeleton />
                    ) : localExpenses.length > 0 ? (
                        <>
                            {localExpenses.map((expense: Expense) => (
                                <ExpenseCard 
                                    key={expense?._id} 
                                    expense={expense} 
                                    onClick={() => handleExpenseClick(expense)}
                                />
                            ))}
                            
                            {/* Intersection Observer Target */}
                            {hasMore && (
                                <div ref={observerTarget} className="flex justify-center py-4">
                                    {isLoadingMore && (
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Spinner width={18} height={18} />
                                            <span className="text-sm">Loading more...</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-gray-500">
                                No expenses found
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ExpenseSort
                open={sortDrawerOpen}
                onOpenChange={setSortDrawerOpen}
                selectedSort={sort}
                onSortChange={setSort}
            />

            <ExpenseFilter
                open={filterDrawerOpen}
                onOpenChange={setFilterDrawerOpen}
                selectedCategories={selectedCategories}
                selectedDateRange={selectedDateRange}
                amountMin={amountMin}
                amountMax={amountMax}
                onFilterApply={handleFilterApply}
            />

            <ViewExpense
                open={viewExpenseDrawerOpen}
                onOpenChange={handleViewExpenseClose}
                expenseId={selectedExpenseId}
                expenseData={selectedExpenseData}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
            />

            {/* Edit Expense Modal */}
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
    )
}

export default ExpenseScreen;