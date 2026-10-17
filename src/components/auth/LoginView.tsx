import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginView: React.FC = () => {
  const { login, users, language, t } = useApp();
  const isArabic = language === 'ar';

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim()) {
      setError(isArabic ? 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم' : 'Please enter your email or username');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(usernameOrEmail, password);
      if (!success) {
        setError(t.loginError || (isArabic ? 'البيانات المدخلة غير صحيحة. كلمة المرور الافتراضية هي 123' : 'Invalid credentials. Default password is 123'));
      }
    } catch (err) {
      console.error(err);
      setError(isArabic ? 'تعذر تسجيل الدخول، يرجى المحاولة لاحقاً' : 'Login failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setIsLoading(true);
    setError('');
    setUsernameOrEmail(userEmail);
    setPassword('123');
    await login(userEmail, '123');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden select-none">
      {/* Background Subtle Ambient Light */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="w-full max-w-md relative z-10">
        {/* App Wordmark & Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/20 mb-3.5 border border-white/10 font-bold text-xl tracking-tight">
            AR
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            {t.appName}
          </h1>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
            {t.loginSubtitle || (isArabic ? 'نظام الأرشفة وإدارة الوثائق الإلكترونية الذكي المعتمد' : 'Enterprise Electronic Document Archiving')}
          </p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>ISO/IEC 27001:2022 Certified Architecture</span>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 p-6 sm:p-7 shadow-2xl">
          <div className="mb-5 pb-3 border-b border-neutral-800">
            <h2 className="text-sm font-bold text-white">
              {t.loginTitle}
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {isArabic ? 'أدخل بيانات الحساب الرسمي للوصول إلى قاعدة البيانات المشفرة' : 'Enter your credentials to access the encrypted archive'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                {t.emailOrUsername}
              </label>
              <div className="relative">
                <Mail className={`absolute top-2.5 w-4 h-4 text-neutral-500 ${isArabic ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={e => setUsernameOrEmail(e.target.value)}
                  placeholder="en7ahmedjabbar@gmail.com"
                  autoComplete="username"
                  required
                  className={`w-full py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-800/80 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  {t.password}
                </label>
                <span className="text-[10px] text-neutral-500">
                  {isArabic ? 'افتراضي: 123' : 'Default: 123'}
                </span>
              </div>
              <div className="relative">
                <Lock className={`absolute top-2.5 w-4 h-4 text-neutral-500 ${isArabic ? 'right-3' : 'left-3'}`} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-800/80 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400 hover:text-neutral-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-neutral-700 text-blue-600 focus:ring-0 bg-neutral-800"
                />
                <span>{t.rememberMe}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isLoading ? (isArabic ? 'جاري التحقق...' : 'Authenticating...') : t.login}</span>
              {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-neutral-800">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mb-2.5 font-medium">
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.quickDemoLogin}</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {users.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u.email)}
                  className="p-2 rounded-lg bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 text-start text-neutral-300 hover:text-white transition cursor-pointer flex flex-col"
                >
                  <span className="text-[11px] font-semibold truncate text-neutral-100">
                    {u.name.split(' ')[0]} {u.name.split(' ')[1] || ''}
                  </span>
                  <span className="text-[9px] text-neutral-400 uppercase font-mono mt-0.5">
                    {u.role} · {u.department.slice(0, 15)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Local Security & Offline Assurance */}
        <div className="mt-4 text-center text-[11px] text-neutral-400">
          <span>{isArabic ? 'قاعدة بيانات محلية مشفرة تعمل بدون اتصال بالإنترنت' : 'Local encrypted database · Zero cloud dependency'}</span>
        </div>
      </div>
    </div>
  );
};
