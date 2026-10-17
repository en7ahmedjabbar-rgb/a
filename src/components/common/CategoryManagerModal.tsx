import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Folder,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const { categories, addCategory, deleteCategory, updateCategory, folders, documents, language } = useApp();
  const isArabic = language === 'ar';

  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      setErrorMsg(isArabic ? 'هذا التصنيف موجود مسبقاً' : 'This category already exists');
      return;
    }
    addCategory(trimmed);
    setNewCatName('');
    setErrorMsg('');
    if (onSelectCategory) {
      onSelectCategory(trimmed);
    }
  };

  const handleStartEdit = (cat: string) => {
    setEditingCat(cat);
    setEditingValue(cat);
    setErrorMsg('');
  };

  const handleSaveEdit = (oldCat: string) => {
    const trimmed = editingValue.trim();
    if (!trimmed) return;
    if (trimmed !== oldCat && categories.includes(trimmed)) {
      setErrorMsg(isArabic ? 'هذا التصنيف موجود مسبقاً' : 'This category already exists');
      return;
    }
    updateCategory(oldCat, trimmed);
    setEditingCat(null);
    setEditingValue('');
    setErrorMsg('');
  };

  const handleDelete = (cat: string) => {
    if (categories.length <= 1) {
      setErrorMsg(isArabic ? 'يجب الإبقاء على تصنيف واحد على الأقل' : 'Must keep at least one category');
      return;
    }
    deleteCategory(cat);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {isArabic ? 'إدارة أنواع التصنيفات الأرشيفية' : 'Manage Archival Categories'}
              </h3>
              <p className="text-xs text-neutral-500">
                {isArabic ? 'تحكم كامل بالتصنيفات، إضافة تصنيف مخصص، تعديل وحذف' : 'Full control: add custom categories, edit, and delete'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add New Category Input */}
        <form onSubmit={handleAdd} className="pt-4 pb-2">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            {isArabic ? 'إضافة نوع تصنيف جديد للجامعة' : 'Add New Category'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={e => {
                setNewCatName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={isArabic ? 'اكتب اسم التصنيف الجديد (مثال: بروتوكولات التعاون المشترك)...' : 'Enter category name...'}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newCatName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{isArabic ? 'إضافة التصنيف' : 'Add Category'}</span>
            </button>
          </div>
          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 mt-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 mb-1">
            <span>{isArabic ? `التصنيفات المعتمدة حالياً (${categories.length})` : `Categories (${categories.length})`}</span>
            <span className="text-[11px] text-neutral-400 font-normal">
              {isArabic ? 'انقر للتعديل أو الحذف' : 'Click to edit or remove'}
            </span>
          </div>

          {categories.map((cat, idx) => {
            const folderCount = folders.filter(f => f.category === cat).length;
            const docCount = documents.filter(d => d.category === cat).length;
            const isEditing = editingCat === cat;

            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 hover:bg-neutral-100/70 dark:hover:bg-neutral-800 transition"
              >
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingValue}
                      onChange={e => setEditingValue(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(cat)}
                      className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                      title={isArabic ? 'حفظ' : 'Save'}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCat(null)}
                      className="p-1 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                      title={isArabic ? 'إلغاء' : 'Cancel'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                        {cat}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Usage badges */}
                      <div className="hidden sm:flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
                        <span className="flex items-center gap-0.5" title="مجلدات">
                          <Folder className="w-3 h-3 text-neutral-400" />
                          {folderCount}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5" title="وثائق">
                          <FileText className="w-3 h-3 text-neutral-400" />
                          {docCount}
                        </span>
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                        title={isArabic ? 'تعديل اسم التصنيف' : 'Edit Category'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                        title={isArabic ? 'حذف هذا التصنيف' : 'Delete Category'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-bold hover:opacity-90 transition cursor-pointer"
          >
            {isArabic ? 'إغلاق وحفظ' : 'Done & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
