"use client"
import React from 'react'
import Layout from '@/components/composite/layout';
import { Switch } from '@/components/atomic/switch';
import { Label } from '@/components/atomic/label';
import { useTheme } from 'next-themes';

const SettingScreen = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolvedTheme to get the actual theme (handles 'system' theme)
  const isDark = mounted && resolvedTheme === 'dark';

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <Layout pageHeading="Settings" showNotificationBell={false} showProfile={false}>
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Switch 
            id="theme-toggle" 
            checked={mounted ? isDark : false}
            onCheckedChange={handleThemeToggle}
          />
          <Label htmlFor="theme-toggle">
            {mounted ? (isDark ? 'Dark Mode' : 'Light Mode') : 'Theme'}
          </Label>
        </div>
      </div>
    </Layout>
  )
}

export default SettingScreen