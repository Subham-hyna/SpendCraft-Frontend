import Header2 from '@/components/composite/Header2/Header2'
import Layout from '@/components/composite/layout'
import React from 'react'

const NotificationScreen = () => {
  return (
    <Layout isHeaderVisible={false} showProfile={false}>
        <Header2 title="Notification" description="Manage your notifications" />
        <div className="px-4 -mt-7 pb-24">
            <div className="space-y-4">
                <div className="space-y-2">
                    <h2 className="text-lg font-medium">Notification</h2>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default NotificationScreen