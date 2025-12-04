'use client'
import React, { useEffect, useState } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/atomic/drawer"
import { Trash2, X, Plus, MapPin, Locate } from 'lucide-react'
import { Textarea } from '@/components/atomic/textarea'
import { Input } from '@/components/atomic/input'
import { Label } from '@/components/atomic/label'
import { Spinner } from '@/components/atomic/spinner'
import { useAppDispatch, useAppSelector } from '@/store'
import { getCategories } from '@/store/thunks/categoryThunks'
import { createExpense, updateExpense } from '@/store/thunks/expenseThunks'
import { Category, Expense } from '@/types/apiResponse'
import { DateTimePicker24h } from '@/components/atomic/date-time'
import InputWithDropdown from '@/components/composite/InputWithDropdown'
import { formatIndianCurrency } from '@/lib/currencyFormat'
import { detectUserLocation, getGeolocationErrorMessage } from '@/lib/locationUtils'
import { getDayjsInUserTimezone, getDayjsUTC, getUserTimezone } from '@/lib/dateUtils'
import { toast } from 'react-hot-toast'
import { LineItem } from '@/types/apiResponse'

interface CreateUpdateExpenseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense | null; // Expense data to pre-fill or update
  expenseId?: string | null; // ID of expense to update (if updating existing)
}

const CreateUpdateExpense = ({ open, onOpenChange, expense, expenseId }: CreateUpdateExpenseProps) => {

  const { categories, fetch_category_loading } = useAppSelector((state: any) => state.categories);
  const { create_update_expense_loading } = useAppSelector((state: any) => state.expenses);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [dateTimeValue, setDateTimeValue] = useState<Date | undefined>(undefined);
  const [isFetchingLocation, setIsFetchingLocation] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    category?: string;
    amount?: string;
    title?: string;
    lineItems?: string;
  }>({});
  const dispatch = useAppDispatch();

  // Determine if we're in update mode
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);
  const [currentExpenseId, setCurrentExpenseId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
    dispatch(getCategories());
    }
  }, [dispatch, open]);

  // Update mode and expense ID state when props change
  useEffect(() => {
    const updateMode = Boolean(expenseId || expense?._id);
    const expenseIdValue = expenseId || expense?._id || null;
    setIsUpdateMode(updateMode);
    setCurrentExpenseId(expenseIdValue);
  }, [expenseId, expense]);

  // Pre-fill form when expense data is provided or when modal opens
  useEffect(() => {
    if (open) {
      if (expense || expenseId) {
        // Update mode: pre-fill with expense data
        if (expense) {
          setSelectedCategory(expense.category_id?._id || null);
          setSelectedSubcategory(expense.sub_category_id?._id || null);
          setAmount(expense.amount || 0);
          setTitle(expense.title || '');
          setMerchant(expense.merchant || '');
          setLocation(expense.location || '');
          setNotes(expense.notes || '');
          
          // Set line items
          if (expense.line_items && expense.line_items.length > 0) {
            setLineItems(
              expense.line_items.map((item) => ({
                _id: item._id || `temp-${Date.now()}-${Math.random()}`,
                title: item.title || '',
                amount: item.amount || 0,
              }))
            );
          } else {
            setLineItems([]);
          }

          // Set datetime
          if (expense.datetime) {
            setDateTimeValue(new Date(expense.datetime));
          } else {
            const now = getDayjsInUserTimezone().toDate();
            setDateTimeValue(now);
          }
          
          // Clear errors when pre-filling
          setErrors({});
        } else if (expenseId) {
          // If only expenseId is provided, reset the form
          // The parent component should pass the expense data
          setSelectedCategory(null);
          setSelectedSubcategory(null);
          setAmount(0);
          setTitle('');
          setMerchant('');
          setLocation('');
          setNotes('');
          setLineItems([]);
          const now = getDayjsInUserTimezone().toDate();
          setDateTimeValue(now);
          setErrors({});
        }
      } else {
        // Create mode: reset form and prefill datetime
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setAmount(0);
        setTitle('');
        setMerchant('');
        setLocation('');
        setNotes('');
        setLineItems([]);
        const now = getDayjsInUserTimezone().toDate();
        setDateTimeValue(now);
        setErrors({});
      }
    }
  }, [open, expense, expenseId]);

  const handleFetchLocation = async () => {
    setIsFetchingLocation(true);
    try {
      const detectedLocation = await detectUserLocation();
      setLocation(detectedLocation);
    } catch (error: any) {
      const errorMessage = getGeolocationErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setAmount(0);
    setTitle('');
    setMerchant('');
    setLocation('');
    setNotes('');
    setLineItems([]);
    const now = getDayjsInUserTimezone().toDate();
    setDateTimeValue(now)
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      _id: `temp-${Date.now()}-${Math.random()}`,
      title: '',
      amount: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item._id !== id));
  };

  const updateLineItem = (id: string, field: 'title' | 'amount', value: string | number) => {
    const updatedItems = lineItems.map(item => {
      if (item._id === id) {
        if (field === 'amount') {
          const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
          // Ensure amount is not negative
          const finalValue = numValue < 0 ? 0 : numValue;
          return { ...item, amount: finalValue };
        } else {
          // field === 'title', ensure it's a string
          return { ...item, title: String(value) };
        }
      }
      return item;
    });
    setLineItems(updatedItems);
    
    // Clear line items error when updating
    if (errors.lineItems) {
      setErrors(prev => ({ ...prev, lineItems: undefined }));
    }
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue < 0) {
      setErrors(prev => ({ ...prev, amount: 'Amount cannot be less than zero' }));
      return;
    }
    setAmount(numValue);
    // Clear error when valid amount is entered
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  const handleSubmit = async () => {
    // Clear previous errors
    const newErrors: { category?: string; amount?: string; title?: string; lineItems?: string } = {};

    // Validate category
    if (!selectedCategory) {
      newErrors.category = 'Please select a category';
    }

    // Validate amount
    if (!amount || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than zero';
    } else if (amount < 0) {
      newErrors.amount = 'Amount cannot be less than zero';
    }

    // Validate title
    if (!title.trim()) {
      newErrors.title = 'Please enter a title';
    }

    // Validate line items
    const validLineItems = lineItems
      .filter(item => item.title.trim())
      .map(item => ({
        ...item,
        amount: item.amount || 0, // Default to 0 if no amount
      }));

    // Check if sum of line items exceeds total amount
    const lineItemsSum = validLineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    if (lineItemsSum > amount) {
      newErrors.lineItems = `Sum of line items (${formatIndianCurrency(lineItemsSum)}) cannot exceed total amount (${formatIndianCurrency(amount)})`;
    }

    // If there are validation errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    try {
      const payload = {
        title: title.trim(),
        category_id: selectedCategory,
        sub_category_id: selectedSubcategory || undefined,
        amount: amount,
        datetime: dateTimeValue ? getDayjsUTC(dateTimeValue) : undefined,
        merchant: merchant.trim() || undefined,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
        line_items: lineItems
          .filter(item => item.title.trim())
          .map(item => ({
            title: item.title.trim(),
            amount: item.amount || 0, // Default to 0 if no amount provided
          })),
        timezone: getUserTimezone(),
      };

      if (isUpdateMode && currentExpenseId) {
        // Update existing expense
        await dispatch(updateExpense({ id: currentExpenseId, data: payload })).unwrap();
        toast.success('Expense updated successfully');
      } else {
        // Create new expense
        await dispatch(createExpense(payload)).unwrap();
        toast.success('Expense created successfully');
      }
      
      handleClose();
    } catch (err: any) {
      const errorMessage = err?.payload?.response?.data?.message || 
            err?.response?.data?.message || 
            err?.message || 
            (isUpdateMode 
              ? 'Failed to update expense. Please try again.' 
              : 'Failed to create expense. Please try again.');
      toast.error(errorMessage);
    } 
  };
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="dark:bg-gray-800">
        <DrawerHeader className="sr-only">
          <DrawerTitle>{isUpdateMode ? 'Update Expense' : 'Add Expense'}</DrawerTitle>
        </DrawerHeader>
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                        <div className="flex items-center justify-between">
              <h2 className="text-xl font-light text-gray-900 dark:text-gray-100">
                {isUpdateMode ? 'Update Expense' : 'Add Expense'}
              </h2>
                            <DrawerClose className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2">
                                <X size={24} strokeWidth={1.5} />
                            </DrawerClose>
                        </div>
          </div>

          {/* Content - Scrollable */}
                    <div className="overflow-y-auto flex-1">
          <div className="p-5 sm:p-6 space-y-6">
            {/* Amount */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount *
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-light z-10">
                  ₹
                </span>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={amount || ''}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  style={{ borderRadius: '8px' }}
                  className={`w-full pl-10 pr-4 py-5 bg-gray-50 dark:bg-gray-700 border text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-light ${
                    errors.amount 
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 font-light">
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <InputWithDropdown
                type="category"
                label="Category"
                value=""
                onChange={() => {}}
                categories={categories}
                selectedCategoryId={selectedCategory}
                isLoading={fetch_category_loading}
                required
                error={errors.category}
                onCategorySelect={(categoryId) => {
                  setSelectedCategory(categoryId)
                  setSelectedSubcategory(null) // Reset subcategory when category changes
                  // Clear error when category is selected
                  if (errors.category) {
                    setErrors(prev => ({ ...prev, category: undefined }));
                  }
                }}
              />
              {errors.category && (
                <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 font-light">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Date & Time */}
              <div>
                  <DateTimePicker24h
                    dateTime={dateTimeValue}
                    setDateTime={setDateTimeValue}
                    label="Date & Time"
                    placeholder="Select date & time"
                  />
            </div>

            {/* Line Items Section */}
            {lineItems.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Line Items ({lineItems.length})
                  </p>
                </div>
                {lineItems.map((item) => (
                  <div key={item._id} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Item name"
                      value={item.title}
                      onChange={(e) => updateLineItem(item._id, 'title', e.target.value)}
                      style={{ borderRadius: '8px' }}
                      className="flex-1 px-3 py-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-light"
                    />
                    <div className="relative w-24">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-light z-10">
                        ₹
                      </span>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      value={item.amount || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        // updateLineItem already handles negative values (sets to 0)
                        updateLineItem(item._id, 'amount', value);
                      }}
                      style={{ borderRadius: '8px' }}
                      className="w-full pl-7 pr-3 py-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-light"
                    />
                    </div>
                    <button
                      onClick={() => removeLineItem(item._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
                {errors.lineItems && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400 font-light">
                    {errors.lineItems}
                  </p>
                )}
              </div>
            )}

            {/* Add Line Items Button */}
            <button
              onClick={addLineItem}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-indigo-500 hover:border-indigo-300 transition-all flex items-center justify-center gap-2 font-light text-sm"
            >
              <Plus size={18} strokeWidth={1.5} />
              Add Line Items (Optional)
            </button>

            {/* Title */}
            <div>
              <InputWithDropdown
                type="title"
                label="Title"
                value={title}
                onChange={(value) => {
                  setTitle(value)
                  // Clear error when title is entered
                  if (errors.title) {
                    setErrors(prev => ({ ...prev, title: undefined }));
                  }
                }}
                categories={categories}
                selectedCategoryId={selectedCategory}
                placeholder="e.g., Lunch at Dominos"
                required
                error={errors.title}
                onSubcategorySelect={(subcategoryId) => {
                  setSelectedSubcategory(subcategoryId)
                }}
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 font-light">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Merchant */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Merchant
              </Label>
              <Input
                type="text"
                placeholder="e.g., Dominos"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                style={{ borderRadius: '8px' }}
                className="w-full px-4 py-5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-light"
              />
            </div>

            {/* Location */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </Label>
              <div className="relative">
                <MapPin
                  size={18}
                  strokeWidth={1.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                />
                <Input
                  type="text"
                  placeholder="Add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ borderRadius: '8px' }}
                  className="w-full pl-11 pr-20 py-5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-light"
                />
                <button
                  type="button"
                  onClick={handleFetchLocation}
                  disabled={isFetchingLocation}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isFetchingLocation ? (
                    <Spinner className="w-4 h-4 text-indigo-500" />
                  ) : (
                    <Locate size={18} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </Label>
              <Textarea
                placeholder="Add notes..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ borderRadius: '8px' }}
                className="w-full px-4 py-5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-light resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 shrink-0">
            <div className="flex gap-3">
              <button 
                onClick={handleClose}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 font-light hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
            Cancel
          </button>
              <button 
                onClick={handleSubmit}
                disabled={create_update_expense_loading}
                className="flex-1 py-3 bg-indigo-500 dark:bg-indigo-600 text-white rounded-xl font-light hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {create_update_expense_loading ? (
                  <>
                    <Spinner className="w-4 h-4 text-white" />
                    <span>{isUpdateMode ? 'Updating...' : 'Adding...'}</span>
                  </>
                ) : (
                  isUpdateMode ? 'Update Expense' : 'Add Expense'
                )}
          </button>
            </div>
        </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateUpdateExpense