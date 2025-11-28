import React from 'react'
import AlertScreen from '@/screens/AlertScreen'
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Alerts & Reminders | SpendCraft",
    description: "Manage your notifications preferences",
};

const AlertPage = () => {
  return (
    <AlertScreen />
  )
}

export default AlertPage