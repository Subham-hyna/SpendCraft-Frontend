'use client'
import React from 'react'
import Header2 from '@/components/composite/Header2/Header2'
import Layout from '@/components/composite/layout'
import ExpenseSearchBar from '@/components/composite/ExpenseSearchBar'
import ExpenseSkeleton from './ExpenseSkeleton'

const ExpenseScreenSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((item) => (
        <ExpenseSkeleton key={item} />
      ))}
    </div>
  )
}

export default ExpenseScreenSkeleton




