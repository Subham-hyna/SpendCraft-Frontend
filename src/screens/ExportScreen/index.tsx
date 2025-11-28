import React from 'react'
import Layout from '@/components/composite/layout'

const ExportScreen = () => {
  return (
    <Layout pageHeading="Export" showNotificationBell={false} showProfile={false}>
      <div className="px-4 sm:px-6 py-6 space-y-6 pb-24">
        <h1 className="text-2xl font-bold">Export</h1>
      </div>
    </Layout>
  )
}

export default ExportScreen