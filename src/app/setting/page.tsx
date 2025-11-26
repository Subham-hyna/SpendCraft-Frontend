import React from 'react'
import SettingScreen from '@/screens/SettingScreen'
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Setting | SpendCraft",
  description: "Manage your settings",
};

const SettingPage = () => {
  return (
    <SettingScreen />
  )
}

export default SettingPage