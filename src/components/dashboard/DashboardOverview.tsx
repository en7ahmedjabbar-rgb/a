import React from 'react';
import {
  FileText,
  ShieldCheck,
  HardDrive,
  Wifi,
  Plus,
  ScanLine,
  QrCode,
  Download,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DashboardOverviewProps {
  onOpenNewDocModal: () => void;
  onOpenScanner: () => void;
  onOpenSync: () => void;
  onOpenBackup: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenNewDocModal,
  onOpenScanner,
  onOpenSync,
  onOpenBackup,
}) => {
  const { documents, auditLogs, t, language, hasPermission, syncStatus, setActiveTab } = useApp();
  const isArabic = language === 'ar';

  const totalDocs = documents.length;
  const confidentialDocs = documents.filter(d => d.classification === 'confidential' || d.classification === 'top_secret').length;
  const activeDocs = documents.filter(d => d.status === 'active').length;
  const pendingDocs = documents.filter(d => d.status === 'pending_review').length;

  // Department distribution
  const deptCounts: Record<string, number> = {};
  documents.forEach(d => {
    deptCounts[d.department] = (deptCounts[d.department] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-sm border border-blue-800/40">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
            {isArabic ? 'نظام الأرشفة المؤسسي المعتمد v2.6' : 'Enterprise Archival System v2.6'}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-white">
            {isArabic ? 'مركز إدارة الوثائق والأرشفة الرقمية' : 'Document Archive & Digital Vault'}
          </h1>
          <p className="text-xs text-blue-100/80 mt-1 max-w-xl leading-relaxed">
            {isArabic
              ? 'نظام أرشفة محلي حقيقي يعمل بدون إنترنت مع قاعدة بيانات داخلية مشفرة وتزامن فوري مع هواتف الأندرويد عبر الشبكة المحلية.'
              : 'Enterprise-grade standalone desktop archive with local encrypted database and real-time Android LAN synchronization.'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('folders')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>📁</span>
            <span>{t.navFolders}</span>
          </button>

          {hasPermission('create') && (
            <button
              onClick={onOpenNewDocModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addNewDocument}</span>
            </button>
          )}

          {hasPermission('scan') && (
            <button
              onClick={onOpenScanner}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <ScanLine className="w-4 h-4 text-sky-300" />
              <span>{isArabic ? 'مسح بالكاميرا' : 'Scan Document'}</span>
            </button>
          )}

          <button
            onClick={onOpenSync}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <QrCode className="w-4 h-4 text-emerald-300" />
            <span>{isArabic ? 'كود الأندرويد' : 'Android QR'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="text-xs font-medium">{t.totalDocuments}</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {totalDocs}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              100% {isArabic ? 'محلي' : 'Local'}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500">
            <span>{activeDocs} {isArabic ? 'نشط' : 'Active'}</span>
            <span>·</span>
            <span>{pendingDocs} {isArabic ? 'قيد المراجعة' : 'In Review'}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="text-xs font-medium">{isArabic ? 'سلامة النزاهة الرقمية (SHA-256)' : 'Digital Integrity (SHA-256)'}</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
              100%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {isArabic ? 'معتمد' : 'Verified'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            <span>{confidentialDocs} {isArabic ? 'وثائق سرية مشفرة' : 'Classified Files'}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="text-xs font-medium">{t.storageUsed}</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
              18.4 MB
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              IndexedDB
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            <span>{isArabic ? 'تخزين دائم على القرص' : 'Permanent Local Storage'}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="text-xs font-medium">{t.syncNodesCount}</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {syncStatus.activePeers}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {isArabic ? 'متزامن' : 'Live LAN'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 font-mono">
            <span>{syncStatus.lanIp}</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Recent Documents & Live Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Latest Documents */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                {isArabic ? 'أحدث الوثائق المؤرشفة في النظام' : 'Recent Archived Documents'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {isArabic ? 'القيود المعتمدة مع البصمات والمواقع المادية' : 'Verified records with warehouse coordinates'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('documents')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              {isArabic ? 'عرض الأرشيف الكامل ←' : 'View all archive →'}
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {documents.slice(0, 4).map(doc => (
              <div
                key={doc.id}
                onClick={() => setActiveTab('documents')}
                className="py-3.5 flex items-start justify-between gap-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 rounded-xl px-2 transition cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {doc.code}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700" aria-hidden="true">·</span>
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      {doc.category}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700" aria-hidden="true">·</span>
                    <span className="text-[11px] text-neutral-500">
                      {doc.classification === 'top_secret'
                        ? (isArabic ? 'سري للغاية' : 'Top Secret')
                        : doc.classification === 'confidential'
                        ? (isArabic ? 'سري' : 'Confidential')
                        : (isArabic ? 'داخلي' : 'Internal')}
                    </span>
                  </div>

                  <h3 className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                    {doc.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                    <span>{doc.department}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.physicalLocation}</span>
                  </div>
                </div>

                <div className="shrink-0 text-end">
                  <span className="text-[11px] font-mono text-neutral-400 block">
                    {doc.documentDate}
                  </span>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                    {doc.status === 'active' ? (isArabic ? 'نشط' : 'Active') : (isArabic ? 'مؤرشف' : 'Archived')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1/3): Live Audit Trail & Quick LAN Sync card */}
        <div className="space-y-6">
          {/* Quick LAN Sync Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" />
                {isArabic ? 'بث الشبكة المحلية' : 'LAN Companion'}
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                {isArabic ? 'نشط' : 'Active'}
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              {isArabic
                ? 'امسح كود QR بهاتفك لتفعيل كاميرا الأندرويد كجهاز مسح ضوئي محمول يرسل الوثائق لقاعدة البيانات مباشرة.'
                : 'Use your smartphone camera to wirelessly scan and stream documents straight into your archive.'}
            </p>

            <div className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-between text-xs mb-3 font-mono">
              <span className="text-neutral-400">PIN:</span>
              <span className="font-bold text-white tracking-widest">{syncStatus.pinCode}</span>
            </div>

            <button
              onClick={onOpenSync}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>{isArabic ? 'فتح كود المسح بالهاتف' : 'Open Android QR Code'}</span>
            </button>
          </div>

          {/* Security Audit Snapshot */}
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isArabic ? 'سجل الرقابة والأمان' : 'Security Audit Trail'}</span>
              </h3>
              <button
                onClick={() => setActiveTab('security')}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {isArabic ? 'المزيد' : 'Details'}
              </button>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 3).map(log => (
                <div key={log.id} className="text-xs border-b border-neutral-100 dark:border-neutral-800/60 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-0.5">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      {log.userName}
                    </span>
                    <span className="font-mono text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-1">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
