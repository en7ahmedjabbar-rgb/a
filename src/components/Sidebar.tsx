import React from 'react';
import {
  LayoutDashboard,
  FolderArchive,
  ScanLine,
  Smartphone,
  BarChart3,
  ShieldCheck,
  LifeBuoy,
  Code2,
  Activity,
  HardDriveDownload,
  Users,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeTab, setActiveTab, t, language, currentUser, setCurrentUser, users } = useApp();
  const isArabic = language === 'ar';

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'documents', label: t.navDocuments, icon: FolderArchive },
    { id: 'scanner', label: t.navScanner, icon: ScanLine },
    { id: 'sync', label: t.navSyncMobile, icon: Smartphone },
    { id: 'analytics', label: t.navAnalytics, icon: BarChart3 },
    { id: 'security', label: t.navAuditSecurity, icon: ShieldCheck },
    { id: 'support', label: t.navSupport, icon: LifeBuoy },
    { id: 'api', label: t.navApiDocs, icon: Code2 },
    { id: 'diagnostics', label: t.navDiagnostics, icon: Activity },
    { id: 'backup', label: t.navBackup, icon: HardDriveDownload },
  ];

  const handleRoleChange = (role: UserRole) => {
    const matched = users.find(u => u.role === role) || users[0];
    setCurrentUser(matched);
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
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
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

        {/* User Role Switcher (RBAC) */}
        <div className="p-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{t.switchRole}</span>
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {currentUser.role}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 mb-2.5">
            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-2 py-1.5 text-[10px] font-medium rounded-lg transition-colors cursor-pointer truncate ${
                currentUser.role === 'admin'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {isArabic ? 'مدير' : 'Admin'}
            </button>
            <button
              onClick={() => handleRoleChange('officer')}
              className={`px-2 py-1.5 text-[10px] font-medium rounded-lg transition-colors cursor-pointer truncate ${
                currentUser.role === 'officer'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {isArabic ? 'مسؤول أرشفة' : 'Officer'}
            </button>
            <button
              onClick={() => handleRoleChange('auditor')}
              className={`px-2 py-1.5 text-[10px] font-medium rounded-lg transition-colors cursor-pointer truncate ${
                currentUser.role === 'auditor'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {isArabic ? 'مدقق' : 'Auditor'}
            </button>
            <button
              onClick={() => handleRoleChange('viewer')}
              className={`px-2 py-1.5 text-[10px] font-medium rounded-lg transition-colors cursor-pointer truncate ${
                currentUser.role === 'viewer'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {isArabic ? 'مطلع' : 'Viewer'}
            </button>
          </div>

          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                {currentUser.department}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
