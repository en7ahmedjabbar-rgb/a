import React from 'react';
import {
  LayoutDashboard,
  Folder,
  FolderArchive,
  Users,
  ScanLine,
  Smartphone,
  HardDriveDownload,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeTab, setActiveTab, t, language, currentUser, logout } = useApp();
  const isArabic = language === 'ar';

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'folders', label: t.navFolders, icon: Folder },
    { id: 'documents', label: t.navDocuments, icon: FolderArchive },
    { id: 'users', label: t.navUsers, icon: Users },
    { id: 'scanner', label: t.navScanner, icon: ScanLine },
    { id: 'sync', label: t.navSyncMobile, icon: Smartphone },
    { id: 'backup', label: t.navBackup, icon: HardDriveDownload },
  ];

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return isArabic ? 'مدير عام' : 'Admin';
      case 'officer':
        return isArabic ? 'مسؤول أرشفة' : 'Officer';
      case 'auditor':
        return isArabic ? 'مدقق نظام' : 'Auditor';
      default:
        return isArabic ? 'مطلع' : 'Viewer';
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 z-40 w-64 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-e border-neutral-200 dark:border-neutral-800 transition-transform duration-200 flex flex-col justify-between ${
          isArabic ? 'right-0' : 'left-0'
        } ${
          isMobileOpen
            ? 'translate-x-0'
            : isArabic
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top App Branding */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-neutral-200/80 dark:border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-sm font-bold text-base tracking-tighter">
                AR
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {t.appName}
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate max-w-[140px]">
                  {t.desktopApp}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-start ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Authenticated User Account Profile & Logout */}
        <div className="p-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/70">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/60 shadow-xs mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 truncate">
                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold font-mono">
                    {getRoleLabel(currentUser.role)}
                  </span>
                  <span>·</span>
                  <span className="truncate max-w-[90px]">{currentUser.department}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real Logout Button */}
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-red-300 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
