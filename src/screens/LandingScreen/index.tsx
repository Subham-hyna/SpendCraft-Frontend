"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Sparkles, 
  DollarSign, 
  PieChart, 
  Bell, 
  AlertTriangle, 
  Tag, 
  Calendar, 
  Download,
  TrendingUp,
  BarChart3,
  Mic,
  Shield
} from 'lucide-react';
import { Button } from '@/components/atomic/button';
import { BackgroundPaths } from '@/components/atomic/background-paths';
import LandingNavbar from '@/components/composite/LandingNavbar';
import logo from '@/assets/icons/logo.png';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

const LandingScreen = () => {
  const router = useRouter();

  const mainFeatures: Feature[] = [
    {
      icon: Sparkles,
      title: 'AI-Powered Expense Tracking',
      description: 'Add expenses naturally with voice or text. Our AI understands what you spent and categorizes it automatically.',
      gradient: 'from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500'
    },
    {
      icon: DollarSign,
      title: 'Smart Budget Management',
      description: 'Set budgets for categories or overall spending. Get real-time alerts when you\'re approaching limits.',
      gradient: 'from-purple-500 to-purple-400 dark:from-purple-600 dark:to-purple-500'
    },
    {
      icon: PieChart,
      title: 'Detailed Reports & Insights',
      description: 'Visualize your spending patterns with interactive charts. Understand where your money goes.',
      gradient: 'from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500'
    },
    {
      icon: Tag,
      title: 'Custom Categories',
      description: 'Organize expenses with categories and subcategories. Create a system that works for you.',
      gradient: 'from-green-500 to-green-400 dark:from-green-600 dark:to-green-500'
    },
    {
      icon: AlertTriangle,
      title: 'Alerts & Reminders',
      description: 'Never miss a budget limit. Get notified when you\'re close to exceeding your spending goals.',
      gradient: 'from-orange-500 to-orange-400 dark:from-orange-600 dark:to-orange-500'
    },
    {
      icon: Calendar,
      title: 'Calendar View',
      description: 'See your expenses in a calendar format. Track spending patterns over time at a glance.',
      gradient: 'from-pink-500 to-pink-400 dark:from-pink-600 dark:to-pink-500'
    },
  ];

  const additionalFeatures = [
    { icon: Bell, text: 'Smart Notifications' },
    { icon: Download, text: 'Export Data' },
    { icon: Mic, text: 'Voice Input' },
    { icon: Shield, text: 'Secure & Private' },
  ];

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Navbar */}
      <LandingNavbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        {/* Background Paths - Only in Hero Section */}
        <BackgroundPaths />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Image
                  src={logo}
                  alt="SpendCraft Logo"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
            </div>

            {/* App Name & Tagline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-indigo-600 mb-4 tracking-tight">
              SpendCraft
            </h1>
            <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 font-light mb-8 max-w-2xl mx-auto">
              Smart expense tracking that helps you take control of your finances
            </p>

            {/* CTA Button */}
            <Button
              onClick={handleGetStarted}
              className="bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-700 rounded-2xl px-8 py-6 text-lg font-light shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Gradient Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-20"></div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">
            Everything you need to manage expenses
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-light max-w-2xl mx-auto">
            Powerful features designed to make expense tracking effortless and insightful
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={24} strokeWidth={1.5} className="text-white" />
                </div>
                <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-3">
                <TrendingUp size={32} strokeWidth={1.5} className="text-white/80" />
              </div>
              <h3 className="text-3xl font-light text-white mb-2">Track Everything</h3>
              <p className="text-sm text-indigo-100 font-light">
                Every expense, every category, every detail
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-3">
                <BarChart3 size={32} strokeWidth={1.5} className="text-white/80" />
              </div>
              <h3 className="text-3xl font-light text-white mb-2">Visual Insights</h3>
              <p className="text-sm text-indigo-100 font-light">
                Charts and reports to understand your spending
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-3">
                <DollarSign size={32} strokeWidth={1.5} className="text-white/80" />
              </div>
              <h3 className="text-3xl font-light text-white mb-2">Stay on Budget</h3>
              <p className="text-sm text-indigo-100 font-light">
                Smart alerts keep you in control
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-light mb-8 max-w-xl mx-auto">
            Join SpendCraft today and start tracking your expenses the smart way
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-700 rounded-2xl px-8 py-6 text-lg font-light shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;

