import React from 'react'
import CategoryScreen from '@/screens/CategoryScreen'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Category | SpendCraft",
  description: "Category page",
};

const CategoryPage = () => {
  return (
    <CategoryScreen />
  )
}

export default CategoryPage