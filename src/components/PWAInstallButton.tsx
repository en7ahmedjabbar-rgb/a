import React, { useState } from 'react';
import { Download, Monitor, CheckCircle, Apple } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const { language } = useApp();

  const isArabic = language === 'ar';

  // If already running in standalone mode (desktop or mobile PWA)
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
        <CheckCircle className="w-3.5 h-3.5" />
        <span className="whitespace-nowrap">{isArabic ? 'نظام مكتبي منصب' : 'Installed Desktop App'}</span>
      </div>
    );
  }

  // Chromium / Android / Edge Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all whitespace-nowrap cursor-pointer"
        title={isArabic ? 'تثبيت البرنامج على الكمبيوتر كبرنامج حقيقي' : 'Install as a standalone desktop app'}
      >
        <Monitor className="w-4 h-4" />
        <span>{isArabic ? 'تنصيب البرنامج على الكمبيوتر' : 'Install Desktop App'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition whitespace-nowrap cursor-pointer"
        >
          <Apple className="w-3.5 h-3.5" />
          <span>{isArabic ? 'تثبيت على iOS' : 'Install on iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
                {isArabic ? 'تثبيت التطبيق على iPhone / iPad' : 'Install on iPhone / iPad'}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                {isArabic
                  ? '1. اضغط على زر المشاركة (Share) في شريط سفاري السفلي.\n2. مرر للأسفل واضغط على "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).'
                  : '1. Tap the Share icon in Safari toolbar.\n2. Scroll down and select "Add to Home Screen".'}
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 py-2 text-xs font-semibold hover:opacity-90 transition cursor-pointer"
              >
                {isArabic ? 'فهمت ذلك' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Standard fallback guide button for desktop browsers where install banner is ambient
  return (
    <>
      <button
        onClick={() => setShowInstallGuide(true)}
        className="flex items-center gap-1.5 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition whitespace-nowrap cursor-pointer"
        title={isArabic ? 'كيفية تنصيب وتشغيل التطبيق محلياً' : 'How to install and run locally'}
      >
        <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>{isArabic ? 'تنصيب البرنامج' : 'Install App'}</span>
      </button>

      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 text-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {isArabic ? 'تنصيب البرنامج كبرنامج مستقل على الحاسوب' : 'Install Standalone Desktop App'}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  PWA Desktop Architecture
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300 mb-5 leading-relaxed">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60">
                <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  {isArabic ? 'الطريقة 1: تثبيت مباشر من المتصفح (PWA)' : 'Method 1: Direct PWA Install'}
                </p>
                <p>
                  {isArabic
                    ? 'في شريط عنوان متصفح Chrome أو Edge اضغط على أيقونة التثبيت (🖥️ أو ⬇️) أو من القائمة اختر "تثبيت Arsheef Pro كبرنامج على سطح المكتب".'
                    : 'In Chrome or Edge address bar, click the Install icon (🖥️ or ⬇️) or choose "Install Arsheef Pro to desktop".'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60">
                <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  {isArabic ? 'الطريقة 2: العمل بدون إنترنت كلياً (Offline)' : 'Method 2: 100% Offline Capability'}
                </p>
                <p>
                  {isArabic
                    ? 'البرنامج مجهز بـ Service Worker ويخزن كافة الوثائق محلياً في قاعدة بيانات المتصفح IndexedDB مع إمكانية تصدير نسخة احتياطية محمية بكلمة مرور في أي وقت.'
                    : 'Equipped with Service Worker & IndexedDB engine to run offline without an external internet connection.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 text-xs font-semibold transition cursor-pointer"
            >
              {isArabic ? 'حسناً، فهمت' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
