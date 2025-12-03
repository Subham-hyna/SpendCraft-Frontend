"use client"
import React from 'react'
import { useRouter } from 'next/navigation';

const SettingScreen = () => {
  const router = useRouter();
  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    router.push('/login');
  }, []);

  return (
      <div className="p-6">
      </div>
  )
}

export default SettingScreen