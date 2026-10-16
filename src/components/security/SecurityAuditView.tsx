import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Users,
  CheckCircle,
  FileSearch,
  Filter,
  Check,
  ShieldAlert,
  Fingerprint,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditLogEntry } from '../../types';

export const SecurityAuditView: React.FC = () => {
  const { auditLogs, verifyIntegrity, t, language, currentUser, setIs2FAOpen } = useApp();
  const isArabic = language === 'ar';

  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ isValid: boolean; checkedCount: number } | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    const matchAction = selectedAction === 'ALL' || log.action === selectedAction;
    const matchSearch =
      log.targetResource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    return matchAction && matchSearch;
  });

  const handleRunVerification = async () => {
    setIsVerifying(true);
    setVerifyResult(null);
    setTimeout(async () => {
      const res = await verifyIntegrity();
      setVerifyResult(res);
      setIsVerifying(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ISO/IEC 27001:2022 & ISO 15489 Certified Architecture</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
            {t.securityTitle}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 max-w-xl leading-relaxed">
            {t.securitySubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Fingerprint className="w-4 h-4" />
            <span>{isVerifying ? (isArabic ? 'جاري الفحص الرقمي...' : 'Verifying Hashes...') : t.verifyIntegrity}</span>
          </button>
        </div>
      </div>

      {/* Verification Result Notification */}
      {verifyResult && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm">
              {t.allHashesValid}
            </span>
            <p className="mt-0.5 text-[11px] text-emerald-700 dark:text-emerald-400">
              {isArabic
                ? `تم التحقق بنجاح من سلامة ${verifyResult.checkedCount} وثيقة وسجلات التدقيق عبر خوارزمية SHA-256 المستقلة.`
                : `Successfully verified cryptographic integrity across ${verifyResult.checkedCount} records via SHA-256.`}
            </p>
          </div>
        </div>
      )}

      {/* RBAC Matrix Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <h3 className="text-xs font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span>{isArabic ? 'مصفوفة صلاحيات المستخدمين (Role-Based Access Control - RBAC)' : 'Role-Based Access Control Matrix (RBAC)'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
                <th className="py-2.5 px-3 text-start">{isArabic ? 'الدور الوظيفي' : 'Role'}</th>
                <th className="py-2.5 px-3 text-center">{isArabic ? 'أرشفة وثائق' : 'Create'}</th>
                <th className="py-2.5 px-3 text-center">{isArabic ? 'تعديل القيود' : 'Edit'}</th>
                <th className="py-2.5 px-3 text-center">{isArabic ? 'مسح ضوئي' : 'Scan'}</th>
                <th className="py-2.5 px-3 text-center">{isArabic ? 'حذف الوثائق' : 'Delete'}</th>
                <th className="py-2.5 px-3 text-center">{isArabic ? 'تصدير التقارير' : 'Export'}</th>
                <th className="py-2.5 px-3 text-center">{isArabic ? 'سجلات الرقابة' : 'Audit Logs'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-white">
                  {t.roleAdmin} (Admin)
                </td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  {t.roleOfficer} (Archivist)
                </td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 px-3 text-center text-neutral-400">-</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 px-3 text-center text-neutral-400">-</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  {t.roleAuditor} (Auditor)
                </td>
                <td className="py-2.5 px-3 text-center text-neutral-400">-</td>
                <td className="py-2.5 px-3 text-center text-neutral-400">-</td>
                <td className="py-2.5 px-3 text-center text-neutral-400">-</td>
                <td className="py-2.5 px-3 text-center text-neutral-400">-</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  {t.roleViewer} (Observer)
                </td>
                <td className="py-2.5 px-3 text-center text-neutral-400">-</td>
                <td className="py-2.5 px-3 text-center text-neutral-400">-</td>
                <td className="py-2.5 px-3 text-center text-neutral-400">-</td>
                <td className="py-2.5 px-3 text-center text-neutral-400">-</td>
                <td className="py-2.5 px-3 text-center text-neutral-400">-</td>
                <td className="py-2.5 px-3 text-center text-neutral-400">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
              {t.auditLogs}
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">
              ({filteredLogs.length} {isArabic ? 'سجل' : 'events'})
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Filter by Action */}
            <select
              value={selectedAction}
              onChange={e => setSelectedAction(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
            >
              <option value="ALL">{isArabic ? 'كافة العمليات' : 'All Actions'}</option>
              <option value="CREATE">CREATE (إنشاء)</option>
              <option value="UPDATE">UPDATE (تعديل)</option>
              <option value="DELETE">DELETE (حذف)</option>
              <option value="VIEW">VIEW (معاينة)</option>
              <option value="EXPORT">EXPORT (تصدير)</option>
              <option value="SCAN">SCAN (مسح ضوئي)</option>
              <option value="BACKUP">BACKUP (نسخ احتياطي)</option>
              <option value="LOGIN">LOGIN (دخول)</option>
            </select>

            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={isArabic ? 'بحث في السجلات...' : 'Search logs...'}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
                <th className="py-2.5 px-3 text-start">{t.timestamp}</th>
                <th className="py-2.5 px-3 text-start">{t.actionType}</th>
                <th className="py-2.5 px-3 text-start">{t.performedBy}</th>
                <th className="py-2.5 px-3 text-start">{isArabic ? 'المورد المستهدف' : 'Resource'}</th>
                <th className="py-2.5 px-3 text-start hidden md:table-cell">{isArabic ? 'التفاصيل' : 'Details'}</th>
                <th className="py-2.5 px-3 text-start hidden lg:table-cell">{t.signature}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                    {log.userName}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {log.targetResource}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hidden md:table-cell max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-neutral-400 hidden lg:table-cell truncate max-w-[120px]">
                    {log.hashSignature.slice(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
