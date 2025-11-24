import React from 'react'
import LoginScreen from '@/screens/LoginScreen'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Login | SpendCraft",
  description: "Login to your account",
};

const LoginPage = () => {
  return (
    <LoginScreen />
  )
}

export default LoginPage