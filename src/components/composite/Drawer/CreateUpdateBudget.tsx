"use client"
import { Button, buttonVariants } from '@/components/atomic/button'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/atomic/drawer'
import { cn } from '@/lib/utils'
import React, { useState, useEffect, useMemo } from 'react'
import { Budget, Category, BudgetType } from '@/types/apiResponse'
import { useAppDispatch, useAppSelector } from '@/store'
import { createBudget, updateBudget, getBudgets } from '@/store/thunks/budgetThunks'
import { getCategories } from '@/store/thunks/categoryThunks'
import { Spinner } from '@/components/atomic/spinner'
import { Input } from '@/components/atomic/input'
import { Label } from '@/components/atomic/label'
import { toast } from 'react-hot-toast'
import InputWithDropdown from '../InputWithDropdown'

interface CreateUpdateBudgetProps {
    trigger?: React.ReactNode;
    className?: string;
    budget?: Budget | null;
    onClose?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    budgets?: Budget[];
}

const CreateUpdateBudget = ({ trigger, className, budget, onClose, open: controlledOpen, onOpenChange, budgets }: CreateUpdateBudgetProps) => {
    const dispatch = useAppDispatch();
    const { create_update_budget_loading } = useAppSelector((state) => state.budgets);
    const { categories, fetch_category_loading } = useAppSelector((state) => state.categories);
    const [internalOpen, setInternalOpen] = useState(false);

    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [amountError, setAmountError] = useState<string>('');

    const isEditMode = !!budget;
    const isOverallBudget = budget?.type === BudgetType.OVERALL;

    // Get category IDs that already have budgets (only for create mode)
    const existingBudgetCategoryIds = useMemo(() => {
        if (isEditMode || !budgets) return new Set<string>();
        return new Set(
            budgets
                .filter(b => b.type === BudgetType.PARTICULAR && b.category_id?._id)
                .map(b => b.category_id!._id)
        );
    }, [budgets, isEditMode]);

    // Filter categories to exclude those that already have budgets (only for create mode)
    const availableCategories = useMemo(() => {
        if (isEditMode) return categories;
        return categories.filter(category => !existingBudgetCategoryIds.has(category._id));
    }, [categories, existingBudgetCategoryIds, isEditMode]);

    // Fetch categories when drawer opens
    useEffect(() => {
        if (open) {
            dispatch(getCategories());
        }
    }, [open, categories.length, dispatch]);

    // Initialize form when budget is provided or drawer opens
    useEffect(() => {
        if (budget && open) {
            setSelectedCategoryId(budget.category_id?._id || null);
            setAmount(budget.amount.toString());
            setAmountError('');
        } else if (!budget && open) {
            // Reset form for create mode
            setSelectedCategoryId(null);
            setAmount('');
            setAmountError('');
        }
    }, [budget, open]);

    const validateAmount = (value: string): boolean => {
        const numValue = parseFloat(value);
        if (!value.trim()) {
            setAmountError('Amount is required');
            return false;
        }
        if (isNaN(numValue) || numValue <= 0) {
            setAmountError('Amount must be a positive number');
            return false;
        }
        setAmountError('');
        return true;
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and one decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
            if (value.trim()) {
                validateAmount(value);
            } else {
                setAmountError('');
            }
        }
    };

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
    };

    const handleSubmit = async () => {
        if (!validateAmount(amount)) {
            return;
        }

        // Only require category for creating category budgets (not overall budgets)
        if (!isEditMode && !isOverallBudget && !selectedCategoryId) {
            toast.error('Please select a category');
            return;
        }

        const payload: any = {
            amount: parseFloat(amount),
        };

        // Only add category_id when creating a category budget (not overall)
        if (!isEditMode && !isOverallBudget && selectedCategoryId) {
            payload.category_id = selectedCategoryId;
        }

        // For overall budgets, add type
        if (!isEditMode && isOverallBudget) {
            payload.type = 'overall';
        }

        try {
            if (isEditMode && budget) {
                await dispatch(updateBudget({
                    id: budget._id,
                    data: payload
                })).unwrap();
            } else {
                await dispatch(createBudget(payload)).unwrap();
            }

            // Close drawer
            setOpen(false);
            if (onClose) {
                onClose();
            }
            toast.success(isEditMode ? 'Budget updated successfully' : 'Budget created successfully');
        } catch (err: any) {
            const errorMessage = err?.payload?.response?.data?.message ||
                err?.response?.data?.message ||
                err?.message ||
                'Failed to save budget. Please try again.';
            toast.error(errorMessage);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            {trigger && <DrawerTrigger className={className}>{trigger}</DrawerTrigger>}
            <DrawerContent className="dark:bg-gray-800">
                <DrawerHeader className="sr-only">
                    <DrawerTitle>{isEditMode ? 'Edit Budget' : 'Create Budget'}</DrawerTitle>
                </DrawerHeader>
                <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 overflow-hidden flex flex-col max-h-[85vh]">
                    {/* Content */}
                    <div className="p-6 space-y-8 overflow-y-auto flex-1">
                        {/* Category Selection - Only for creating category budgets */}
                        {!isEditMode && !isOverallBudget && (
                            <div>
                                <InputWithDropdown
                                    type="category"
                                    label="Category"
                                    value=""
                                    onChange={() => { }}
                                    categories={availableCategories}
                                    selectedCategoryId={selectedCategoryId}
                                    isLoading={fetch_category_loading}
                                    placeholder="Select a category"
                                    required
                                    onCategorySelect={handleCategorySelect}
                                />
                            </div>
                        )}

                        {/* Category Display - Only for editing category budgets (read-only) */}
                        {isEditMode && !isOverallBudget && budget?.category_id && (
                            <div>
                                <Label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                    Category
                                </Label>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                                        style={{ backgroundColor: budget.category_id.color }}
                                    >
                                        {budget.category_id.icon}
                                    </div>
                                    <span className="font-light text-gray-900 dark:text-gray-100">
                                        {budget.category_id.name}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Amount Input */}
                        <div>
                            <Label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                Budget Amount {!isEditMode && '*'}
                            </Label>
                            <Input
                                type="text"
                                inputMode="decimal"
                                style={{ borderRadius: '8px' }}
                                placeholder="Enter amount (e.g., 5000)"
                                value={amount}
                                onChange={handleAmountChange}
                                onBlur={() => {
                                    if (amount.trim()) {
                                        validateAmount(amount);
                                    }
                                }}
                                className={cn(
                                    "w-full px-4 py-5 bg-gray-50 dark:bg-gray-700 border rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all font-light",
                                    amountError
                                        ? "border-red-500 dark:border-red-500 focus:ring-red-500"
                                        : "border-gray-200 dark:border-gray-600 focus:ring-gray-200 dark:focus:ring-gray-600"
                                )}
                                disabled={create_update_budget_loading}
                            />
                            {amountError && (
                                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{amountError}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-3 w-full">
                            <DrawerClose
                                className={cn(buttonVariants({ variant: "outline" }), "w-full flex-1")}
                                disabled={create_update_budget_loading}
                            >
                                Cancel
                            </DrawerClose>
                            <Button
                                className="flex-1 bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSubmit}
                                disabled={create_update_budget_loading || !amount.trim() || (!isEditMode && !isOverallBudget && !selectedCategoryId) || !!amountError}
                            >
                                {create_update_budget_loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Spinner className="w-4 h-4" />
                                        {isEditMode ? 'Updating...' : 'Creating...'}
                                    </span>
                                ) : (
                                    isEditMode ? 'Update Budget' : 'Create Budget'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateUpdateBudget

