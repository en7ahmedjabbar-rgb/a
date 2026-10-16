import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Printer,
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileText,
  Shield,
  MapPin,
  Calendar,
  Tag,
  CheckCircle,
  Clock,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ArchiveDocument, DocumentClassification, DocumentStatus } from '../../types';

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
  const { documents, deleteDocument, t, language, hasPermission, logAuditEvent } = useApp();
  const isArabic = language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    documents.forEach(d => set.add(d.department));
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
        (doc.ocrText && doc.ocrText.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchDept = selectedDept === 'ALL' || doc.department === selectedDept;
      const matchClass = selectedClass === 'ALL' || doc.classification === selectedClass;
      const matchStatus = selectedStatus === 'ALL' || doc.status === selectedStatus;

      return matchSearch && matchDept && matchClass && matchStatus;
    });
  }, [documents, searchTerm, selectedDept, selectedClass, selectedStatus]);

  // Export to Excel / CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'Document Code',
      'Title',
      'Category',
      'Department',
      'Classification',
      'Status',
      'Physical Location',
      'Date',
      'SHA256 Hash',
    ];

    const rows = filteredDocs.map(d => [
      `"${d.code}"`,
      `"${d.title.replace(/"/g, '""')}"`,
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

    logAuditEvent('EXPORT', 'EXCEL_CSV_EXPORT', `تصدير ${filteredDocs.length} وثيقة إلى ملف Excel/CSV`);
  };

  // Printable Register
  const handlePrintRegister = () => {
    window.print();
    logAuditEvent('EXPORT', 'PRINT_REGISTER', `طباعة سجل الأرشيف لـ ${filteredDocs.length} وثيقة`);
  };

  const handleDelete = async (doc: ArchiveDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(isArabic ? `هل تؤكد حذف الوثيقة ${doc.code} نهائياً؟` : `Are you sure you want to delete ${doc.code}?`)) {
      await deleteDocument(doc.id);
    }
  };

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

  return (
    <div className="space-y-5">
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

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <div className="flex items-center gap-1 text-neutral-500 text-[11px] font-medium me-1">
            <Filter className="w-3 h-3" />
            <span>{isArabic ? 'تصفية:' : 'Filters:'}</span>
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs cursor-pointer focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">{isArabic ? 'كافة الإدارات' : 'All Departments'}</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

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
                  <th className="py-3 px-4 text-start">{t.docCode}</th>
                  <th className="py-3 px-4 text-start">{t.docTitle}</th>
                  <th className="py-3 px-4 text-start hidden md:table-cell">{t.docDepartment}</th>
                  <th className="py-3 px-4 text-start">{t.docClassification}</th>
                  <th className="py-3 px-4 text-start hidden lg:table-cell">{t.docPhysicalLocation}</th>
                  <th className="py-3 px-4 text-start hidden sm:table-cell">{t.docDate}</th>
                  <th className="py-3 px-4 text-start">{t.docStatus}</th>
                  <th className="py-3 px-4 text-end">{t.docActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredDocs.map(doc => (
                  <tr
                    key={doc.id}
                    onClick={() => onSelectDocument(doc)}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition cursor-pointer"
                  >
                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {doc.code}
                    </td>

                    {/* Title & tags */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                        {doc.title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-neutral-400">
                        <span>{doc.category}</span>
                        {doc.tags.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="truncate max-w-[150px]">{doc.tags.join(', ')}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 hidden md:table-cell whitespace-nowrap">
                      {doc.department}
                    </td>

                    {/* Classification */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getClassificationBadge(doc.classification)}
                    </td>

                    {/* Physical Location */}
                    <td className="py-3.5 px-4 text-neutral-500 hidden lg:table-cell text-[11px] truncate max-w-[180px]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0 text-neutral-400" />
                        <span className="truncate">{doc.physicalLocation}</span>
                      </span>
                    </td>

                    {/* Document Date */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500 hidden sm:table-cell whitespace-nowrap">
                      {doc.documentDate}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-end whitespace-nowrap">
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
                            onClick={e => handleDelete(doc, e)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                            title={t.delete}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
