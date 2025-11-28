import React from 'react'
import ExportScreen from '@/screens/ExportScreen'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Export | SpendCraft",
  description: "Export page",
};

const ExportPage = () => {
  return (
    <ExportScreen />
  )
}

export default ExportPage