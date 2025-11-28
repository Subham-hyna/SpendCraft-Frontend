"use client"
import React, { useEffect, useState } from 'react'
import Layout from '@/components/composite/layout';
import SettingsGroup, { SettingItem } from '@/components/composite/SettingsGroup';
import { useTheme } from 'next-themes';
import { getSetting, updateSetting } from '@/store/thunks';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSettingsGroup } from '@/hooks/useSettingsGroup';
import {
  Bell,
  Shield,
  Lock,
  Eye,
  Smartphone,
  Mail,
  Globe,
  Moon,
  Sun,
  DollarSign,
  Calendar,
  Database,
  Trash2,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const SettingScreen = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const dispatch = useAppDispatch();
  const { setting, fetch_setting_loading } = useAppSelector((state) => state.settings);
  const { groupLoading, itemLoading, setItemLoadingState } = useSettingsGroup();

  // Local state for settings
  const [notifications, setNotifications] = useState({
    push: setting?.notification?.push ?? true,
    email: setting?.notification?.email ?? false
  });

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    dispatch(getSetting());
  }, [dispatch]);

  useEffect(() => {
    if (setting) {
      setNotifications({
        push: setting.notification?.push ?? true,
        email: setting.notification?.email ?? false
      });
    }
  }, [setting]);

  const isDark = mounted && resolvedTheme === 'dark';

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const toggleNotification = async (key: string) => {
    setItemLoadingState(key, true);
    
    try {
      const updatedNotifications = {
        ...notifications,
        [key]: !notifications[key as keyof typeof notifications],
      };
      
      setNotifications(updatedNotifications);

      const payload = {
        push_notification: updatedNotifications.push,
        email_notification: updatedNotifications.email,
      }
      
      // Update backend if needed
        await dispatch(updateSetting(payload)).unwrap();
    } catch (error) {
      // Revert on error
      setNotifications(prev => ({ ...prev, [key]: notifications[key as keyof typeof notifications] }));
      console.error('Failed to update notification setting:', error);
    } finally {
      setItemLoadingState(key, false);
    }
  };

  const handleDeleteAllData = async () => {
    toast.success('Coming soon');
  };

  const handleExportData = async () => {
    router.push('/export');
  };

  const notificationSettings: SettingItem[] = [
    {
      id: 'push',
      label: 'Push Notifications',
      description: 'Get notified about expenses',
      icon: Bell,
      toggle: true,
      color: "#F59E0B",
      state: notifications.push,
      setState: (value) => toggleNotification('push'),
      loading: itemLoading['push'] || false,
    },
    {
      id: 'email',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: Mail,
      toggle: true,
      color: "#10B981",
      state: notifications.email,
      setState: (value) => toggleNotification('email'),
      loading: itemLoading['email'] || false,
    }
  ];

  const appearanceSettings: SettingItem[] = [
    {
      id: 'darkMode',
      label: 'Dark Mode',
      description: 'Toggle dark theme',
      icon: isDark ? Moon : Sun,
      toggle: true,
      color: "#4A90E2",
      state: isDark,
      setState: handleThemeToggle,
    },
    {
      id: 'currency',
      label: 'Currency',
      description: 'Indian Rupee (₹)',
      icon: DollarSign,
      color: "#8B5CF6",
    //   onClick: () => {
    //     // Handle currency change
    //     console.log('Currency change clicked');
    //   },
    },
    {
      id: 'language',
      label: 'Language',
      description: 'English',
      icon: Globe,
    //   onClick: () => {
    //     // Handle language change
    //     console.log('Language change clicked');
    //   },
    },
  ];

//   const securitySettings: SettingItem[] = [
//     {
//       id: 'changePassword',
//       label: 'Change Password',
//       description: 'Update your password',
//       icon: Lock,
//       color: '#4A90E2',
//       onClick: () => {
//         // Handle password change
//         console.log('Change password clicked');
//       },
//     },
//     {
//       id: 'twoFactor',
//       label: 'Two-Factor Authentication',
//       description: 'Add extra security layer',
//       icon: Shield,
//       color: '#10B981',
//       onClick: () => {
//         // Handle 2FA
//         console.log('2FA clicked');
//       },
//     },
//     {
//       id: 'biometric',
//       label: 'Biometric Login',
//       description: 'Use fingerprint or Face ID',
//       icon: Eye,
//       color: '#8B5CF6',
//       toggle: true,
//       state: biometric,
//       setState: handleBiometricToggle,
//       loading: itemLoading['biometric'] || false,
//     },
//     {
//       id: 'activeSessions',
//       label: 'Active Sessions',
//       description: 'Manage logged in devices',
//       icon: Smartphone,
//       color: '#F59E0B',
//       onClick: () => {
//         // Handle active sessions
//         console.log('Active sessions clicked');
//       },
//     },
//   ];

  const dataSettings: SettingItem[] = [
    {
      id: 'exportData',
      label: 'Export Data',
      description: 'Download all your data',
      icon: Download,
      color: '#06B6D4',
      onClick: handleExportData,
      loading: itemLoading['exportData'] || false,
    },
    // {
    //   id: 'autoBackup',
    //   label: 'Auto Backup',
    //   description: 'Backup data automatically',
    //   icon: Database,
    //   color: '#10B981',
    //   toggle: true,
    //   state: autoBackup,
    //   setState: handleAutoBackupToggle,
    //   loading: itemLoading['autoBackup'] || false,
    // },
    // {
    //   id: 'syncNow',
    //   label: 'Sync Now',
    //   description: 'Sync data across devices',
    //   icon: RefreshCw,
    //   color: '#8B5CF6',
    //   onClick: handleSyncNow,
    //   loading: itemLoading['syncNow'] || false,
    // },
    // {
    //   id: 'clearCache',
    //   label: 'Clear Cache',
    //   description: 'Free up storage space',
    //   icon: Trash2,
    //   color: '#F59E0B',
    //   onClick: handleClearCache,
    //   loading: itemLoading['clearCache'] || false,
    // },
  ];

  const dangerZoneSettings: SettingItem[] = [
    {
      id: 'deleteAllData',
      label: 'Delete All Data',
      description: 'Permanently delete all expenses',
      icon: Trash2,
      color: '#EF4444',
      onClick: handleDeleteAllData,
      loading: itemLoading['deleteAllData'] || false,
    },
  ];

  return (
    <Layout pageHeading="Settings" showNotificationBell={false} showProfile={false}>
      <div className="px-4 sm:px-6 py-6 space-y-6 pb-24">
        {/* Appearance */}
        <SettingsGroup
          id="appearance"
          title="Appearance"
          items={appearanceSettings}
          loading={groupLoading['appearance'] || false}
        />

        {/* Notifications */}
        <SettingsGroup
          id="notifications"
          title="Notifications"
          items={notificationSettings}
          loading={groupLoading['notifications'] || fetch_setting_loading}
        />

        {/* Security */}
        {/* <SettingsGroup
          id="security"
          title="Security & Privacy"
          items={securitySettings}
          loading={groupLoading['security'] || false}
        /> */}

        {/* Data & Storage */}
        <SettingsGroup
          id="data"
          title="Data & Storage"
          items={dataSettings}
          loading={groupLoading['data'] || false}
        />

        {/* Danger Zone */}
        <SettingsGroup
          id="dangerZone"
          title="Danger Zone"
          titleColor="text-red-500"
          items={dangerZoneSettings}
          loading={groupLoading['dangerZone'] || false}
        />

      </div>
    </Layout>
  )
}

export default SettingScreen
