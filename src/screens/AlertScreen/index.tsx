"use client"

import Header2 from '@/components/composite/Header2/Header2'
import Layout from '@/components/composite/layout'
import { useAppDispatch, useAppSelector } from '@/store'
import React, { useEffect, useState } from 'react'
import { getAlert, updateAlert } from '@/store/thunks/alertThunks'
import AlertSection from '@/components/composite/AlertSection'
import AlertScreenSkeleton from '@/components/composite/Skeleton/AlertScreenSkeleton'
import { DollarSign, Bell, BarChart3, RefreshCw, AlertCircle } from 'lucide-react'
import { formatIndianCurrency } from '@/lib/currencyFormat'

const AlertScreen = () => {
    const { alert, fetch_alert_loading, update_alert_loading } = useAppSelector((state) => state.alerts);
    const dispatch = useAppDispatch();

    // Load alert data on mount
    useEffect(() => {
        dispatch(getAlert());
    }, [dispatch]);

    // Local state for all alert settings
    const [budgetAlertsEnabled, setBudgetAlertsEnabled] = useState(alert?.budget?.enabled ?? false);
    const [alert50, setAlert50] = useState(alert?.budget?.thresholds?.find(t => t.percentage === 50)?.enabled ?? false);
    const [alert75, setAlert75] = useState(alert?.budget?.thresholds?.find(t => t.percentage === 75)?.enabled ?? false);
    const [alert90, setAlert90] = useState(alert?.budget?.thresholds?.find(t => t.percentage === 90)?.enabled ?? false);
    const [alertExceeded, setAlertExceeded] = useState(alert?.budget?.thresholds?.find(t => t.percentage === 100)?.enabled ?? false);
    const [dailyReminderEnabled, setDailyReminderEnabled] = useState(alert?.dailyReminder?.enabled ?? false);
    const [weeklyReportEnabled, setWeeklyReportEnabled] = useState(alert?.weeklyReport?.enabled ?? false);
    const [largeExpenseEnabled, setLargeExpenseEnabled] = useState(alert?.largeExpense?.enabled ?? false);
    const [thresholdAmount, setThresholdAmount] = useState(alert?.largeExpense?.thresholdAmount?.toString() ?? '');
    const [originalThresholdAmount, setOriginalThresholdAmount] = useState(alert?.largeExpense?.thresholdAmount?.toString() ?? '');

    // Sync local state with Redux store when alert data is loaded
    useEffect(() => {
        if (alert) {
            setBudgetAlertsEnabled(alert.budget?.enabled ?? false);
            setDailyReminderEnabled(alert.dailyReminder?.enabled ?? false);
            setWeeklyReportEnabled(alert.weeklyReport?.enabled ?? false);
            setLargeExpenseEnabled(alert.largeExpense?.enabled ?? false);
            const thresholdValue = alert.largeExpense?.thresholdAmount?.toString() ?? '';
            setThresholdAmount(thresholdValue);
            setOriginalThresholdAmount(thresholdValue);

            // Set budget threshold checkboxes
            if (alert.budget?.thresholds) {
                alert.budget.thresholds.forEach((threshold) => {
                    if (threshold.percentage === 50) setAlert50(threshold.enabled);
                    if (threshold.percentage === 75) setAlert75(threshold.enabled);
                    if (threshold.percentage === 90) setAlert90(threshold.enabled);
                    if (threshold.percentage === 100) setAlertExceeded(threshold.enabled);
                });
            }
        }
    }, [alert]);

    // Update alert in backend
    const handleUpdateAlert = async (updates: any) => {
        try {
            await dispatch(updateAlert(updates)).unwrap();
        } catch (error) {
            console.error('Failed to update alert:', error);
        }
    };

    // Helper function to remove _id from thresholds
    const sanitizeThresholds = (thresholds: any[]) => {
        return thresholds.map(({ _id, ...rest }) => rest);
    };

    // Handlers for budget alerts
    const handleBudgetAlertsToggle = () => {
        const newValue = !budgetAlertsEnabled;
        setBudgetAlertsEnabled(newValue);
        const thresholds = alert?.budget?.thresholds || [];
        handleUpdateAlert({
            budget: {
                enabled: newValue,
                thresholds: sanitizeThresholds(thresholds)
            }
        });
    };

    const handleThresholdToggle = (percentage: number, currentState: boolean, setState: React.Dispatch<React.SetStateAction<boolean>>) => {
        const newValue = !currentState;
        setState(newValue);
        
        const thresholds = alert?.budget?.thresholds || [];
        const existingIndex = thresholds.findIndex(t => t.percentage === percentage);
        
        let updatedThresholds;
        if (existingIndex >= 0) {
            updatedThresholds = [...thresholds];
            updatedThresholds[existingIndex] = { ...updatedThresholds[existingIndex], enabled: newValue };
        } else {
            updatedThresholds = [...thresholds, { percentage, enabled: newValue }];
        }

        handleUpdateAlert({
            budget: {
                enabled: budgetAlertsEnabled,
                thresholds: sanitizeThresholds(updatedThresholds)
            }
        });
    };

    // Handlers for other alerts
    const handleDailyReminderToggle = () => {
        const newValue = !dailyReminderEnabled;
        setDailyReminderEnabled(newValue);
        handleUpdateAlert({
            dailyReminder: { enabled: newValue }
        });
    };

    const handleWeeklyReportToggle = () => {
        const newValue = !weeklyReportEnabled;
        setWeeklyReportEnabled(newValue);
        handleUpdateAlert({
            weeklyReport: { enabled: newValue }
        });
    };

    const handleLargeExpenseToggle = () => {
        const newValue = !largeExpenseEnabled;
        setLargeExpenseEnabled(newValue);
        const currentThreshold = thresholdAmount ? parseFloat(thresholdAmount) : 0;
        handleUpdateAlert({
            largeExpense: {
                enabled: newValue,
                thresholdAmount: currentThreshold
            }
        });
        // Update original value when toggling
        if (newValue) {
            setOriginalThresholdAmount(thresholdAmount);
        }
    };

    const handleThresholdAmountChange = (value: string) => {
        setThresholdAmount(value);
    };

    const handleSaveThresholdAmount = async () => {
        await handleUpdateAlert({
            largeExpense: {
                enabled: true,
                thresholdAmount: thresholdAmount ? parseFloat(thresholdAmount) : 0
            }
        });
        setOriginalThresholdAmount(thresholdAmount);
    };

    // Check if threshold amount has changed
    const hasThresholdChanged = thresholdAmount !== originalThresholdAmount;

    // Show skeleton while loading
    if (fetch_alert_loading) {
        return <AlertScreenSkeleton />;
    }

    return (
        <Layout isHeaderVisible={false}>
            <Header2 title="Alerts & Reminders" description="Manage your notifications preferences" />
            <div className="px-4 sm:px-6 -mt-8 space-y-4 pb-8">
                {/* Budget Alerts */}
                <AlertSection
                    icon={DollarSign}
                    iconBgColor="amber"
                    iconColor="amber-600"
                    title="Budget Alerts"
                    toggleTitle="Enable Budget Alerts"
                    toggleDescription="Get notified when you reach budget thresholds"
                    enabled={budgetAlertsEnabled}
                    onToggle={handleBudgetAlertsToggle}
                    loading={update_alert_loading}
                    disabled={update_alert_loading}
                    checkboxes={budgetAlertsEnabled ? [
                        {
                            checked: alert50,
                            onToggle: () => handleThresholdToggle(50, alert50, setAlert50),
                            label: "Alert at 50% budget usage",
                            disabled: update_alert_loading,
                        },
                        {
                            checked: alert75,
                            onToggle: () => handleThresholdToggle(75, alert75, setAlert75),
                            label: "Alert at 75% budget usage",
                            disabled: update_alert_loading,
                        },
                        {
                            checked: alert90,
                            onToggle: () => handleThresholdToggle(90, alert90, setAlert90),
                            label: "Alert at 90% budget usage",
                            disabled: update_alert_loading,
                        },
                        {
                            checked: alertExceeded,
                            onToggle: () => handleThresholdToggle(100, alertExceeded, setAlertExceeded),
                            label: "Alert when budget exceeded",
                            disabled: update_alert_loading,
                        },
                    ] : undefined}
                />

                {/* Daily Reminders */}
                <AlertSection
                    icon={Bell}
                    iconBgColor="indigo"
                    iconColor="indigo-600"
                    title="Daily Reminders"
                    toggleTitle="Daily Expense Reminder"
                    toggleDescription="Remind me to log expenses at 8:00 PM"
                    enabled={dailyReminderEnabled}
                    onToggle={handleDailyReminderToggle}
                    loading={update_alert_loading}
                    disabled={update_alert_loading}
                />

                {/* Weekly Reports */}
                <AlertSection
                    icon={BarChart3}
                    iconBgColor="purple"
                    iconColor="purple-600"
                    title="Weekly Reports"
                    toggleTitle="Weekly Spending Summary"
                    toggleDescription="Get a summary every Sunday at 6:00 PM"
                    enabled={weeklyReportEnabled}
                    onToggle={handleWeeklyReportToggle}
                    loading={update_alert_loading}
                    disabled={update_alert_loading}
                />

                {/* Large Expense Alerts */}
                <AlertSection
                    icon={AlertCircle}
                    iconBgColor="red"
                    iconColor="red-600"
                    title="Large Expense Alerts"
                    toggleTitle="Alert on Large Expenses"
                    toggleDescription="Get notified for expenses above threshold"
                    enabled={largeExpenseEnabled}
                    onToggle={handleLargeExpenseToggle}
                    loading={update_alert_loading}
                    disabled={update_alert_loading}
                    inputField={largeExpenseEnabled ? {
                        label: "Threshold Amount",
                        value: thresholdAmount,
                        onChange: handleThresholdAmountChange,
                        prefix: "₹",
                        type: "number",
                        disabled: update_alert_loading,
                        showSaveButton: hasThresholdChanged,
                        onSave: handleSaveThresholdAmount,
                        saveButtonLoading: update_alert_loading,
                    } : undefined}
                />
            </div>
        </Layout>
    )
}

export default AlertScreen