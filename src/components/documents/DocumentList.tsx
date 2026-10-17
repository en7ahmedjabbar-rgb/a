import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileSpreadsheet,
  Printer,
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileText,
  MapPin,
  Folder,
  CheckSquare,
  Square,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ArchiveDocument, DocumentClassification, DocumentStatus } from '../../types';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';

interface DocumentListProps {
  onOpenNewDocModal: () => void;
  onSelectDocument: (doc: ArchiveDocument) => void;
  onEditDocument: (doc: ArchiveDocument) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  onOpenNewDocModal,
  onSelectDocument,
  onEditDocument,
}) => {
  const { documents, folders, deleteDocument, deleteDocumentsBulk, t, language, hasPermission, logAuditEvent } = useApp();
  const isArabic = language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Multi-selection state for bulk delete
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [docToDelete, setDocToDelete] = useState<ArchiveDocument | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    documents.forEach(d => {
      if (d.department) set.add(d.department);
    });
    return Array.from(set);
  }, [documents]);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.physicalLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.folderName && doc.folderName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.ocrText && doc.ocrText.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchFolder = selectedFolder === 'ALL' || doc.folderId === selectedFolder;
      const matchClass = selectedClass === 'ALL' || doc.classification === selectedClass;
      const matchStatus = selectedStatus === 'ALL' || doc.status === selectedStatus;

      return matchSearch && matchFolder && matchClass && matchStatus;
    });
  }, [documents, searchTerm, selectedFolder, selectedClass, selectedStatus]);

  // Checkbox toggle helpers
  const handleToggleSelectDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDocIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedDocIds.length === filteredDocs.length && filteredDocs.length > 0) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(filteredDocs.map(d => d.id));
    }
  };

  // Export to Excel / CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'Document Code',
      'Title',
      'Folder',
      'Category',
      'Department',
      'Classification',
      'Status',
      'Physical Location',
      'Date',
      'SHA256 Hash',
    ];

    const targetList = selectedDocIds.length > 0
      ? filteredDocs.filter(d => selectedDocIds.includes(d.id))
      : filteredDocs;

    const rows = targetList.map(d => [
      `"${d.code}"`,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${(d.folderName || '').replace(/"/g, '""')}"`,
      `"${d.category.replace(/"/g, '""')}"`,
      `"${d.department.replace(/"/g, '""')}"`,
      `"${d.classification}"`,
      `"${d.status}"`,
      `"${d.physicalLocation.replace(/"/g, '""')}"`,
      `"${d.documentDate}"`,
      `"${d.hash}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Arsheef_Archive_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAuditEvent('EXPORT', 'EXCEL_CSV_EXPORT', `تصدير ${targetList.length} وثيقة إلى ملف Excel/CSV`);
  };

  // Printable Register
  const handlePrintRegister = () => {
    window.print();
    logAuditEvent('EXPORT', 'PRINT_REGISTER', `طباعة سجل الأرشيف لـ ${filteredDocs.length} وثيقة`);
  };

  // Classification styling
  const getClassificationBadge = (cls: DocumentClassification) => {
    switch (cls) {
      case 'top_secret':
        return (
          <span className="text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-2 py-0.5 rounded-md text-[10px] font-bold">
            {isArabic ? 'سري للغاية' : 'Top Secret'}
          </span>
        );
      case 'confidential':
        return (
          <span className="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 px-2 py-0.5 rounded-md text-[10px] font-bold">
            {isArabic ? 'سري' : 'Confidential'}
          </span>
        );
      case 'internal':
        return (
          <span className="text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 px-2 py-0.5 rounded-md text-[10px] font-medium">
            {isArabic ? 'داخلي' : 'Internal'}
          </span>
        );
      default:
        return (
          <span className="text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-0.5 rounded-md text-[10px] font-medium">
            {isArabic ? 'عام' : 'Public'}
          </span>
        );
    }
  };

  // Status styling
  const getStatusBadge = (st: DocumentStatus) => {
    switch (st) {
      case 'active':
        return (
          <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md text-[10px] font-semibold">
            {isArabic ? 'نشط' : 'Active'}
          </span>
        );
      case 'archived':
        return (
          <span className="text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md text-[10px] font-semibold">
            {isArabic ? 'مؤرشف' : 'Archived'}
          </span>
        );
      case 'pending_review':
        return (
          <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md text-[10px] font-semibold">
            {isArabic ? 'قيد المراجعة' : 'Review'}
          </span>
        );
      default:
        return (
          <span className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md text-[10px] font-semibold">
            {isArabic ? 'مستبعد' : 'Disposed'}
          </span>
        );
    }
  };

  const isAllSelected = filteredDocs.length > 0 && selectedDocIds.length === filteredDocs.length;

  return (
    <div className="space-y-4">
      {/* Search & Actions Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className={`absolute top-2.5 w-4 h-4 text-neutral-400 ${isArabic ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isArabic ? 'pr-9 pl-4' : 'pl-9 pr-4'
              }`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {hasPermission('export') && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition cursor-pointer"
                  title="Export Excel/CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Excel</span>
                </button>

                <button
                  onClick={handlePrintRegister}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition cursor-pointer"
                  title="Print Register"
                >
                  <Printer className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              </>
            )}

            {hasPermission('create') && (
              <button
                onClick={onOpenNewDocModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addNewDocument}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <div className="flex items-center gap-1 text-neutral-500 text-[11px] font-medium me-1">
            <Filter className="w-3 h-3" />
            <span>{isArabic ? 'تصفية:' : 'Filters:'}</span>
          </div>

          {/* Exclusive Folders Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-neutral-500 hidden sm:inline">
              {isArabic ? 'المجلد الأرشيفي:' : 'Folder:'}
            </span>
            <select
              value={selectedFolder}
              onChange={e => setSelectedFolder(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 text-neutral-900 dark:text-neutral-100 text-xs font-semibold cursor-pointer focus:ring-2 focus:ring-blue-500 shadow-xs"
            >
              <option value="ALL">
                {isArabic ? `📁 كافة المجلدات الأرشيفية (عرض الكل)` : `📁 All Folders (${folders.length})`}
              </option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>
                  📁 {f.name} ({f.code})
                </option>
              ))}
            </select>
          </div>

          {/* Classification Filter */}
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs cursor-pointer focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">{isArabic ? 'كافة درجات السرية' : 'All Classifications'}</option>
            <option value="public">{t.classPublic}</option>
            <option value="internal">{t.classInternal}</option>
            <option value="confidential">{t.classConfidential}</option>
            <option value="top_secret">{t.classTopSecret}</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs cursor-pointer focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">{isArabic ? 'كافة الحالات' : 'All Statuses'}</option>
            <option value="active">{t.statusActive}</option>
            <option value="archived">{t.statusArchived}</option>
            <option value="pending_review">{t.statusPendingReview}</option>
            <option value="disposed">{t.statusDisposed}</option>
          </select>

          <div className="ms-auto flex items-center gap-2 text-neutral-500 text-[11px]">
            <span>{isArabic ? `${filteredDocs.length} وثيقة متطابقة` : `${filteredDocs.length} matching documents`}</span>
          </div>
        </div>
      </div>

      {/* Bulk Action Toolbar if items are selected */}
      {selectedDocIds.length > 0 && (
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-200">
            <span className="font-mono tabular-nums">{selectedDocIds.length}</span>
            <span>{t.selectedCount}</span>
          </div>

          <div className="flex items-center gap-2">
            {hasPermission('delete') && (
              <button
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.bulkDelete}</span>
              </button>
            )}

            <button
              onClick={() => setSelectedDocIds([])}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              {isArabic ? 'إلغاء التحديد' : 'Deselect All'}
            </button>
          </div>
        </div>
      )}

      {/* Document List Presentation */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <FileText className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">
            {t.noDocumentsFound}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {isArabic ? 'جرب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية' : 'Try adjusting your search criteria or resetting filters.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50/80 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold text-[11px]">
                  <th className="py-3 px-3 w-8 text-center" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="cursor-pointer text-neutral-400 hover:text-blue-600 transition"
                      aria-label="Select all documents"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3 text-start">{t.docCode}</th>
                  <th className="py-3 px-3 text-start">{t.docTitle}</th>
                  <th className="py-3 px-3 text-start hidden sm:table-cell">{isArabic ? 'المجلد الأرشيفي' : 'Folder'}</th>
                  <th className="py-3 px-3 text-start hidden md:table-cell">{t.docDepartment}</th>
                  <th className="py-3 px-3 text-start">{t.docClassification}</th>
                  <th className="py-3 px-3 text-start hidden lg:table-cell">{t.docPhysicalLocation}</th>
                  <th className="py-3 px-3 text-start hidden sm:table-cell">{t.docDate}</th>
                  <th className="py-3 px-3 text-start">{t.docStatus}</th>
                  <th className="py-3 px-3 text-end">{t.docActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredDocs.map(doc => {
                  const isSelected = selectedDocIds.includes(doc.id);

                  return (
                    <tr
                      key={doc.id}
                      onClick={() => onSelectDocument(doc)}
                      className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition cursor-pointer ${
                        isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center" onClick={e => handleToggleSelectDoc(doc.id, e)}>
                        <button
                          type="button"
                          className="cursor-pointer text-neutral-400 hover:text-blue-600 transition"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Code */}
                      <td className="py-3.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {doc.code}
                      </td>

                      {/* Title & category */}
                      <td className="py-3.5 px-3 max-w-xs">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                          {doc.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-neutral-400">
                          <span>{doc.category}</span>
                          {doc.tags.length > 0 && (
                            <>
                              <span>·</span>
                              <span className="truncate max-w-[140px]">{doc.tags.join(', ')}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Folder Name */}
                      <td className="py-3.5 px-3 hidden sm:table-cell whitespace-nowrap">
                        {doc.folderName ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
                            <Folder className="w-3 h-3 text-amber-500 shrink-0" />
                            <span className="truncate max-w-[130px]">{doc.folderName}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-400 italic">
                            {isArabic ? 'أرشيف عام' : 'Unassigned'}
                          </span>
                        )}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-3 text-neutral-600 dark:text-neutral-300 hidden md:table-cell whitespace-nowrap">
                        {doc.department}
                      </td>

                      {/* Classification */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getClassificationBadge(doc.classification)}
                      </td>

                      {/* Physical Location */}
                      <td className="py-3.5 px-3 text-neutral-500 hidden lg:table-cell text-[11px] truncate max-w-[170px]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0 text-neutral-400" />
                          <span className="truncate">{doc.physicalLocation}</span>
                        </span>
                      </td>

                      {/* Document Date */}
                      <td className="py-3.5 px-3 font-mono text-[11px] text-neutral-500 hidden sm:table-cell whitespace-nowrap">
                        {doc.documentDate}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getStatusBadge(doc.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectDocument(doc)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                            title={t.viewDetails}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {hasPermission('edit') && (
                            <button
                              onClick={() => onEditDocument(doc)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-amber-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                              title={t.edit}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {hasPermission('delete') && (
                            <button
                              onClick={() => setDocToDelete(doc)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                              title={t.delete}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Single Document Delete Confirmation Modal */}
      {docToDelete && (
        <DeleteConfirmModal
          isOpen={Boolean(docToDelete)}
          title={isArabic ? 'تأكيد حذف الوثيقة نهائياً' : 'Confirm Permanent Document Deletion'}
          itemCode={docToDelete.code}
          itemName={docToDelete.title}
          description={isArabic ? 'سيتم مسح بيانات الوثيقة وملفاتها المرفقة من قاعدة البيانات المحلية المشفرة وتوثيق العملية في سجل التدقيق.' : 'Document record and files will be permanently removed from local database.'}
          onConfirm={async () => {
            await deleteDocument(docToDelete.id);
            setSelectedDocIds(prev => prev.filter(id => id !== docToDelete.id));
            setDocToDelete(null);
          }}
          onClose={() => setDocToDelete(null)}
        />
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isBulkDeleteModalOpen}
          title={isArabic ? `تأكيد حذف ${selectedDocIds.length} وثيقة دفعة واحدة` : `Confirm Bulk Delete of ${selectedDocIds.length} Documents`}
          itemName={isArabic ? `${selectedDocIds.length} وثيقة أرشيفية محددة` : `${selectedDocIds.length} selected documents`}
          description={t.confirmBulkDelete}
          onConfirm={async () => {
            await deleteDocumentsBulk(selectedDocIds);
            setSelectedDocIds([]);
            setIsBulkDeleteModalOpen(false);
          }}
          onClose={() => setIsBulkDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};
