"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atomic/button';
import { logout } from '@/store/thunks/authThunks';
import { useAppDispatch, useAppSelector } from '@/store';
import toast from 'react-hot-toast';
import Layout from '@/components/composite/layout';

const BudgetScreen = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
  return (
    <Layout>
        <div>
        <p>BudgetScreen</p>
        <p>HomeScreen</p>
        <p>BudgetScreen</p>
        <p>BudgetScreen</p>
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

export default BudgetScreen