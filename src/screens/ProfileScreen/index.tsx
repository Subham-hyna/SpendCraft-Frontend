'use client'
import React, { useEffect, useRef, useState } from 'react'
import Layout from '@/components/composite/layout'
import { useAppDispatch, useAppSelector } from '@/store';
import { logout, profileStats, uploadImage } from '@/store/thunks/authThunks';
import SettingsGroup, { SettingItem } from '@/components/composite/SettingsGroup';
import ContactInfo from '@/components/composite/ContactInfo';
import { Bell, Crown, Camera, Globe, HelpCircle, Moon, Palette, Settings, Shield, User, Calendar, DollarSign, LogOut, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/atomic/spinner';
import EditProfile from '@/components/composite/Drawer/EditProfile';
import { removeCookie } from '@/services/axiosInstance'
import { getDayjsInUserTimezone, toISOUTC } from '@/lib/dateUtils';
import { formatCompactCurrency } from '@/lib/currencyFormat';

const ProfileScreen = () => {
    const { profile_stats_loading, profile_stats, user, upload_image_loading, logout_loading } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [editProfileOpen, setEditProfileOpen] = useState(false);

    useEffect(() => {
        const now = getDayjsInUserTimezone();
        const startOfMonth = now.startOf('month');
        const endOfMonth = now.endOf('month');
        const payload = {
            start_date: toISOUTC(startOfMonth.toDate()),
            end_date: toISOUTC(endOfMonth.toDate())
        }
        dispatch(profileStats(payload));
    }, [])

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            router.push('/login');
        } catch (err: any) {
            console.log(err);
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            dispatch(uploadImage(formData));
        }
    };

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const accountSettings: SettingItem[] = [
        {
            id: 'edit',
            label: 'Edit Profile',
            icon: User,
            color: "#4A90E2",
            onClick: () => {
                setEditProfileOpen(true);
            },
        },
        {
            id: 'notification',
            label: 'Notifications',
            icon: Bell,
            color: "#10B981",
            onClick: () => {
                router.push('/notification');
            },
        },
        {
            id: 'alert',
            label: 'Alerts & Reminders',
            icon: AlertTriangle,
            color: "#8B5CF6",
            onClick: () => {
                router.push('/alert');
            },
        },
        // {
        //   id: 'privacy',
        //   label: 'Privacy & Security',
        //   icon: Shield,
        //   color: "#8B5CF6",
        //   onClick: () => {
        //     // Handle privacy & security
        //     console.log('Privacy & security clicked');
        //   },
        // },
    ];

    const preferencesSettings: SettingItem[] = [
        {
            id: 'appearance',
            label: 'Appearance',
            icon: Palette,
            color: '#FF6B35',
            onClick: () => {
                router.push('/setting#appearance');
            },
        },
        {
            id: 'language',
            label: 'Language',
            icon: Globe,
            color: '#F59E0B',
            onClick: () => {
                router.push('/setting#language');
            },
        },
    ];

    const supportSettings: SettingItem[] = [
        // {
        //     id: 'helpCenter',
        //     label: 'Help Center',
        //     icon: HelpCircle,
        //     color: '#06B6D4',
        //     onClick: () => {
        //         console.log('Help center clicked');
        //     },
        // },
        {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            color: '#6B7280',
            onClick: () => {
                router.push('/setting');
            },
        },
    ];

    const userStats = [
        { id: 1, label: 'Total Expenses', value: profile_stats?.total_expenses_count || 0, icon: Calendar, color: '#FF6B35', path: '/expense' },
        { id: 2, label: 'Categories', value: profile_stats?.total_categories_count || 0, icon: Palette, color: '#4A90E2', path: '/category' },
        { id: 3, label: 'This Month', value: formatCompactCurrency(profile_stats?.total_expenses_amount || 0), icon: DollarSign, color: '#10B981', path: '/expense' }
    ];

    return (
        <Layout pageHeading="Profile" showProfile={false} >
            <div className="px-4 sm:px-6 py-6 space-y-6 pb-24">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-400 rounded-2xl p-6 sm:p-8 text-white shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full flex items-center justify-center text-indigo-500 text-3xl sm:text-4xl font-light overflow-hidden">
                                {user?.photo_uri ? (
                                    <img
                                        src={user.photo_uri}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{user?.name?.charAt(0).toUpperCase() || 'S'}</span>
                                )}
                            </div>
                            <button
                                onClick={handleCameraClick}
                                disabled={upload_image_loading}
                                className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full flex items-center justify-center text-indigo-500 shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {upload_image_loading ? (
                                    <Spinner />
                                ) : (
                                    <Camera size={18} strokeWidth={1.5} />
                                )}
                            </button>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-light mb-1">{user?.name}</h2>
                    </div>
                </div>

                <ContactInfo user={user} openEditProfile={() => setEditProfileOpen(true)} />

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {profile_stats_loading ? (
                        // Skeleton loading state
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 text-center shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 mx-auto mb-2 animate-pulse" />
                                <div className="h-6 sm:h-7 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-1 w-12 animate-pulse" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-16 animate-pulse" />
                            </div>
                        ))
                    ) : (
                        userStats.map((stat) => {
                            const IconComponent = stat.icon;
                            return (
                                <div onClick={() => router.push(stat.path)} key={stat.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 text-center shadow-sm">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                                        style={{ backgroundColor: stat.color + '20' }}
                                    >
                                        <IconComponent size={18} strokeWidth={1.5} style={{ color: stat.color }} />
                                    </div>
                                    <p className="text-lg sm:text-xl font-light text-gray-900 dark:text-gray-100 mb-1">{stat.value}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-light">{stat.label}</p>
                                </div>
                            );
                        })
                    )}
                </div>

                <SettingsGroup
                    id="account"
                    title="Account Settings"
                    items={accountSettings}
                />
                <SettingsGroup
                    id="preferences"
                    title="Preferences"
                    items={preferencesSettings}
                />
                <SettingsGroup
                    id="support"
                    title="Support"
                    items={supportSettings}
                />

                <button onClick={handleLogout} className="w-full bg-white dark:bg-red-100 border border-red-200 text-red-500 rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-red-50 transition-all shadow-sm font-light">
                    {logout_loading ? (
                        <Spinner />
                    ) : (
                        <LogOut size={20} strokeWidth={1.5} />
                    )}
                    Logout
                </button>
            </div>
            <EditProfile
                open={editProfileOpen}
                onOpenChange={setEditProfileOpen}
            />
        </Layout>
    )
}

export default ProfileScreen    