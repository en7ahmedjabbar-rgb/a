import React, { useState } from 'react';
import { ShieldCheck, X, Key, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TwoFactorModal: React.FC = () => {
  const { is2FAOpen, setIs2FAOpen, verify2FACode, t, language, currentUser } = useApp();
  const isArabic = language === 'ar';

  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  if (!is2FAOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verify2FACode(code);
    if (!success) {
      setError(true);
    } else {
      setError(false);
      setCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 text-start">
        <button
          onClick={() => setIs2FAOpen(false)}
          className="absolute top-4 end-4 p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              {t.verify2FA}
            </h3>
            <p className="text-[11px] text-neutral-500">
              {currentUser.email}
            </p>
          </div>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
          {t.enter2FACode}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={e => {
                setCode(e.target.value);
                setError(false);
              }}
              placeholder="123456"
              autoFocus
              className="w-full text-center tracking-widest font-mono text-xl py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{isArabic ? 'رمز التحقق غير صحيح، يرجى إدخال 6 أرقام' : 'Invalid 6-digit code'}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            {t.confirmCode}
          </button>
        </form>
      </div>
    </div>
  );
};
