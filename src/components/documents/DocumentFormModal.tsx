import React, { useState } from 'react';
import { X, Upload, FileText, Check, Plus, AlertCircle } from 'lucide-react';
import { ArchiveDocument, DocumentAttachment, DocumentClassification, DocumentStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface DocumentFormModalProps {
  documentToEdit?: ArchiveDocument | null;
  scannedData?: {
    title?: string;
    ocrText?: string;
    imagePreview?: string;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const DocumentFormModal: React.FC<DocumentFormModalProps> = ({
  documentToEdit,
  scannedData,
  onClose,
  onSuccess,
}) => {
  const { addDocument, updateDocument, folders, t, language, currentUser } = useApp();
  const isArabic = language === 'ar';

  const [code, setCode] = useState(
    documentToEdit?.code || `DOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [title, setTitle] = useState(documentToEdit?.title || scannedData?.title || '');
  const [description, setDescription] = useState(documentToEdit?.description || '');
  const [selectedFolderId, setSelectedFolderId] = useState<string>(
    documentToEdit?.folderId || ''
  );
  const [category, setCategory] = useState(documentToEdit?.category || 'العقود والاتفاقيات');
  const [department, setDepartment] = useState(documentToEdit?.department || currentUser.department || 'الشؤون القانونية');
  const [classification, setClassification] = useState<DocumentClassification>(
    documentToEdit?.classification || 'internal'
  );
  const [status, setStatus] = useState<DocumentStatus>(documentToEdit?.status || 'active');
  const [physicalLocation, setPhysicalLocation] = useState(
    documentToEdit?.physicalLocation || 'المخزن المركزي - رف C-04 - صندوق 12'
  );
  const [tagsInput, setTagsInput] = useState(documentToEdit?.tags.join(', ') || '');
  const [documentDate, setDocumentDate] = useState(
    documentToEdit?.documentDate || new Date().toISOString().slice(0, 10)
  );
  const [expiryDate, setExpiryDate] = useState(documentToEdit?.expiryDate || '');
  const [ocrText, setOcrText] = useState(documentToEdit?.ocrText || scannedData?.ocrText || '');
  const [changeNotes, setChangeNotes] = useState('');
  const [attachments, setAttachments] = useState<DocumentAttachment[]>(documentToEdit?.attachments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle file attachment
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        const newAttachment: DocumentAttachment = {
          id: 'att-' + Date.now() + '-' + i,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: reader.result as string,
          uploadedAt: new Date().toISOString(),
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage(isArabic ? 'يرجى إدخال عنوان الوثيقة' : 'Please provide a document title');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const selectedFolder = folders.find(f => f.id === selectedFolderId);
      const folderName = selectedFolder?.name;

      if (documentToEdit) {
        await updateDocument(
          {
            ...documentToEdit,
            code,
            title,
            description,
            category,
            department,
            folderId: selectedFolderId || undefined,
            folderName: folderName || undefined,
            classification,
            status,
            physicalLocation,
            tags,
            documentDate,
            expiryDate: expiryDate || undefined,
            ocrText: ocrText || undefined,
            attachments,
          },
          changeNotes || (isArabic ? 'تحديث بيانات الوثيقة' : 'Updated document details')
        );
      } else {
        await addDocument({
          code,
          title,
          description,
          category,
          department,
          folderId: selectedFolderId || undefined,
          folderName: folderName || undefined,
          classification,
          status,
          physicalLocation,
          tags,
          documentDate,
          expiryDate: expiryDate || undefined,
          ocrText: ocrText || undefined,
          createdBy: currentUser.name,
          attachments,
        });
      }

      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(isArabic ? 'حدث خطأ أثناء حفظ الوثيقة' : 'Error saving document');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              {documentToEdit
                ? (isArabic ? 'تعديل وثيقة مؤرشفة' : 'Edit Archived Document')
                : (isArabic ? 'أرشفة وثيقة رسمية جديدة' : 'Archive New Document')}
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {isArabic ? 'إدخال القيود والمعلومات مع التوقيع الرقمي' : 'Enter archival metadata and security classification'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Row 1: Code and Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {t.docCode} *
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {t.docTitle} *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder={isArabic ? 'مثال: عقد توريد الخوادم ومحضر الاستلام' : 'e.g. Master Services Agreement 2026'}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row: Folder Selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {t.selectFolder} ({isArabic ? 'المجلد الحاوي للوثيقة' : 'Target Archive Directory'})
            </label>
            <select
              value={selectedFolderId}
              onChange={e => setSelectedFolderId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">{t.noFolder}</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>
                  📁 {f.code} - {f.name} ({f.department})
                </option>
              ))}
            </select>
          </div>

          {/* Row 2: Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {t.docCategory}
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="أوامر جامعية ومحاضر مجلس الجامعة">أوامر جامعية ومحاضر مجلس الجامعة</option>
                <option value="سجلات الخريجين والوثائق الأكاديمية">سجلات الخريجين والوثائق الأكاديمية</option>
                <option value="أطاريح الدراسات العليا والبحوث">أطاريح الدراسات العليا والبحوث</option>
                <option value="الترقيات العلمية وملفات التدريسيين">الترقيات العلمية وملفات التدريسيين</option>
                <option value="المشاريع والإعمار الهندسي الجامعي">المشاريع والإعمار الهندسي الجامعي</option>
                <option value="الموازنة الجامعية والمناقصات">الموازنة الجامعية والمناقصات</option>
                <option value="شهادات الجودة والاعتماد الأكاديمي">شهادات الجودة والاعتماد الأكاديمي</option>
                <option value="العقود والمذكرات الأكاديمية الدولية">العقود والمذكرات الأكاديمية الدولية</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {t.docDepartment}
              </label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder={isArabic ? 'عمادة القبول والتسجيل / كلية الهندسة' : 'Deanship of Admissions / Faculty of Engineering'}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Classification & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {t.docClassification}
              </label>
              <select
                value={classification}
                onChange={e => setClassification(e.target.value as DocumentClassification)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">{t.classPublic}</option>
                <option value="internal">{t.classInternal}</option>
                <option value="confidential">{t.classConfidential}</option>
                <option value="top_secret">{t.classTopSecret}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {t.docStatus}
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as DocumentStatus)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">{t.statusActive}</option>
                <option value="archived">{t.statusArchived}</option>
                <option value="pending_review">{t.statusPendingReview}</option>
                <option value="disposed">{t.statusDisposed}</option>
              </select>
            </div>
          </div>

          {/* Row 4: Physical Location & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {t.docPhysicalLocation}
              </label>
              <input
                type="text"
                value={physicalLocation}
                onChange={e => setPhysicalLocation(e.target.value)}
                placeholder="الجناح A - رف 04 - قاصة 02"
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {t.docDate}
              </label>
              <input
                type="date"
                value={documentDate}
                onChange={e => setDocumentDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {t.docExpiry}
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {t.docTags} ({isArabic ? 'مفصولة بفواصل' : 'Comma separated'})
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="عقود, خوادم, ضمان, تقنية"
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {t.docDescription}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={isArabic ? 'وصف تفصيلي للوثيقة ومحتوياتها...' : 'Summary of document contents...'}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Scanned OCR Text if any */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {isArabic ? 'النص المفحوص ضوئياً (OCR Text)' : 'Extracted Text (OCR)'}
            </label>
            <textarea
              rows={2}
              value={ocrText}
              onChange={e => setOcrText(e.target.value)}
              placeholder={isArabic ? 'النصوص المقروءة عبر الماسح الضوئي...' : 'Extracted text via optical scan...'}
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Attachment upload */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {t.docAttachments}
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-200 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>{isArabic ? 'إرفاق ملف أو صورة ممسوحة' : 'Attach File or Scan'}</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {attachments.length > 0 && (
                <span className="text-xs text-neutral-500">
                  {attachments.length} {isArabic ? 'ملف مرفق' : 'file(s) attached'}
                </span>
              )}
            </div>
          </div>

          {/* Change Notes if editing */}
          {documentToEdit && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {isArabic ? 'سبب التعديل (لتسجيله في تاريخ النسخ)' : 'Revision Notes'}
              </label>
              <input
                type="text"
                value={changeNotes}
                onChange={e => setChangeNotes(e.target.value)}
                placeholder={isArabic ? 'مثال: تحديث الموقع المادي وإرفاق الملحق المالي' : 'e.g. Updated physical bin and attached addendum'}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
