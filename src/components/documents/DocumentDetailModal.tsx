import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  ShieldCheck,
  MapPin,
  Calendar,
  Tag,
  Clock,
  FileText,
  Copy,
  Check,
  Download,
  AlertCircle,
  Hash,
  Trash2,
  Folder,
} from 'lucide-react';
import { ArchiveDocument } from '../../types';
import { useApp } from '../../context/AppContext';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';

interface DocumentDetailModalProps {
  document: ArchiveDocument | null;
  onClose: () => void;
  onEdit: (doc: ArchiveDocument) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  onClose,
  onEdit,
}) => {
  const { deleteDocument, t, language, hasPermission, logAuditEvent } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isArabic = language === 'ar';

  useEffect(() => {
    if (!document) return;

    // Generate dynamic QR code payload with document code, title, and SHA-256 hash
    const qrPayload = JSON.stringify({
      code: document.code,
      title: document.title,
      hash: document.hash,
      date: document.documentDate,
      loc: document.physicalLocation,
    });

    QRCode.toDataURL(qrPayload, {
      margin: 1,
      width: 140,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).then(setQrDataUrl);

    logAuditEvent('VIEW', document.code, `معاينة بطاقة الوثيقة الرسمية: ${document.title}`);
  }, [document, logAuditEvent]);

  if (!document) return null;

  const handlePrint = () => {
    window.print();
    logAuditEvent('EXPORT', document.code, `طباعة بطاقة الأرشفة الرسمية للوثيقة: ${document.code}`);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(document.hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 overflow-hidden">
        {/* Header toolbar */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
              {document.code}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              {document.classification.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printCard}</span>
            </button>

            {hasPermission('edit') && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(document);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                {t.edit}
              </button>
            )}

            {hasPermission('delete') && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                title={t.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Document Card Body (Printable & Viewable) */}
        <div className="p-6 space-y-6">
          {/* Printable Header */}
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1">
                {isArabic ? 'بطاقة قيد وأرشفة وثيقة رسمية معتمدة' : 'Official Document Archive Record'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                {document.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mt-2">
                {document.folderName && (
                  <>
                    <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                      <Folder className="w-3 h-3 text-amber-500" />
                      <span>{document.folderName}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span>{document.department}</span>
                <span aria-hidden="true">·</span>
                <span>{document.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{document.documentDate}</span>
              </div>
            </div>

            {/* QR Code */}
            {qrDataUrl && (
              <div className="shrink-0 p-1 bg-white border border-neutral-200 rounded-xl shadow-xs text-center">
                <img
                  src={qrDataUrl}
                  alt={`QR Code for ${document.code}`}
                  className="w-24 h-24 rounded-lg object-contain"
                />
                <span className="text-[9px] font-mono text-neutral-600 font-bold block mt-0.5">
                  {document.code}
                </span>
              </div>
            )}
          </div>

          {/* Description & Legal Summary */}
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white mb-1.5">
              {t.docDescription}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
              {document.description || (isArabic ? 'لا يوجد وصف تفصيلي' : 'No description provided')}
            </p>
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Physical Location */}
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-[10px] text-neutral-400 font-semibold block mb-1">
                {t.docPhysicalLocation}
              </span>
              <div className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{document.physicalLocation}</span>
              </div>
            </div>

            {/* Expiry / Archival Period */}
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <span className="text-[10px] text-neutral-400 font-semibold block mb-1">
                {t.docExpiry}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-neutral-800 dark:text-neutral-200">
                <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{document.expiryDate || (isArabic ? 'حفظ دائم مستمر' : 'Permanent Retention')}</span>
              </div>
            </div>
          </div>

          {/* OCR Scanned Text if present */}
          {document.ocrText && (
            <div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>{isArabic ? 'النص المفحوص ضوئياً (OCR Text)' : 'Extracted OCR Content'}</span>
              </h3>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 leading-relaxed max-h-32 overflow-y-auto">
                {document.ocrText}
              </div>
            </div>
          )}

          {/* Integrity Hash (SHA-256) */}
          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.docIntegrityHash}</span>
              </span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ البصمة' : 'Copy Hash')}</span>
              </button>
            </div>
            <p className="font-mono text-[10px] text-neutral-600 dark:text-neutral-400 break-all select-all">
              {document.hash}
            </p>
          </div>

          {/* Internal Uploads & File Attachments (Word, Excel, PDF, Images) */}
          <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                  {isArabic ? 'الملفات والمرفقات المحفوظة داخلياً' : 'Internal Attachments & Documents'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 text-[10px] font-bold">
                  {(document.attachments || []).length} {isArabic ? 'ملفات' : 'files'}
                </span>
              </div>

              {/* Upload New Internal File */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition">
                <Upload className="w-3.5 h-3.5" />
                <span>{isArabic ? 'رفع ملف داخلي جديد' : 'Upload File'}</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp,.txt"
                  onChange={handleInternalFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* List of Attachments */}
            {(!document.attachments || document.attachments.length === 0) ? (
              <div className="p-6 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-white/60 dark:bg-neutral-900/40">
                <FileText className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 mb-1">
                  {isArabic ? 'لا توجد ملفات مرفقة محفوظة لهذه الوثيقة حالياً' : 'No attached files in this archive record'}
                </p>
                <p className="text-[11px] text-neutral-400">
                  {isArabic ? 'يدعم مستندات Word (.docx) وجداول Excel (.xlsx) و PDF والصور' : 'Supports Word, Excel, PDF, and Images'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {document.attachments.map(att => {
                  const ext = att.name.split('.').pop()?.toLowerCase() || '';
                  const isWord = ext === 'docx' || ext === 'doc';
                  const isExcel = ext === 'xlsx' || ext === 'xls' || ext === 'csv';
                  const isPdf = ext === 'pdf';
                  const isImg = ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext);

                  return (
                    <div
                      key={att.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-800 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* File Type Icon */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isWord
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                              : isExcel
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : isPdf
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                              : isImg
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                              : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                          }`}
                        >
                          {isWord && <FileText className="w-4 h-4 text-blue-600" />}
                          {isExcel && <FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
                          {isPdf && <FileText className="w-4 h-4 text-red-600" />}
                          {isImg && <ImageIcon className="w-4 h-4 text-purple-600" />}
                          {!isWord && !isExcel && !isPdf && !isImg && <FileCode className="w-4 h-4" />}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                            {att.name}
                          </p>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {(att.size / 1024).toFixed(1)} KB · {new Date(att.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Read / Preview in Reader */}
                        <button
                          type="button"
                          onClick={() => setSelectedAttachmentForReader(att)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold cursor-pointer transition"
                          title={isArabic ? 'قراءة وعرض الملف المباشر (وورد، إكسل، PDF، صور)' : 'Preview File'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'قراءة وعرض' : 'Preview'}</span>
                        </button>

                        {/* Direct Download Button ("نظام تحميل داخلي") */}
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(att)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition"
                          title={isArabic ? 'تحميل الملف داخلياً على جهازك' : 'Download to device'}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Attachment */}
                        {hasPermission('delete') && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAttachment(att.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition"
                            title={isArabic ? 'حذف هذا المرفق' : 'Delete file'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Versions History */}
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{t.docVersions}</span>
            </h3>
            <div className="space-y-1.5">
              {document.versions.map((ver, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-50/80 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      v{ver.version}
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {ver.notes}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    {new Date(ver.updatedAt).toLocaleDateString()} · {ver.updatedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          title={isArabic ? 'تأكيد حذف الوثيقة نهائياً' : 'Confirm Permanent Deletion'}
          itemCode={document.code}
          itemName={document.title}
          description={isArabic ? 'هل أنت متأكد من رغبتك في حذف هذه الوثيقة؟ سيتم مسحها نهائياً وتسجيل العملية في سجل الرقابة.' : 'Are you sure you want to delete this document?'}
          onConfirm={async () => {
            await deleteDocument(document.id);
            setIsDeleteModalOpen(false);
            onClose();
          }}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};
