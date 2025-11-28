import React from 'react'
import ProfileScreen from '@/screens/ProfileScreen'
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Profile | SpendCraft",
  description: "Profile page",
};

const ProfilePage = () => {
  return (
    <ProfileScreen />
  )
}

export default ProfilePage