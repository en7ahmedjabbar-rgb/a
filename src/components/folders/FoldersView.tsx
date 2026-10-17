import React, { useState, useMemo } from 'react';
import {
  Folder,
  FolderPlus,
  Search,
  Plus,
  FileText,
  Calendar,
  MoreVertical,
  Trash2,
  Edit2,
  Eye,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Layers,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ArchiveFolder, ArchiveDocument } from '../../types';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';

interface FoldersViewProps {
  onOpenDocument: (doc: ArchiveDocument) => void;
  onOpenNewDocInFolder?: (folderId: string, folderName: string) => void;
}

const PRESET_COLORS = [
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Purple', hex: '#7c3aed' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Cyan', hex: '#0891b2' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Slate', hex: '#475569' },
];

export const FoldersView: React.FC<FoldersViewProps> = ({
  onOpenDocument,
  onOpenNewDocInFolder,
}) => {
  const { folders, documents, addFolder, updateFolder, deleteFolder, t, language, currentUser, hasPermission } = useApp();
  const isArabic = language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<ArchiveFolder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<ArchiveFolder | null>(null);

  // Persistent folder view so updates don't close the folder
  const [selectedFolderForViewId, setSelectedFolderForViewId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('arsheef_viewing_folder_id') || null;
    } catch {
      return null;
    }
  });

  const selectedFolderForView = useMemo(() => {
    if (!selectedFolderForViewId) return null;
    return folders.find(f => f.id === selectedFolderForViewId) || null;
  }, [folders, selectedFolderForViewId]);

  const setSelectedFolderForView = (folder: ArchiveFolder | null) => {
    setSelectedFolderForViewId(folder ? folder.id : null);
    try {
      if (folder) {
        localStorage.setItem('arsheef_viewing_folder_id', folder.id);
      } else {
        localStorage.removeItem('arsheef_viewing_folder_id');
      }
    } catch {}
  };

  // Form states
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formDept, setFormDept] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formColor, setFormColor] = useState('#2563eb');
  const [formDesc, setFormDesc] = useState('');

  // Open Create Modal
  const handleOpenCreate = () => {
    const nextCode = `FLD-${new Date().getFullYear()}-${String(folders.length + 1).padStart(2, '0')}`;
    setFormCode(nextCode);
    setFormName('');
    setFormDept(currentUser.department || 'الشؤون الإدارية');
    setFormCategory('العقود والاتفاقيات');
    setFormColor('#2563eb');
    setFormDesc('');
    setEditingFolder(null);
    setIsCreateOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (folder: ArchiveFolder, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingFolder(folder);
    setFormCode(folder.code);
    setFormName(folder.name);
    setFormDept(folder.department);
    setFormCategory(folder.category);
    setFormColor(folder.color || '#2563eb');
    setFormDesc(folder.description || '');
    setIsCreateOpen(true);
  };

  // Submit Create or Edit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingFolder) {
      await updateFolder({
        ...editingFolder,
        code: formCode,
        name: formName,
        department: formDept,
        category: formCategory,
        color: formColor,
        description: formDesc,
      });
    } else {
      await addFolder({
        code: formCode,
        name: formName,
        department: formDept,
        category: formCategory,
        color: formColor,
        description: formDesc,
        createdBy: currentUser.name,
      });
    }

    setIsCreateOpen(false);
    setEditingFolder(null);
  };

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    folders.forEach(f => {
      if (f.department) set.add(f.department);
    });
    return Array.from(set);
  }, [folders]);

  // Documents count per folder mapping
  const docCounts = useMemo(() => {
    const map: Record<string, number> = {};
    documents.forEach(d => {
      if (d.folderId) {
        map[d.folderId] = (map[d.folderId] || 0) + 1;
      }
    });
    return map;
  }, [documents]);

  // Filtered folders
  const filteredFolders = useMemo(() => {
    return folders.filter(folder => {
      const matchSearch =
        folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        folder.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (folder.description && folder.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (folder.department && folder.department.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchDept = selectedDept === 'ALL' || folder.department === selectedDept;
      return matchSearch && matchDept;
    });
  }, [folders, searchTerm, selectedDept]);

  // Documents inside active selected folder
  const selectedFolderDocs = useMemo(() => {
    if (!selectedFolderForView) return [];
    return documents.filter(d => d.folderId === selectedFolderForView.id);
  }, [documents, selectedFolderForView]);

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-600" />
            <span>{t.foldersTitle}</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl">
            {t.foldersSubtitle}
          </p>
        </div>

        {hasPermission('create') && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
          >
            <FolderPlus className="w-4 h-4" />
            <span>{t.createFolder}</span>
          </button>
        )}
      </div>

      {/* Summary Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">
              {isArabic ? 'إجمالي المجلدات النشطة' : 'Total Active Folders'}
            </span>
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1 block tabular-nums">
              {folders.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Folder className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">
              {isArabic ? 'الوثائق داخل المجلدات' : 'Docs in Folders'}
            </span>
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1 block tabular-nums">
              {documents.filter(d => Boolean(d.folderId)).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">
              {isArabic ? 'الكليات والأقسام الأكاديمية' : 'Colleges & Departments'}
            </span>
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1 block tabular-nums">
              {departments.length || 1}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Department Filters */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className={`absolute top-2.5 w-4 h-4 text-neutral-400 ${isArabic ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={isArabic ? 'بحث باسم المجلد، الكود، أو الكلية/القسم...' : 'Search folders by name, code or college/department...'}
            className={`w-full py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              isArabic ? 'pr-9 pl-4' : 'pl-9 pr-4'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">{isArabic ? 'كافة الكليات والأقسام' : 'All Colleges & Departments'}</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Folders Grid */}
      {filteredFolders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <Folder className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">
            {t.noFoldersFound}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
            {isArabic ? 'قم بإنشاء مجلدك الأرشيفي الأول لتنظيم وثائق ومستندات مؤسستك' : 'Create your first archive folder to organize your enterprise documents'}
          </p>
          {hasPermission('create') && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer shadow-xs hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t.createFolder}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFolders.map(folder => {
            const count = docCounts[folder.id] || 0;

            return (
              <div
                key={folder.id}
                onClick={() => setSelectedFolderForView(folder)}
                className="group relative rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Folder Top Color Accent Bar */}
                <div
                  className="absolute top-0 inset-x-0 h-1.5 transition-opacity group-hover:h-2"
                  style={{ backgroundColor: folder.color || '#2563eb' }}
                />

                <div>
                  {/* Card Header: Icon, Code, and Actions */}
                  <div className="flex items-center justify-between mb-3 pt-1">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                        style={{ backgroundColor: folder.color || '#2563eb' }}
                      >
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold text-neutral-500 dark:text-neutral-400 block">
                          {folder.code}
                        </span>
                        <span className="text-[10px] text-neutral-400 block truncate max-w-[140px]">
                          {folder.department}
                        </span>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      {hasPermission('edit') && (
                        <button
                          onClick={e => handleOpenEdit(folder, e)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                          title={t.editFolder}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {hasPermission('delete') && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setFolderToDelete(folder);
                          }}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                          title={t.deleteFolder}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Folder Title */}
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {folder.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-4">
                    {folder.description || (isArabic ? 'مجلد أرشفة رئيسي لحفظ الوثائق والمستندات الرسمية' : 'Archival directory for classified records')}
                  </p>
                </div>

                {/* Footer: Document Count & Open Trigger */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300 font-mono flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{count} {t.folderDocsCount}</span>
                  </span>

                  <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1">
                    <span>{t.viewFolderDocs}</span>
                    {isArabic ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Folder Drill-Down Drawer / Modal */}
      {selectedFolderForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 overflow-hidden max-h-[85vh] flex flex-col">
            {/* Header */}
            <div
              className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
              style={{ borderTop: `4px solid ${selectedFolderForView.color || '#2563eb'}` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedFolderForView.color || '#2563eb' }}
                >
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      {selectedFolderForView.code}
                    </span>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="text-xs text-neutral-500">
                      {selectedFolderForView.department}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                    {selectedFolderForView.name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasPermission('create') && onOpenNewDocInFolder && (
                  <button
                    onClick={() => {
                      onOpenNewDocInFolder(selectedFolderForView.id, selectedFolderForView.name);
                      setSelectedFolderForView(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'أرشفة وثيقة هنا' : 'Add Document'}</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedFolderForView(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Folder Description */}
            {selectedFolderForView.description && (
              <div className="px-6 py-2.5 bg-neutral-50/70 dark:bg-neutral-800/40 text-xs text-neutral-600 dark:text-neutral-300 border-b border-neutral-100 dark:border-neutral-800">
                {selectedFolderForView.description}
              </div>
            )}

            {/* Documents Table Inside Folder */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {selectedFolderDocs.length === 0 ? (
                <div className="py-12 text-center text-neutral-400">
                  <FileText className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-600 mb-2" />
                  <p className="text-xs font-semibold">{t.emptyFolder}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedFolderDocs.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        onOpenDocument(doc);
                        setSelectedFolderForView(null);
                      }}
                      className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-800/50 transition cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                              {doc.code}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {doc.documentDate}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-neutral-900 dark:text-white line-clamp-1 mt-0.5">
                            {doc.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-neutral-500 hidden sm:inline">
                          {doc.physicalLocation}
                        </span>
                        <Eye className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between text-xs text-neutral-500">
              <span>
                {selectedFolderDocs.length} {t.folderDocsCount}
              </span>
              <button
                onClick={() => setSelectedFolderForView(null)}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold hover:bg-neutral-100 cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Folder Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {editingFolder ? t.editFolder : t.createFolder}
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  {isArabic ? 'إنشاء ملف تصنيفي موضوعي لجمع الوثائق' : 'Create organizational folder archive'}
                </p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.folderCode} *
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.folderName} *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    required
                    placeholder={isArabic ? 'مثال: ملفات التدقيق والرقابة المالية 2026' : 'e.g. Audit & Financial Reports 2026'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.folderDepartment}
                  </label>
                  <input
                    type="text"
                    value={formDept}
                    onChange={e => setFormDept(e.target.value)}
                    placeholder={isArabic ? 'عمادة القبول والتسجيل / كلية الهندسة' : 'Deanship of Admissions / Faculty of Engineering'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.folderCategory}
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
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
              </div>

              {/* Color Preset Palette */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {t.folderColor}
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFormColor(c.hex)}
                      className={`w-7 h-7 rounded-lg transition transform cursor-pointer flex items-center justify-center ${
                        formColor === c.hex ? 'ring-2 ring-offset-2 ring-neutral-900 dark:ring-white scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {formColor === c.hex && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t.folderDescription}
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder={isArabic ? 'وصف طبيعة الملف الأرشيفي ونوعية الوثائق المحفوظة فيه...' : 'Description of files and purpose...'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{t.save}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Folder Confirm Modal */}
      {folderToDelete && (
        <DeleteConfirmModal
          isOpen={Boolean(folderToDelete)}
          title={t.deleteFolder}
          itemCode={folderToDelete.code}
          itemName={folderToDelete.name}
          description={t.confirmDeleteFolder}
          onConfirm={async () => {
            await deleteFolder(folderToDelete.id);
            setFolderToDelete(null);
          }}
          onClose={() => setFolderToDelete(null)}
        />
      )}
    </div>
  );
};
