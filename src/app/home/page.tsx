import React from 'react'
import HomeScreen from '@/screens/HomeScreen'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Home | SpendCraft",
  description: "Home page",
};

const HomePage = () => {
  return (
    <HomeScreen />
  )
}

export default HomePage