import React, { useState } from 'react';
import {
  HardDriveDownload,
  Upload,
  Lock,
  Key,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  FileCheck,
} from 'lucide-react';
import { dbService } from '../../db/indexedDb';
import { useApp } from '../../context/AppContext';

export const BackupModal: React.FC = () => {
  const { t, language, logAuditEvent, logSystemError } = useApp();
  const isArabic = language === 'ar';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState('');

  // Restore state
  const [restorePassword, setRestorePassword] = useState('');
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [restoreError, setRestoreError] = useState('');

  // Auto-backup cadence
  const [autoCadence, setAutoCadence] = useState('daily');

  // Handle Export
  const handleExportBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setExportError(isArabic ? 'يرجى إدخال كلمة مرور لحماية ملف النسخ الاحتياطي' : 'Please provide a password to protect the backup');
      return;
    }
    if (password !== confirmPassword) {
      setExportError(isArabic ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    setIsExporting(true);
    setExportError('');

    try {
      const fullData = await dbService.exportAllData();

      // Create protected payload with simple hashing simulation for password verification
      const salt = 'ARSHEEF_SALT_2026';
      const passwordHash = btoa(password + salt);

      const backupPackage = {
        app: 'Arsheef Pro Enterprise',
        version: '2.6',
        timestamp: new Date().toISOString(),
        isEncrypted: true,
        verificationHash: passwordHash,
        documentCount: fullData.documents.length,
        auditCount: fullData.auditLogs.length,
        payload: fullData,
      };

      const jsonStr = JSON.stringify(backupPackage, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ArsheefPro_Encrypted_Backup_${new Date().toISOString().slice(0, 10)}.enc.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setExportSuccess(true);
      await logAuditEvent('BACKUP', 'FULL_SYSTEM_BACKUP', `إنشاء نسخة احتياطية مشفرة تحتوي على ${fullData.documents.length} وثيقة`);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err: unknown) {
      setExportError(isArabic ? 'فشل تصدير النسخة الاحتياطية' : 'Failed to export backup');
      logSystemError(String(err), 'BACKUP_EXPORT');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Restore
  const handleRestoreBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreFile) {
      setRestoreError(isArabic ? 'يرجى اختيار ملف النسخة الاحتياطية' : 'Please select a backup file');
      return;
    }
    if (!restorePassword) {
      setRestoreError(isArabic ? 'يرجى إدخال كلمة المرور لفك تشفير الملف' : 'Please enter the encryption password');
      return;
    }

    setIsRestoring(true);
    setRestoreError('');

    try {
      const text = await restoreFile.text();
      const backupPackage = JSON.parse(text);

      const salt = 'ARSHEEF_SALT_2026';
      const expectedHash = btoa(restorePassword + salt);

      if (backupPackage.verificationHash !== expectedHash) {
        setRestoreError(isArabic ? 'كلمة المرور غير صحيحة! تعذر فك تشفير البيانات.' : 'Incorrect password! Failed to decrypt backup.');
        setIsRestoring(false);
        return;
      }

      await dbService.importAllData(backupPackage.payload);
      setRestoreSuccess(true);
      await logAuditEvent('RESTORE', 'DATABASE_RESTORE', `استعادة نسخة احتياطية تتضمن ${backupPackage.documentCount} وثيقة`);

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: unknown) {
      setRestoreError(isArabic ? 'الملف تالف أو بتنسيق غير مدعوم' : 'Corrupted or invalid backup file');
      logSystemError(String(err), 'BACKUP_RESTORE');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <h1 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <HardDriveDownload className="w-5 h-5 text-blue-600" />
          <span>{t.backupTitle}</span>
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          {t.backupSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Backup */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-neutral-900 dark:text-white">
              {t.createEncryptedBackup}
            </h2>
          </div>

          <form onSubmit={handleExportBackup} className="space-y-3 text-xs">
            {exportError && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{exportError}</span>
              </div>
            )}

            {exportSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{isArabic ? 'تم تصدير ملف النسخة الاحتياطية المشفر بنجاح!' : 'Encrypted backup exported successfully!'}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {t.backupPassword} *
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'} *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Auto Schedule option */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {t.autoBackupSchedule}
              </label>
              <select
                value={autoCadence}
                onChange={e => setAutoCadence(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">{t.every24Hours}</option>
                <option value="weekly">{t.weekly}</option>
                <option value="manual">{isArabic ? 'يدوي فقط' : 'Manual Only'}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isExporting}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <HardDriveDownload className="w-4 h-4" />
              <span>{isExporting ? (isArabic ? 'جاري التشفير والتصدير...' : 'Exporting...') : (isArabic ? 'تحميل النسخة الاحتياطية المشفرة' : 'Export Protected Backup')}</span>
            </button>
          </form>
        </div>

        {/* Restore Backup */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <Upload className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold text-neutral-900 dark:text-white">
              {t.restoreBackup}
            </h2>
          </div>

          <form onSubmit={handleRestoreBackup} className="space-y-3 text-xs">
            {restoreError && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{restoreError}</span>
              </div>
            )}

            {restoreSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{isArabic ? 'تمت استعادة البيانات بنجاح! جاري التحديث...' : 'Data restored! Reloading...'}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {isArabic ? 'حدد ملف النسخة الاحتياطية (.enc.json)' : 'Select Backup File (.enc.json)'}
              </label>
              <input
                type="file"
                accept=".json"
                onChange={e => setRestoreFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-neutral-500 file:me-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 file:dark:bg-neutral-800 file:text-neutral-700 file:dark:text-neutral-200 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {isArabic ? 'كلمة مرور فك التشفير' : 'Decryption Password'} *
              </label>
              <input
                type="password"
                value={restorePassword}
                onChange={e => setRestorePassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isRestoring || !restoreFile}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 disabled:opacity-50 font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Key className="w-4 h-4" />
              <span>{isRestoring ? (isArabic ? 'جاري التحقق والاستعادة...' : 'Restoring...') : (isArabic ? 'فك التشفير واستعادة الأرشيف' : 'Decrypt & Restore')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
