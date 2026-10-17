import React, { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Globe,
  Bell,
  RefreshCw,
  ShieldCheck,
  Check,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    t,
    syncStatus,
    triggerSync,
    notifications,
    markNotificationRead,
    clearNotifications,
    setActiveTab,
    activeTab,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const isArabic = language === 'ar';

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return t.navDashboard;
      case 'folders':
        return t.navFolders;
      case 'documents':
        return t.navDocuments;
      case 'scanner':
        return t.navScanner;
      case 'sync':
        return t.navSyncMobile;
      case 'analytics':
        return t.navAnalytics;
      case 'security':
        return t.navAuditSecurity;
      case 'support':
        return t.navSupport;
      case 'api':
        return t.navApiDocs;
      case 'diagnostics':
        return t.navDiagnostics;
      case 'backup':
        return t.navBackup;
      default:
        return t.navDashboard;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Zone 1: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 hidden sm:inline">
            {t.appName}
          </span>
          <span className="hidden sm:inline" aria-hidden="true">/</span>
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Zone 2: Sync and LAN quick status */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={() => setActiveTab('sync')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/80 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 transition cursor-pointer"
          title={t.syncModalTitle}
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="font-mono text-[11px]">{syncStatus.lanIp}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </button>

        <button
          onClick={triggerSync}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          title={t.syncNow}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Zone 3: Actions, PWA Button, Theme, Language, Notifications */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            className="relative p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-neutral-900" />
            )}
          </button>

          {isNotifOpen && (
            <div
              className={`absolute top-12 z-50 w-80 max-w-[90vw] rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 p-4 ${
                isArabic ? 'left-0 sm:right-auto' : 'right-0 sm:left-auto'
              }`}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  {isArabic ? 'مركز الإشعارات والتنبيهات' : 'Notifications Center'}
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-[10px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {isArabic ? 'مسح الكل' : 'Clear all'}
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-center py-6 text-neutral-400">
                    {isArabic ? 'لا توجد إشعارات جديدة' : 'No new notifications'}
                  </p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl text-xs transition cursor-pointer border ${
                        n.isRead
                          ? 'bg-neutral-50 dark:bg-neutral-800/40 border-transparent text-neutral-500 dark:text-neutral-400'
                          : 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {n.title}
                        </span>
                        <span className="text-[9px] text-neutral-400 font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          aria-label="Toggle theme"
          title={theme === 'dark' ? (isArabic ? 'التحويل للوضع النهاري' : 'Switch to Light Mode') : (isArabic ? 'التحويل للوضع الليلي' : 'Switch to Dark Mode')}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition cursor-pointer"
          title={isArabic ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
        >
          <Globe className="w-3.5 h-3.5 text-neutral-500" />
          <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>
      </div>
    </header>
  );
};
