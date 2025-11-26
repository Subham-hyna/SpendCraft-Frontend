"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atomic/button';
import { logout } from '@/store/thunks/authThunks';
import { useAppDispatch } from '@/store';
import toast from 'react-hot-toast';

const HomeScreen = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (err: any) {
            console.log(err);
            toast.error(err.message);
        }
    }
  return (
    <div>
        <Button onClick={() => router.push('/budget')}>Create Budget</Button>
        <Button onClick={() => router.push('/login')}>Login</Button>
        <Button onClick={() => handleLogout()}>Logout</Button>
    </div>
  )
}

export default HomeScreen