"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atomic/button';
import { logout } from '@/store/thunks/authThunks';
import { useAppDispatch, useAppSelector } from '@/store';
import toast from 'react-hot-toast';

const HomeScreen = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { fetch_user_loading: user_fetch_loading } = useAppSelector((state) => state.auth);
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
        {user_fetch_loading ? <div>Loading...</div> : <div>
        <Button onClick={() => router.push('/budget')}>Create Budget</Button>
        <Button onClick={() => router.push('/login')}>Login</Button>
        <Button onClick={() => handleLogout()}>Logout</Button>
            </div>}
    </div>
  )
}

export default HomeScreen