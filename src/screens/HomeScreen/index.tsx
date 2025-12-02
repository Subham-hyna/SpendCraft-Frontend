"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atomic/button';
import { logout } from '@/store/thunks/authThunks';
import { useAppDispatch, useAppSelector } from '@/store';
import toast from 'react-hot-toast';
import Layout from '@/components/composite/layout';
import Link from 'next/link';
import CreateUpdateExpense from '@/components/composite/Drawer/CreateUpdateExpense';
import { Expense } from '@/types/apiResponse';

const HomeScreen = () => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Sample expense data to pre-fill the form
  const sampleExpenseData: Expense = {
    _id: '', // Not a real expense, so no ID
    title: "Grocery Shopping 5",
    category_id: {
      _id: "692a81ffec6b27db8bbfe5b3",
      name: "sfddsf",
      icon: "",
      color: "",
    } as any,
    sub_category_id: {
      _id: "507f1f77bcf86cd799439012",
      name: "",
    } as any,
    amount: 150.50,
    datetime: "2025-10-27T10:30:00Z",
    merchant: "Whole Foods Market",
    location: "123 Main St, New York, NY 10001",
    notes: "Weekly grocery shopping",
    line_items: [
      {
        _id: `temp-${Date.now()}-1`,
        amount: 50.00,
        title: "Fruits and Vegetables"
      },
      {
        _id: `temp-${Date.now()}-2`,
        amount: 75.50,
        title: "Dairy Products"
      },
      {
        _id: `temp-${Date.now()}-3`,
        amount: 0, // Default to 0 if no amount provided
        title: "Beverages"
      }
    ]
  };

  const handleOpenExpenseModal = () => {
    setIsExpenseModalOpen(true);
  };

  return (
    <Layout>
        <div className="p-6">
            <Link href="/setting/#notifications">Setting</Link>
            
            {/* Button to open expense modal with sample data */}
            <div className="mt-4">
              <Button
                onClick={handleOpenExpenseModal}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Add Sample Expense
              </Button>
            </div>

            {/* Expense Modal */}
            <CreateUpdateExpense
              open={isExpenseModalOpen}
              onOpenChange={setIsExpenseModalOpen}
              expense={sampleExpenseData}
            />

        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
        <p>HomeScreen</p>
    </div>
        
    </Layout>
  )
}

export default HomeScreen