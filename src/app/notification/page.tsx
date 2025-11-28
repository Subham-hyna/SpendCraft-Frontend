import React from 'react'
import NotificationScreen from '@/screens/NotificationScreen'
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Notification | SpendCraft",
  description: "Notification page",
};

const NotificationPage = () => {
  return (
    <NotificationScreen />
  )
}

export default NotificationPage