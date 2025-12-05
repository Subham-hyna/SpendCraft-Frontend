import React from 'react'
import { Metadata } from 'next';
import LandingScreen from '@/screens/LandingScreen';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "SpendCraft",
  description: "Your personal finance assistant",
};

const LandingPage = () => {
  return (
    <LandingScreen />
  )
}

export default LandingPage  