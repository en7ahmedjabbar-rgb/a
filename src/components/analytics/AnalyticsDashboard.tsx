import React, { useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Shield,
  Printer,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsDashboard: React.FC = () => {
  const { documents, t, language, logAuditEvent } = useApp();
  const isArabic = language === 'ar';

  const total = documents.length;

  // Department counts
  const deptStats = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach(d => {
      counts[d.department] = (counts[d.department] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  }, [documents, total]);

  // Classification counts
  const classStats = useMemo(() => {
    const counts = {
      public: 0,
      internal: 0,
      confidential: 0,
      top_secret: 0,
    };
    documents.forEach(d => {
      if (counts[d.classification] !== undefined) {
        counts[d.classification]++;
      }
    });
    return counts;
  }, [documents]);

  // Status counts
  const statusStats = useMemo(() => {
    const counts = {
      active: 0,
      archived: 0,
      pending_review: 0,
      disposed: 0,
    };
    documents.forEach(d => {
      if (counts[d.status] !== undefined) {
        counts[d.status]++;
      }
    });
    return counts;
  }, [documents]);

  const handlePrintReport = () => {
    window.print();
    logAuditEvent('EXPORT', 'AUDIT_ANALYTICS_REPORT', 'طباعة تقرير التحليلات والإحصائيات الرسمي');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div>
          <h1 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>{t.analyticsTitle}</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {isArabic ? 'إحصائيات دقيقة وتوزيع الوثائق حسب الأقسام ودرجات السرية' : 'Comprehensive departmental breakdown and security distribution'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.exportReportPdf}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">{t.totalDocuments}</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1 tabular-nums">
            {total}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {isArabic ? 'سجلات مؤرشفة ومفهرسة' : 'Indexed and secured records'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">
            {isArabic ? 'وثائق نشطة جارية' : 'Active Documents'}
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {statusStats.active}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {Math.round((statusStats.active / (total || 1)) * 100)}% {isArabic ? 'من إجمالي الأرشيف' : 'of total'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">
            {isArabic ? 'وثائق سرية ومشفرة' : 'Classified & Secret'}
          </span>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            {classStats.confidential + classStats.top_secret}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {isArabic ? 'تخضع لرقابة صلاحيات مشددة' : 'Protected under high RBAC'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">{t.complianceRate}</span>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
            99.8%
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            ISO/IEC 27001 & ISO 15489
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>{isArabic ? 'توزيع الوثائق حسب الإدارة والقسم' : 'Department Distribution'}</span>
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono">
              {deptStats.length} {isArabic ? 'أقسام' : 'departments'}
            </span>
          </div>

          <div className="space-y-3">
            {deptStats.map(item => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[220px]">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {item.count}
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Classification Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>{isArabic ? 'توزيع درجات السرية والحماية' : 'Confidentiality Breakdown'}</span>
            </h3>
          </div>

          <div className="space-y-3">
            {/* Top Secret */}
            <div className="p-3 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-red-700 dark:text-red-400 block">
                  {t.classTopSecret}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {isArabic ? 'تشفير عالي + رقابة مجلس الإدارة' : 'High encryption + Board clearance'}
                </span>
              </div>
              <span className="text-base font-bold font-mono text-red-700 dark:text-red-400 tabular-nums">
                {classStats.top_secret}
              </span>
            </div>

            {/* Confidential */}
            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-amber-700 dark:text-amber-400 block">
                  {t.classConfidential}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {isArabic ? 'عقود تجارية وتقارير مالية' : 'Commercial contracts & financial audits'}
                </span>
              </div>
              <span className="text-base font-bold font-mono text-amber-700 dark:text-amber-400 tabular-nums">
                {classStats.confidential}
              </span>
            </div>

            {/* Internal */}
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-blue-700 dark:text-blue-400 block">
                  {t.classInternal}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {isArabic ? 'تعاميم وقرارات إدارية داخلية' : 'Internal directives & staff files'}
                </span>
              </div>
              <span className="text-base font-bold font-mono text-blue-700 dark:text-blue-400 tabular-nums">
                {classStats.internal}
              </span>
            </div>

            {/* Public */}
            <div className="p-3 rounded-xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-neutral-700 dark:text-neutral-300 block">
                  {t.classPublic}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {isArabic ? 'بيانات معلنة وشهادات اعتماد عامة' : 'Public accreditations & notices'}
                </span>
              </div>
              <span className="text-base font-bold font-mono text-neutral-800 dark:text-neutral-200 tabular-nums">
                {classStats.public}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
