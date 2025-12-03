'use client';
import { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/atomic/drawer";
import { ArrowLeft, Edit2, Trash2, Tag, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getExpenseById } from '@/store/thunks/expenseThunks';
import { resetExpenseById } from '@/store/slices/expenseSlice';
import { Spinner } from '@/components/atomic/spinner';
import { convertFromUTC, DateFormats } from '@/lib/dateUtils';
import { Expense, LineItem } from '@/types/apiResponse';
import ExpenseViewDetailRow from '@/components/composite/ExpenseViewDetailRow';
import { formatIndianCurrency } from '@/lib/currencyFormat';

interface ViewExpenseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseId?: string | null;
  expenseData?: Expense | null; // Pass expense data from list
  onEdit?: (expenseId: string) => void;
  onDelete?: (expenseId: string) => void;
}

const ViewExpense = ({ open, onOpenChange, expenseId, expenseData, onEdit, onDelete }: ViewExpenseProps) => {
  const dispatch = useAppDispatch();
  const { expense: fetchedExpense, fetch_expense_by_id_loading } = useAppSelector((state: any) => state.expenses);
  const [displayExpense, setDisplayExpense] = useState<Expense | null>(null);

  // Determine which expense data to use
  useEffect(() => {
    if (open) {
      if (expenseData) {
        // Use passed expense data from props (clicked from list)
        setDisplayExpense(expenseData);
      } else if (expenseId) {
        // Fetch from API (opened via URL)
        dispatch(getExpenseById(expenseId));
      }
    }
  }, [open, expenseId, expenseData, dispatch]);

  // Update display expense when fetched from API
  useEffect(() => {
    if (fetchedExpense && !expenseData) {
      setDisplayExpense(fetchedExpense);
    }
  }, [fetchedExpense, expenseData]);

  // Reset state when drawer closes
  useEffect(() => {
    if (!open) {
      setDisplayExpense(null);
      dispatch(resetExpenseById());
    }
  }, [open, dispatch]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleEdit = () => {
    if (displayExpense && onEdit) {
      onEdit(displayExpense._id);
    //   handleClose();
    }
  };

  const handleDelete = () => {
    if (displayExpense && onDelete) {
      onDelete(displayExpense._id);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] dark:bg-gray-800">
        <DrawerHeader>
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
              <button 
                onClick={handleClose}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2"
              >
                <ArrowLeft size={24} strokeWidth={1.5} />
              </button>

              <DrawerTitle className="text-xl font-light text-gray-900 dark:text-gray-100">View Expense</DrawerTitle>
              </div>

              <div className="flex items-center gap-2">
                {onEdit && (
                  <button 
                    onClick={handleEdit}
                    className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-500 transition-colors p-2"
                  >
                    <Edit2 size={20} strokeWidth={1.5} />
                  </button>
                )}
                {onDelete && (
                  <button 
                    onClick={handleDelete}
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={20} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>
        </DrawerHeader>
        <div className="overflow-y-auto">
          {fetch_expense_by_id_loading && !displayExpense ? (
          <div className="flex items-center justify-center py-20">
            <Spinner width={40} height={40} />
          </div>
        ) : displayExpense ? (
          <>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Icon and Amount */}
              <div className="flex flex-col items-center text-center">
                <div 
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: displayExpense.category_id?.color || '#fef3c7' }}
                >
                  <span className="text-5xl">{displayExpense.category_id?.icon || '💰'}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-light text-gray-900 dark:text-gray-100 mb-3">
                  {formatIndianCurrency(displayExpense.amount)}
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light">
                  {displayExpense.title}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-6">
                {/* Category */}
                {displayExpense.category_id && (
                  <ExpenseViewDetailRow
                    icon={Tag}
                    label="Category"
                    value={displayExpense.category_id.name}
                    secondaryValue={displayExpense.sub_category_id?.name}
                  />
                )}

                {/* Date & Time */}
                {displayExpense.datetime && (
                  <ExpenseViewDetailRow
                    icon={Calendar}
                    label="Date & Time"
                    value={convertFromUTC(displayExpense.datetime as string, DateFormats.MMMM_DD_YYYY)}
                    secondaryValue={convertFromUTC(displayExpense.datetime as string, DateFormats.HH_MM_12)}
                  />
                )}

                {/* Merchant */}
                {displayExpense.merchant && (
                  <ExpenseViewDetailRow
                    icon={DollarSign}
                    label="Merchant"
                    value={displayExpense.merchant}
                  />
                )}

                {/* Location */}
                {displayExpense.location && (
                  <ExpenseViewDetailRow
                    icon={MapPin}
                    label="Location"
                    value={displayExpense.location}
                  />
                )}

                {/* Line Items */}
                {displayExpense.line_items && displayExpense.line_items.length > 0 && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-light mb-3">Line Items</p>
                    <div className="space-y-2">
                      {displayExpense.line_items.map((item: LineItem) => (
                        <div key={item._id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-light">{item.title}</p>
                          <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{formatIndianCurrency(item.amount)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {displayExpense.notes && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-light mb-3">Notes</p>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-light">
                        {displayExpense.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 dark:text-gray-400">No expense details found</p>
          </div>
        )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewExpense;