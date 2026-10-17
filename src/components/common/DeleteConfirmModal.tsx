import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName?: string;
  itemCode?: string;
  description?: string;
  isDangerous?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  itemName,
  itemCode,
  description,
  isDangerous = true,
  onConfirm,
  onClose,
}) => {
  const { language, t } = useApp();
  const isArabic = language === 'ar';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/40">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isArabic ? 'هذا الإجراء نهائي وسيتم تسجيله في سجل الرقابة والامتثال' : 'This action is permanent and recorded in the audit log'}
            </p>
          </div>
        </div>

        {/* Item Target Preview */}
        {(itemName || itemCode) && (
          <div className="p-3 mb-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-xs">
            {itemCode && (
              <span className="font-mono font-bold text-neutral-500 text-[11px] block">
                {itemCode}
              </span>
            )}
            {itemName && (
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 block truncate">
                {itemName}
              </span>
            )}
          </div>
        )}

        {description && (
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-5 leading-relaxed">
            {description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isArabic ? 'تأكيد الحذف النهائي' : 'Confirm Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
