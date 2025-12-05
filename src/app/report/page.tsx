import React from 'react'
import ReportScreen from '@/screens/ReportScreen'
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Report | SpendCraft",
  description: "Report page",
};

const ReportPage = () => {
  return (
    <ReportScreen />
  )
}

export default ReportPage