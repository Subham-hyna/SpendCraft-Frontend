import { FileText, PieChart, DollarSign, Bell, AlertTriangle, Palette, Tag, Download, Settings } from 'lucide-react'

export const menuItems = [
    { id: 'expenses', icon: FileText, label: 'All Expenses', badge: null, path: '/expense' },
    { id: 'reports', icon: PieChart, label: 'Reports & Insights', badge: null, path: '/reports' },
    { id: 'budgets', icon: DollarSign, label: 'Budgets', badge: null, path: '/budget' },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: 3, path: '/notification' },
    { id: 'alerts', icon: AlertTriangle, label: 'Alerts & Reminders', badge: null, path: '/alert' },
    { id: 'categories', icon: Tag, label: 'Categories', badge: null, path: '/category' },
    { id: 'export', icon: Download, label: 'Export Data', badge: null, path: '/export' },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null, path: '/setting' },
  ]