import React, { useState, useMemo } from 'react';
import {
  Users,
  Shield,
  UserPlus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  KeyRound,
  ShieldAlert,
  Search,
  Filter,
  Check,
  X,
  RotateCcw,
  Save,
  Phone,
  Mail,
  Building,
  UserCheck,
  Lock,
  Eye,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, PermissionKey, RolePermissionsMap } from '../../types';

export const UsersPermissionsView: React.FC = () => {
  const {
    users,
    currentUser,
    addUser,
    updateUser,
    deleteUser,
    rolePermissions,
    updateRolePermissions,
    t,
    language,
    hasPermission,
  } = useApp();

  const isArabic = language === 'ar';
  const isAdmin = currentUser.role === 'admin';

  // Active view tab inside Users & Permissions: 'users' or 'matrix'
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'matrix'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Matrix edit state
  const [matrixState, setMatrixState] = useState<RolePermissionsMap>(() => {
    return JSON.parse(JSON.stringify(rolePermissions));
  });
  const [matrixSavedAlert, setMatrixSavedAlert] = useState(false);

  // User modal state (add or edit)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form fields
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    department: string;
    role: UserRole;
    status: 'active' | 'suspended';
    twoFactorEnabled: boolean;
    password?: string;
    customPermissions: Partial<Record<PermissionKey, boolean>>;
  }>({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: 'officer',
    status: 'active',
    twoFactorEnabled: false,
    password: '',
    customPermissions: {},
  });

  // Delete modal state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const permissionLabels: Record<PermissionKey, { titleAr: string; titleEn: string; descAr: string; descEn: string }> = {
    create: {
      titleAr: 'إنشاء وأرشفة وثائق جديدة',
      titleEn: 'Create & Archive Documents',
      descAr: 'إمكانية إدخال وثائق جديدة للأرشيف ورفع المرفقات',
      descEn: 'Permission to add new documents and upload scans',
    },
    edit: {
      titleAr: 'تعديل وتحديث بيانات الوثائق',
      titleEn: 'Edit & Update Documents',
      descAr: 'تعديل البيانات الوصفية، التصنيفات، والمرفقات للوثائق المحفوظة',
      descEn: 'Update metadata, classifications, and attachments',
    },
    delete: {
      titleAr: 'حذف الوثائق الفردية',
      titleEn: 'Delete Documents',
      descAr: 'حذف مستند أو إلغاء أرشفته ونقله لسجل الإتلاف النظامي',
      descEn: 'Delete documents or mark them as disposed',
    },
    bulk_delete: {
      titleAr: 'الحذف الجماعي للوثائق',
      titleEn: 'Bulk Delete Documents',
      descAr: 'إمكانية تحديد وثائق متعددة وحذفها دفعة واحدة',
      descEn: 'Select multiple documents and batch delete them',
    },
    export: {
      titleAr: 'تصدير البيانات والتقارير',
      titleEn: 'Export Data & Reports',
      descAr: 'تصدير وثائق الأرشيف بصيغ CSV و JSON وطباعة الكشوفات',
      descEn: 'Export archive records to CSV and JSON formats',
    },
    audit: {
      titleAr: 'مراجعة وتدقيق سجلات الأمان',
      titleEn: 'Review Security Audit Logs',
      descAr: 'الاطلاع على سجلات التدقيق والمطابقة وتتبع البصمات الرقمية',
      descEn: 'View security logs, hashes, and compliance tracking',
    },
    settings: {
      titleAr: 'ضبط إعدادات النظام العامة',
      titleEn: 'Manage System Settings',
      descAr: 'الوصول إلى الإعدادات الإدارية وتهيئات النظام التشغيلية',
      descEn: 'Access administrative settings and system configurations',
    },
    scan: {
      titleAr: 'المسح الضوئي الذكي (OCR)',
      titleEn: 'Smart Scanner & OCR',
      descAr: 'استخدام كاميرا المسح الضوئي واستخراج النصوص تلقائياً',
      descEn: 'Use live camera scanning and OCR text extraction',
    },
    manage_folders: {
      titleAr: 'إدارة مجلدات وتصنيفات الأرشيف',
      titleEn: 'Manage Archive Folders',
      descAr: 'إنشاء مجلدات جديدة، تعديل ألوانها، وتصنيف الأقسام',
      descEn: 'Create folders, manage categories and directories',
    },
    manage_users: {
      titleAr: 'إدارة المستخدمين والصلاحيات',
      titleEn: 'Manage Users & Permissions',
      descAr: 'إضافة وتعديل وحذف الحسابات وتخصيص مستويات الوصول',
      descEn: 'Add, edit, delete user accounts and define permissions',
    },
    backup: {
      titleAr: 'النسخ الاحتياطي واسترجاع البيانات',
      titleEn: 'Backup & Restore Database',
      descAr: 'تنزيل نسخة احتياطية مشفرة واستيراد قواعد البيانات',
      descEn: 'Download encrypted database backups and restore',
    },
  };

  const roleTitles: Record<UserRole, { ar: string; en: string; badge: string }> = {
    admin: {
      ar: 'مدير النظام التنفيذي',
      en: 'Executive Administrator',
      badge: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    },
    officer: {
      ar: 'مسؤول أرشفة معتمد',
      en: 'Archivist Officer',
      badge: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    auditor: {
      ar: 'مدقق ومراجع قانوني',
      en: 'Compliance Auditor',
      badge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    viewer: {
      ar: 'مستعرض / جهة تدقيق',
      en: 'Viewer / Guest',
      badge: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700',
    },
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm));

      const matchRole = roleFilter === 'all' || user.role === roleFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.status !== 'suspended') ||
        (statusFilter === 'suspended' && user.status === 'suspended');

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Summary counts
  const totalUsers = users.length;
  const activeCount = users.filter(u => u.status !== 'suspended').length;
  const twoFactorCount = users.filter(u => u.twoFactorEnabled).length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'عمادة شؤون الطلبة والتسجيل العام',
      role: 'officer',
      status: 'active',
      twoFactorEnabled: false,
      password: '',
      customPermissions: {},
    });
    setActionError(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      department: user.department,
      role: user.role,
      status: user.status || 'active',
      twoFactorEnabled: !!user.twoFactorEnabled,
      password: '',
      customPermissions: { ...(user.customPermissions || {}) },
    });
    setActionError(null);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      setActionError(isArabic ? 'يرجى إدخال اسم المستخدم والبريد الإلكتروني' : 'Please provide name and email');
      return;
    }

    try {
      if (editingUser) {
        // Prevent removing the last admin
        if (editingUser.role === 'admin' && formData.role !== 'admin') {
          const remainingAdmins = users.filter(u => u.id !== editingUser.id && u.role === 'admin');
          if (remainingAdmins.length === 0) {
            setActionError(isArabic ? 'لا يمكن تغيير دور آخر مدير نظام في المؤسسة' : 'Cannot remove the last administrator');
            return;
          }
        }

        const updated: User = {
          ...editingUser,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          department: formData.department.trim(),
          role: formData.role,
          status: formData.status,
          twoFactorEnabled: formData.twoFactorEnabled,
          customPermissions: formData.customPermissions,
          ...(formData.password ? { password: formData.password } : {}),
        };
        await updateUser(updated);
      } else {
        // Check duplicate email
        if (users.some(u => u.email.toLowerCase() === formData.email.trim().toLowerCase())) {
          setActionError(isArabic ? 'البريد الإلكتروني مستخدم لحساب آخر بالفعل' : 'Email address is already in use');
          return;
        }

        await addUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          department: formData.department.trim(),
          role: formData.role,
          status: formData.status,
          twoFactorEnabled: formData.twoFactorEnabled,
          customPermissions: formData.customPermissions,
          password: formData.password || 'password123',
        });
      }

      setIsUserModalOpen(false);
    } catch (err: any) {
      setActionError(err.message || 'حدث خطأ أثناء حفظ بيانات المستخدم');
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setActionError(null);

    if (userToDelete.id === currentUser.id) {
      setActionError(isArabic ? 'لا يمكنك حذف الحساب النشط الحالي الذي قمت بتسجيل الدخول به' : 'Cannot delete the currently logged in account');
      return;
    }

    if (userToDelete.role === 'admin') {
      const remainingAdmins = users.filter(u => u.id !== userToDelete.id && u.role === 'admin');
      if (remainingAdmins.length === 0) {
        setActionError(isArabic ? 'لا يمكن حذف آخر مدير نظام في المؤسسة' : 'Cannot delete the only administrator');
        return;
      }
    }

    try {
      await deleteUser(userToDelete.id);
      setUserToDelete(null);
    } catch (err: any) {
      setActionError(err.message || 'فشل حذف الحساب');
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    if (user.id === currentUser.id) return;
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    await updateUser({
      ...user,
      status: newStatus,
    });
  };

  // Matrix handlers
  const handleToggleMatrixPermission = (role: UserRole, permission: PermissionKey) => {
    if (role === 'admin') return; // Admin always has full permissions
    setMatrixState(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission],
      },
    }));
  };

  const handleSaveMatrix = async () => {
    await updateRolePermissions(matrixState);
    setMatrixSavedAlert(true);
    setTimeout(() => setMatrixSavedAlert(false), 3000);
  };

  const handleResetMatrix = () => {
    setMatrixState(JSON.parse(JSON.stringify(rolePermissions)));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Title & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                {isArabic ? 'إدارة المستخدمين والصلاحيات' : 'User Accounts & Access Control'}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {isArabic
                  ? 'التحكم بحسابات الموظفين، تحديد أدوار الوصول (RBAC)، وتخصيص صلاحيات العمليات'
                  : 'Manage employee accounts, role-based access control (RBAC), and granular permissions'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeSubTab === 'matrix' ? (
            <>
              <button
                onClick={handleResetMatrix}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isArabic ? 'استعادة' : 'Reset'}</span>
              </button>
              <button
                onClick={handleSaveMatrix}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors text-sm font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isArabic ? 'حفظ التغييرات' : 'Save Matrix'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors text-sm font-semibold flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isArabic ? 'إضافة مستخدم جديد' : 'Add New User'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isArabic ? 'حسابات الموظفين والمستخدمين' : 'Staff & Accounts'}</span>
          <span className="px-1.5 py-0.5 rounded-full text-xs bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'matrix'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>{isArabic ? 'مصفوفة الصلاحيات (RBAC)' : 'Role Permissions Matrix'}</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {matrixSavedAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-medium">
            {isArabic ? 'تم حفظ وتحديث مصفوفة الصلاحيات بنجاح وتسجيل التغيير في سجل التدقيق الأمني.' : 'Role permissions matrix saved successfully.'}
          </span>
        </div>
      )}

      {/* SUB-TAB 1: USERS DIRECTORY */}
      {activeSubTab === 'users' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 block">{isArabic ? 'إجمالي الحسابات' : 'Total Accounts'}</span>
              <span className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 block">{totalUsers}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 block">{isArabic ? 'الحسابات النشطة' : 'Active Accounts'}</span>
              <span className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 block">{activeCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs text-purple-600 dark:text-purple-400 block">{isArabic ? 'مدراء النظام' : 'Administrators'}</span>
              <span className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 block">{adminCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs text-blue-600 dark:text-blue-400 block">{isArabic ? 'مصادقة ثنائية 2FA' : '2FA Enabled'}</span>
              <span className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 block">{twoFactorCount}</span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-neutral-400 ${isArabic ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={isArabic ? 'بحث بالاسم، البريد الإلكتروني، القسم أو الهاتف...' : 'Search by name, email, department or phone...'}
                className={`w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-neutral-900 dark:text-white ${
                  isArabic ? 'pr-9 pl-4' : 'pl-9 pr-4'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                aria-label={isArabic ? 'تصفية حسب الدور' : 'Filter by role'}
                className="py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-sm text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">{isArabic ? 'جميع الأدوار' : 'All Roles'}</option>
                <option value="admin">{isArabic ? 'مدير عام' : 'Admin'}</option>
                <option value="officer">{isArabic ? 'مسؤول أرشفة' : 'Archivist'}</option>
                <option value="auditor">{isArabic ? 'مدقق نظام' : 'Auditor'}</option>
                <option value="viewer">{isArabic ? 'مستعرض' : 'Viewer'}</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                aria-label={isArabic ? 'تصفية حسب الحالة' : 'Filter by status'}
                className="py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-sm text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">{isArabic ? 'جميع الحالات' : 'All Statuses'}</option>
                <option value="active">{isArabic ? 'نشط' : 'Active'}</option>
                <option value="suspended">{isArabic ? 'موقوف' : 'Suspended'}</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3.5 px-4 text-start">{isArabic ? 'الموظف / المستخدم' : 'User'}</th>
                    <th className="py-3.5 px-4 text-start">{isArabic ? 'القسم والجهة' : 'Department'}</th>
                    <th className="py-3.5 px-4 text-start">{isArabic ? 'الدور الوظيفي' : 'Role'}</th>
                    <th className="py-3.5 px-4 text-start">{isArabic ? 'حالة الحساب' : 'Status'}</th>
                    <th className="py-3.5 px-4 text-start">{isArabic ? 'المصادقة 2FA' : '2FA'}</th>
                    <th className="py-3.5 px-4 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-neutral-500">
                        {isArabic ? 'لا توجد حسابات مطابقة لمعايير البحث' : 'No user accounts found matching query'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => {
                      const isCurrent = user.id === currentUser.id;
                      const roleConfig = roleTitles[user.role] || roleTitles.viewer;
                      const isSuspended = user.status === 'suspended';

                      return (
                        <tr
                          key={user.id}
                          className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors ${
                            isCurrent ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 text-neutral-800 dark:text-neutral-100 font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
                                {user.name.trim().charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-neutral-900 dark:text-white truncate">
                                    {user.name}
                                  </span>
                                  {isCurrent && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-medium">
                                      {isArabic ? 'حسابك الحالي' : 'You'}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5">
                                  <span className="truncate">{user.email}</span>
                                  {user.phone && <span>• {user.phone}</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-neutral-700 dark:text-neutral-300">
                            <div className="flex items-center gap-1.5 text-xs">
                              <Building className="w-3.5 h-3.5 text-neutral-400" />
                              <span className="truncate max-w-[160px]">{user.department}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${roleConfig.badge}`}
                            >
                              <Shield className="w-3 h-3" />
                              <span>{isArabic ? roleConfig.ar : roleConfig.en}</span>
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              disabled={isCurrent}
                              title={isCurrent ? (isArabic ? 'لا يمكن تعطيل حسابك النشط' : 'Cannot suspend self') : ''}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                isSuspended
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              } ${isCurrent ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:opacity-90'}`}
                            >
                              {isSuspended ? (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  <span>{isArabic ? 'موقوف' : 'Suspended'}</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>{isArabic ? 'نشط' : 'Active'}</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-4 px-4">
                            {user.twoFactorEnabled ? (
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                <KeyRound className="w-3.5 h-3.5" />
                                <span>{isArabic ? 'مفعل' : 'Enabled'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                                <Lock className="w-3.5 h-3.5" />
                                <span>{isArabic ? 'غير مفعل' : 'Disabled'}</span>
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(user)}
                                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                title={isArabic ? 'تعديل الحساب والصلاحيات' : 'Edit User & Permissions'}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setUserToDelete(user)}
                                disabled={isCurrent}
                                className={`p-2 rounded-lg transition-colors ${
                                  isCurrent
                                    ? 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
                                    : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer'
                                }`}
                                title={isCurrent ? (isArabic ? 'لا يمكن حذف الحساب الحالي' : 'Cannot delete self') : (isArabic ? 'حذف الحساب نهائياً' : 'Delete account')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ROLE PERMISSIONS MATRIX (RBAC) */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-blue-900 dark:text-blue-200">
                {isArabic ? 'مصفوفة التحكم بالصلاحيات بحسب الأدوار الوظيفية (RBAC)' : 'Role-Based Access Control Matrix (RBAC)'}
              </p>
              <p className="text-blue-700 dark:text-blue-300 text-xs leading-relaxed">
                {isArabic
                  ? 'تمكنك هذه المصفوفة من ضبط الصلاحيات الافتراضية لكل دور وظيفي. دور "مدير النظام" يمتلك كافة الصلاحيات بشكل دائم لضمان إدارة المنظومة وعدم حظر الحسابات القيادية.'
                  : 'Configure default permissions for each role. Executive Administrator always retains full authority.'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-4 px-4 text-start min-w-[240px]">{isArabic ? 'الصلاحية والعملية' : 'Permission / Action'}</th>
                    <th className="py-4 px-4 text-center min-w-[140px]">
                      <div className="flex flex-col items-center">
                        <span className="text-purple-700 dark:text-purple-300 font-bold">{isArabic ? 'مدير النظام' : 'Admin'}</span>
                        <span className="text-[10px] text-neutral-400">{isArabic ? 'كامل الصلاحيات' : 'Superuser'}</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center min-w-[140px]">
                      <div className="flex flex-col items-center">
                        <span className="text-blue-700 dark:text-blue-300 font-bold">{isArabic ? 'مسؤول أرشفة' : 'Officer'}</span>
                        <span className="text-[10px] text-neutral-400">{isArabic ? 'معالجة وأرشفة' : 'Archivist'}</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center min-w-[140px]">
                      <div className="flex flex-col items-center">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold">{isArabic ? 'مدقق نظام' : 'Auditor'}</span>
                        <span className="text-[10px] text-neutral-400">{isArabic ? 'مراجعة وتدقيق' : 'Compliance'}</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center min-w-[140px]">
                      <div className="flex flex-col items-center">
                        <span className="text-neutral-700 dark:text-neutral-300 font-bold">{isArabic ? 'مستعرض' : 'Viewer'}</span>
                        <span className="text-[10px] text-neutral-400">{isArabic ? 'قراءة فقط' : 'Read-Only'}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
                  {(Object.keys(permissionLabels) as PermissionKey[]).map(permKey => {
                    const info = permissionLabels[permKey];
                    return (
                      <tr key={permKey} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-medium text-neutral-900 dark:text-white block">
                              {isArabic ? info.titleAr : info.titleEn}
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
                              {isArabic ? info.descAr : info.descEn}
                            </span>
                          </div>
                        </td>

                        {/* Admin column - always active */}
                        <td className="py-3.5 px-4 text-center bg-purple-50/20 dark:bg-purple-950/10">
                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                            <Check className="w-4 h-4 font-bold" />
                          </div>
                        </td>

                        {/* Officer column */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleMatrixPermission('officer', permKey)}
                            aria-label={`Toggle officer permission for ${permKey}`}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all cursor-pointer ${
                              matrixState.officer[permKey]
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                            }`}
                          >
                            {matrixState.officer[permKey] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          </button>
                        </td>

                        {/* Auditor column */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleMatrixPermission('auditor', permKey)}
                            aria-label={`Toggle auditor permission for ${permKey}`}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all cursor-pointer ${
                              matrixState.auditor[permKey]
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                            }`}
                          >
                            {matrixState.auditor[permKey] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          </button>
                        </td>

                        {/* Viewer column */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleMatrixPermission('viewer', permKey)}
                            aria-label={`Toggle viewer permission for ${permKey}`}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all cursor-pointer ${
                              matrixState.viewer[permKey]
                                ? 'bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 shadow-xs'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                            }`}
                          >
                            {matrixState.viewer[permKey] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT USER */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {editingUser
                    ? (isArabic ? 'تعديل بيانات وصلاحيات الحساب' : 'Edit User & Permissions')
                    : (isArabic ? 'إضافة مستخدم جديد للنظام' : 'Add New User')}
                </h2>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 overflow-y-auto flex-1">
              {actionError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {isArabic ? 'الاسم الكامل للموظف' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={isArabic ? 'مثال: م. علي حسين الجبوري' : 'e.g. John Doe'}
                    className="w-full py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-blue-500/20 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {isArabic ? 'البريد الإلكتروني المهني' : 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@arsheef.gov.iq"
                    className="w-full py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-blue-500/20 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {isArabic ? 'رقم الهاتف / الاتصال' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+964 770 000 0000"
                    className="w-full py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-blue-500/20 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {isArabic ? 'القسم / الدائرة' : 'Department'}
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder={isArabic ? 'مثال: كلية الهندسة / عمادة الدراسات العليا' : 'e.g. Faculty of Engineering'}
                    className="w-full py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-blue-500/20 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {isArabic ? 'الدور الوظيفي الأساسي' : 'Assigned Role'}
                  </label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                    className="w-full py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="admin">{isArabic ? 'مدير عام تنفيذي (كامل الصلاحيات)' : 'Executive Admin'}</option>
                    <option value="officer">{isArabic ? 'مسؤول أرشفة معتمد (إدخال وتعديل)' : 'Archivist Officer'}</option>
                    <option value="auditor">{isArabic ? 'مدقق قانوني (مراجعة وتدقيق وتصدير)' : 'Compliance Auditor'}</option>
                    <option value="viewer">{isArabic ? 'مستعرض (اطلاع وقراءة فقط)' : 'Viewer'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {isArabic ? 'حالة الحساب' : 'Account Status'}
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'suspended' }))}
                    className="w-full py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="active">{isArabic ? 'نشط وجاري العمل به' : 'Active'}</option>
                    <option value="suspended">{isArabic ? 'موقوف مؤقتاً (تعطيل الدخول)' : 'Suspended'}</option>
                  </select>
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {editingUser
                    ? (isArabic ? 'تعيين كلمة مرور جديدة (اتركه فارغاً للإبقاء على الحالية)' : 'Change Password (leave empty to keep current)')
                    : (isArabic ? 'كلمة المرور الابتدائية' : 'Initial Password')}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-blue-500/20 text-neutral-900 dark:text-white"
                />
              </div>

              {/* 2FA Toggle */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white block">
                      {isArabic ? 'المصادقة الثنائية (2FA)' : 'Two-Factor Authentication'}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {isArabic ? 'طلب رمز أمان إضافي عند تسجيل الدخول' : 'Require security code challenge upon sign in'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.twoFactorEnabled}
                  onChange={e => setFormData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                  aria-label={isArabic ? 'تفعيل المصادقة الثنائية' : 'Enable 2FA'}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Granular user permission overrides */}
              {formData.role !== 'admin' && (
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                        {isArabic ? 'تخصيص صلاحيات استثنائية لهذا الحساب' : 'Custom Permission Overrides'}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {isArabic ? 'يمكنك منح أو سلب صلاحيات معينة لهذا المستخدم بغض النظر عن دوره الافتراضي' : 'Override role defaults for this specific account'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Object.keys(permissionLabels) as PermissionKey[]).map(perm => {
                      const isOverridden = formData.customPermissions[perm] !== undefined;
                      const isGranted = formData.customPermissions[perm] === true;

                      return (
                        <div
                          key={perm}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 text-xs"
                        >
                          <span className="text-neutral-800 dark:text-neutral-200 truncate pr-2">
                            {isArabic ? permissionLabels[perm].titleAr : permissionLabels[perm].titleEn}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => {
                                  const next = { ...prev.customPermissions };
                                  if (next[perm] === true) {
                                    delete next[perm];
                                  } else {
                                    next[perm] = true;
                                  }
                                  return { ...prev, customPermissions: next };
                                });
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                                isGranted
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              {isArabic ? 'ممنوح' : 'Grant'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => {
                                  const next = { ...prev.customPermissions };
                                  if (next[perm] === false) {
                                    delete next[perm];
                                  } else {
                                    next[perm] = false;
                                  }
                                  return { ...prev, customPermissions: next };
                                });
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                                isOverridden && !isGranted
                                  ? 'bg-red-600 text-white'
                                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              {isArabic ? 'محظور' : 'Deny'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs cursor-pointer"
                >
                  {editingUser
                    ? (isArabic ? 'تحديث الحساب' : 'Update Account')
                    : (isArabic ? 'إنشاء الحساب' : 'Create Account')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {isArabic ? 'حذف حساب المستخدم نهائياً' : 'Delete User Account Permanently'}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {isArabic ? (
                  <>
                    هل أنت متأكد من رغبتك في حذف الحساب <strong className="text-neutral-900 dark:text-white">{userToDelete.name}</strong> ({userToDelete.email})؟ سيتم سحب صلاحيات الوصول فوراً وتسجيل العملية في سجل التدقيق الأمني.
                  </>
                ) : (
                  <>
                    Are you sure you want to delete <strong className="text-neutral-900 dark:text-white">{userToDelete.name}</strong>? This action cannot be undone.
                  </>
                )}
              </p>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                {actionError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-xs cursor-pointer"
              >
                {isArabic ? 'تأكيد الحذف النهائي' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
