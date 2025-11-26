"use client"
import React, { useEffect } from 'react';
import { login } from '@/store/thunks';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { Button } from '@/components/atomic/button';
import Image from 'next/image';
import googleIcon from '@/assets/icons/google.svg';
import logo from '@/assets/icons/logo.png';
import { ChartBar, CheckCircle2, TrendingUp } from 'lucide-react';
import { FeaturesList, Feature } from '@/components/composite/login/FeaturesList';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, login_loading: loading } = useAppSelector((state) => state.auth);

  const features: Feature[] = [
    {
      icon: CheckCircle2,
      title: 'Track expenses effortlessly',
      description: 'Add and categorize spending in seconds',
    },
    {
      icon: TrendingUp,
      title: 'Smart budget management',
      description: 'Set limits and get alerts automatically',
    },
    {
      icon: ChartBar,
      title: 'Detailed insights',
      description: 'Visualize spending patterns and trends',
    },
  ];

  const handleSuccess = async (data: any) => {
    try {
      await dispatch(login(data)).unwrap();
    } catch (err: any) {
      // Handle login failure
      // When using rejectWithValue, the error is in err.payload
      // Extract message from API response: err.payload.response.data.message
      const errorMessage = err?.payload?.response?.data?.message || 
                          err?.response?.data?.message || 
                          err?.message || 
                          'Failed to sign in. Please try again.';
      toast.error(errorMessage);
    }
  }

  useEffect(() => {
    if (user && !loading) {
      router.replace('/home');
    }
  }, [user]);

  const handleLogin = useGoogleLogin({
    onSuccess: codeResponse => handleSuccess(codeResponse),
    onError: () => {
      toast.error('Google sign-in failed. Please try again.');
    },
    flow: 'auth-code',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12">
          {/* Logo and App Name */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-8">
              <Image
                src={logo}
                alt="SpendCraft Logo"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-light text-gray-900 mb-3 tracking-tight">SpendCraft</h1>
            <p className="text-sm text-gray-400 font-light">
              Smart expense tracking
            </p>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-3">Welcome</h2>
            <p className="text-sm text-gray-500 font-light">
              Sign in to manage your finances
            </p>
          </div>

          {/* Google Sign In Button */}
          <Button 
            onClick={handleLogin}
            variant="outline"
            className="w-full bg-white border border-gray-200 hover:border-purple-300 rounded-md py-6 px-6 hover:shadow-md group mb-8 cursor-pointer hover:bg-purple-50 hover:text-purple-900 transition-all duration-300"
          >
            {/* Google Logo */}
            <Image 
              src={googleIcon} 
              alt="Google" 
              width={20} 
              height={20}
              className="shrink-0"
            />
            <span className="text-sm font-light text-gray-700 group-hover:text-purple-900 transition-colors">
              Continue with Google
            </span>
          </Button>

          {/* Features */}
          <FeaturesList features={features} />
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;