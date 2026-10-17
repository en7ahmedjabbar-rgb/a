import { ArchiveDocument, ArchiveFolder, AuditLogEntry, SupportTicket, SystemErrorLog, User } from '../types';

const DB_NAME = 'ArsheefProEnterpriseDB';
const DB_VERSION = 2;

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin-1',
    name: 'أ.د. أحمد جبار (رئيس الجامعة)',
    email: 'en7ahmedjabbar@gmail.com',
    phone: '+964 770 123 4567',
    role: 'admin',
    department: 'رئاسة الجامعة',
    status: 'active',
    password: '123',
    twoFactorEnabled: true,
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'u-officer-1',
    name: 'د. سارة المنصوري',
    email: 'sara.mansoor@univ.edu.iq',
    phone: '+964 780 234 5678',
    role: 'officer',
    department: 'عمادة شؤون الطلبة والتسجيل العام',
    status: 'active',
    password: '123',
    twoFactorEnabled: true,
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'u-auditor-1',
    name: 'أ.م.د. كريم الخالدي',
    email: 'karim.khalidi@univ.edu.iq',
    phone: '+964 750 345 6789',
    role: 'auditor',
    department: 'قسم ضمان الجودة والاعتماد الأكاديمي',
    status: 'active',
    password: '123',
    twoFactorEnabled: false,
    createdAt: '2026-02-01T11:00:00Z',
  },
  {
    id: 'u-viewer-1',
    name: 'لجنة تدقيق وزارة التعليم العالي',
    email: 'audit-committee@mohesr.gov.iq',
    phone: '+964 771 456 7890',
    role: 'viewer',
    department: 'وزارة التعليم العالي والبحث العلمي',
    status: 'active',
    password: '123',
    twoFactorEnabled: false,
    createdAt: '2026-03-01T14:00:00Z',
  },
];

export const INITIAL_FOLDERS: ArchiveFolder[] = [
  {
    id: 'fld-101',
    code: 'FLD-UNI-01',
    name: 'أوامر جامعية ومحاضر مجلس الجامعة',
    description: 'سجلات وقرارات مجلس الجامعة، الأوامر الوزارية والجامعية المعتمدة، وضوابط التعليمات الصادرة من رئاسة الجامعة.',
    category: 'أوامر جامعية ومحاضر مجلس الجامعة',
    department: 'رئاسة الجامعة وأمانة المجلس',
    color: '#2563eb',
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-02-15T10:14:00Z',
    createdBy: 'أ.د. أحمد جبار (رئيس الجامعة)',
  },
  {
    id: 'fld-102',
    code: 'FLD-UNI-02',
    name: 'أضابير الخريجين والوثائق الأكاديمية',
    description: 'سجلات تخرج الطلبة، شهادات التخرج الجدارية، صحة الصدور المتبادلة، وجداول درجات كليات الجامعة.',
    category: 'سجلات الخريجين والوثائق الأكاديمية',
    department: 'عمادة شؤون الطلبة والتسجيل العام',
    color: '#7c3aed',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-21T08:30:00Z',
    createdBy: 'د. سارة المنصوري',
  },
  {
    id: 'fld-103',
    code: 'FLD-UNI-03',
    name: 'أطاريح الدراسات العليا والبحوث العلمية',
    description: 'رسائل الماجستير وأطاريح الدكتوراه المجازة، براءات الاختراع، وتقارير الاستلال الأكاديمي للجامعة.',
    category: 'أطاريح الدراسات العليا والبحوث',
    department: 'عمادة الدراسات العليا والبحث العلمي',
    color: '#059669',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-02T13:45:00Z',
    createdBy: 'أ.م.د. كريم الخالدي',
  },
  {
    id: 'fld-104',
    code: 'FLD-UNI-04',
    name: 'ملفات التدريسيين والترقيات العلمية',
    description: 'أضابير أعضاء الهيئة التدريسية، قرارات لجنة الترقيات العلمية المركزية، وتفرغات الإيفاد والبحث العلمي.',
    category: 'الترقيات العلمية وملفات التدريسيين',
    department: 'قسم الشؤون العلمية والترقيات',
    color: '#d97706',
    createdAt: '2026-01-05T11:00:00Z',
    updatedAt: '2026-01-05T12:00:00Z',
    createdBy: 'د. سارة المنصوري',
  },
  {
    id: 'fld-105',
    code: 'FLD-UNI-05',
    name: 'المشاريع والإعمار الهندسي الجامعي',
    description: 'المخططات الهندسية للمجمعات الجامعية، تصاميم المختبرات العلمية الحديثة، ومباني الكليات والمكتبة المركزية.',
    category: 'المشاريع والإعمار الهندسي الجامعي',
    department: 'قسم الشؤون الهندسية والإعمار',
    color: '#0891b2',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-03-01T09:15:00Z',
    createdBy: 'أ.د. أحمد جبار (رئيس الجامعة)',
  },
  {
    id: 'fld-106',
    code: 'FLD-UNI-06',
    name: 'الموازنة الجامعية والمناقصات',
    description: 'الموازنة الاستثمارية والتشغيلية للجامعة، عقود توريد الأجهزة المخبرية، والتخصيصات المالية للكليات والأقسام.',
    category: 'الموازنة الجامعية والمناقصات',
    department: 'قسم الشؤون المالية والحسابات',
    color: '#dc2626',
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-03-05T11:00:00Z',
    createdBy: 'د. سارة المنصوري',
  },
];

export const INITIAL_DOCUMENTS: ArchiveDocument[] = [
  {
    id: 'doc-101',
    code: 'DOC-UNI-2026-01',
    title: 'أمر جامعي بتشكيل لجان مناقشة رسائل الماجستير لكليات الهندسة والعلوم',
    description: 'الأمر الصادر من رئاسة الجامعة لتشكيل لجان المناقشة لطلبة الدراسات العليا للعام الأكاديمي 2025-2026 وتسمية الأساتذة المشرفين والممتحنين.',
    category: 'أوامر جامعية ومحاضر مجلس الجامعة',
    department: 'رئاسة الجامعة وأمانة المجلس',
    folderId: 'fld-101',
    folderName: 'أوامر جامعية ومحاضر مجلس الجامعة',
    classification: 'internal',
    status: 'active',
    physicalLocation: 'مبنى رئاسة الجامعة - أرشيف الأوامر الجامعية - قاصة 01',
    tags: ['أمر جامعي', 'دراسات عليا', 'مناقشات', 'كلية الهندسة', 'كلية العلوم'],
    documentDate: '2026-02-14',
    expiryDate: '2036-02-14',
    ocrText: 'وزارة التعليم العالي والبحث العلمي - رئاسة الجامعة - أمر جامعي رقم 104/2026. بناءً على ما عرضه عميد الدراسات العليا، تقرر تشكيل لجان المناقشة العلنية لطلبة الماجستير.',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    createdBy: 'أ.د. أحمد جبار (رئيس الجامعة)',
    createdAt: '2026-02-15T10:14:00Z',
    updatedAt: '2026-02-15T10:14:00Z',
    attachments: [
      {
        id: 'att-1',
        name: 'University_Decree_Master_Defense_2026.pdf',
        size: 2150000,
        type: 'application/pdf',
        dataUrl: '',
        uploadedAt: '2026-02-15T10:14:00Z',
      },
    ],
    versions: [
      {
        version: '1.0',
        updatedAt: '2026-02-15T10:14:00Z',
        updatedBy: 'أ.د. أحمد جبار (رئيس الجامعة)',
        notes: 'الأمر الجامعي المعتمد والموقع بختم رئاسة الجامعة',
      },
    ],
  },
  {
    id: 'doc-102',
    code: 'DOC-UNI-2026-02',
    title: 'محضر اجتماع مجلس الجامعة بخصوص الاعتماد الأكاديمي الدولي (ABET / WFME)',
    description: 'المصادقة على استيفاء متطلبات الاعتماد البرامجي الدولي لكليات الطب والهندسة وعلوم الحاسوب، واعتماد الخطة الاستراتيجية للتحول الرقمي.',
    category: 'أوامر جامعية ومحاضر مجلس الجامعة',
    department: 'رئاسة الجامعة وأمانة المجلس',
    folderId: 'fld-101',
    folderName: 'أوامر جامعية ومحاضر مجلس الجامعة',
    classification: 'confidential',
    status: 'active',
    physicalLocation: 'خزينة أمانة مجلس الجامعة - الجناح السري رف 03',
    tags: ['مجلس الجامعة', 'اعتماد أكاديمي', 'ABET', 'كلية الطب', 'كلية الهندسة'],
    documentDate: '2026-01-20',
    expiryDate: '2036-01-20',
    ocrText: 'محضر اجتماع مجلس الجامعة للجلسة الخامسة للعام 2026. برئاسة السيد رئيس الجامعة وبحضور السادة العمداء. تمت المصادقة على تقارير لجان ضمان الجودة.',
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    createdBy: 'د. سارة المنصوري',
    createdAt: '2026-01-21T08:30:00Z',
    updatedAt: '2026-01-21T08:30:00Z',
    attachments: [],
    versions: [
      {
        version: '1.0',
        updatedAt: '2026-01-21T08:30:00Z',
        updatedBy: 'د. سارة المنصوري',
        notes: 'المحضر الرسمي موقع من كافة أعضاء مجلس الجامعة',
      },
    ],
  },
  {
    id: 'doc-103',
    code: 'DOC-UNI-2026-03',
    title: 'سجل أوامر التخرج وصحة الصدور لطلبة كليات الطب والصيدلة والهندسة',
    description: 'قوائم الطلبة المتخرجين المعتمدة وزارياً وشهادات الجدارية الصادرة للعام الدراسي المنصرم مصدقة أصولاً لجهات التدقيق والتوظيف.',
    category: 'سجلات الخريجين والوثائق الأكاديمية',
    department: 'عمادة شؤون الطلبة والتسجيل العام',
    folderId: 'fld-102',
    folderName: 'أضابير الخريجين والوثائق الأكاديمية',
    classification: 'public',
    status: 'active',
    physicalLocation: 'عمادة القبول والتسجيل - القاصة الأرشيفية المركزية B-12',
    tags: ['خريجين', 'تخرج', 'صحة صدور', 'شهادات جدارية', 'الطب', 'الهندسة'],
    documentDate: '2026-03-01',
    expiryDate: '2046-03-01',
    ocrText: 'سجل الخريجين الموحد لجامعتنا للعام الدراسي. نؤيد صحة صدور الوثائق المرفقة الصادرة للطلبة المدرجة أسماؤهم وتفاصيل أوامر تخرجهم الأكاديمية.',
    hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    createdBy: 'أ.م.د. كريم الخالدي',
    createdAt: '2026-03-02T13:45:00Z',
    updatedAt: '2026-03-02T13:45:00Z',
    attachments: [],
    versions: [
      {
        version: '1.0',
        updatedAt: '2026-03-02T13:45:00Z',
        updatedBy: 'أ.م.د. كريم الخالدي',
        notes: 'النسخة المعتمدة بختم العميد المسجل العام',
      },
    ],
  },
  {
    id: 'doc-104',
    code: 'DOC-UNI-2026-04',
    title: 'مناقصة تجهيز وتحديث المختبرات التخصصية للذكاء الاصطناعي والحوسبة المتقدمة',
    description: 'كراس الشروط والمواصفات الفنية لتوريد تجهيزات ومحطات عمل ومعالجات GPU عالية الأداء لمختبرات كلية علوم الحاسوب والذكاء الاصطناعي.',
    category: 'الموازنة الجامعية والمناقصات',
    department: 'قسم الشؤون المالية والحسابات',
    folderId: 'fld-106',
    folderName: 'الموازنة الجامعية والمناقصات',
    classification: 'internal',
    status: 'active',
    physicalLocation: 'شعبة العقود والمناقصات - ملف المناقصات رقم 12',
    tags: ['مختبرات', 'ذكاء اصطناعي', 'مناقصات', 'حاسوب', 'أجهزة بحثية'],
    documentDate: '2026-02-10',
    expiryDate: '2031-02-10',
    ocrText: 'مناقصة تجهيز مختبرات الحوسبة المتقدمة والذكاء الاصطناعي رقم 04/2026. الكلفة التخمينية للمشروع: سبعمائة وخمسون مليون دينار عراقي.',
    hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    createdBy: 'د. سارة المنصوري',
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-02-10T12:00:00Z',
    attachments: [],
    versions: [
      {
        version: '1.0',
        updatedAt: '2026-02-10T12:00:00Z',
        updatedBy: 'د. سارة المنصوري',
        notes: 'الإعلان الرسمي وجداول الكميات المعتمدة',
      },
    ],
  },
  {
    id: 'doc-105',
    code: 'DOC-UNI-2026-05',
    title: 'المخططات الهندسية لمشروع التوسعة والمبنى الأكاديمي الجديد لكلية الصيدلة',
    description: 'المخططات المعمارية والإنشائية ومخططات السلامة المعتمدة للمبنى الأكاديمي الإضافي والقاعات الدراسية التخصصية.',
    category: 'المشاريع والإعمار الهندسي الجامعي',
    department: 'قسم الشؤون الهندسية والإعمار',
    folderId: 'fld-105',
    folderName: 'المشاريع والإعمار الهندسي الجامعي',
    classification: 'internal',
    status: 'pending_review',
    physicalLocation: 'شعبة المخططات الهندسية - دروج الخرائط الجامعية C-04',
    tags: ['مخططات هندسية', 'كلية الصيدلة', 'إعمار جامعي', 'مختبرات'],
    documentDate: '2026-01-15',
    expiryDate: '2036-01-15',
    ocrText: 'الجامعة - قسم الشؤون الهندسية والإعمار. مشروع إنشاء المجمع الدراسي والمختبري لكلية الصيدلة. المساحة الإجمالية: 4500 متر مربع.',
    hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    createdBy: 'أ.د. أحمد جبار (رئيس الجامعة)',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
    attachments: [],
    versions: [
      {
        version: '1.0',
        updatedAt: '2026-01-15T09:00:00Z',
        updatedBy: 'أ.د. أحمد جبار (رئيس الجامعة)',
        notes: 'المخططات التفصيلية المصادق عليها من اللجنة الهندسية العليا',
      },
    ],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-03-10T08:15:22Z',
    userId: 'u-admin-1',
    userName: 'م. أحمد جبار (المدير العام)',
    action: 'LOGIN',
    targetResource: 'AUTH_SUBSYSTEM',
    details: 'تسجيل دخول ناجح إلى النظام المكتبي باستخدام المصادقة الثنائية 2FA',
    ipAddress: '192.168.1.105 (Local Workstation)',
    hashSignature: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
  },
  {
    id: 'log-002',
    timestamp: '2026-03-10T09:20:11Z',
    userId: 'u-officer-1',
    userName: 'سارة المنصوري',
    action: 'CREATE',
    targetResource: 'DOC-2026-0842',
    details: 'أرشفة وثيقة عقد توريد الخوادم ومطابقة التوقيعات الرقمية',
    ipAddress: '192.168.1.112 (Archiving Terminal 02)',
    hashSignature: '1f2e3d4c5b6a79887766554433221100',
  },
  {
    id: 'log-003',
    timestamp: '2026-03-10T10:05:44Z',
    userId: 'u-auditor-1',
    userName: 'د. كريم الخالدي',
    action: 'VIEW',
    targetResource: 'DOC-2026-0319',
    details: 'معاينة وفحص محضر مجلس الإدارة السري لأغراض التدقيق القانوني',
    ipAddress: '192.168.1.140 (Auditor Station)',
    hashSignature: 'a1b2c3d4e5f60718293a4b5c6d7e8f90',
  },
  {
    id: 'log-004',
    timestamp: '2026-03-10T11:40:02Z',
    userId: 'u-admin-1',
    userName: 'م. أحمد جبار (المدير العام)',
    action: 'BACKUP',
    targetResource: 'FULL_ARCHIVE_STORAGE',
    details: 'إنشاء نسخة احتياطية آلية مشفرة بكلمة مرور وتوليد بصمة SHA-256',
    ipAddress: '192.168.1.105 (Local Workstation)',
    hashSignature: '00112233445566778899aabbccddeeff',
  },
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 't-101',
    ticketNumber: 'TCK-2026-041',
    subject: 'طلب ربط ماسح ضوئي عالي السرعة (High-Speed Fujitsu Scanner)',
    description: 'نحتاج تفعيل تعريف بروتوكول TWAIN/Webcam للماسح الضوئي المكتبي في صالة الأرشفة الرئيسية لتمكين المسح المتتابع لـ 50 صفحة دفعة واحدة.',
    priority: 'high',
    status: 'in_progress',
    category: 'scanner',
    createdBy: 'سارة المنصوري',
    createdAt: '2026-03-08T11:20:00Z',
    updatedAt: '2026-03-09T09:15:00Z',
    responses: [
      {
        id: 'r-1',
        senderName: 'م. أحمد جبار (المدير العام)',
        senderRole: 'admin',
        message: 'تم تحديث وحدة المسح الضوئي المدمجة في النظام لدعم قراءة الكاميرا المباشرة بدقة عالية واستخراج النصوص الفوري OCR.',
        createdAt: '2026-03-09T09:15:00Z',
      },
    ],
  },
  {
    id: 't-102',
    ticketNumber: 'TCK-2026-038',
    subject: 'التحقق من إعدادات التزامن الفوري عبر شبكة الواي فاي المحلية',
    description: 'تم اختبار ربط الهاتف المحمول (Android) عبر قراءة كود الـ QR، ونرغب في التأكد من استمرار التزامن أثناء التنقل بين المكاتب.',
    priority: 'medium',
    status: 'resolved',
    category: 'sync',
    createdBy: 'د. كريم الخالدي',
    createdAt: '2026-03-05T14:10:00Z',
    updatedAt: '2026-03-06T10:00:00Z',
    responses: [
      {
        id: 'r-2',
        senderName: 'فريق الدعم الفني المركزي',
        senderRole: 'admin',
        message: 'قناة التزامن المحلي تستخدم البث الشبكي BroadcastChannel ونظام P2P LAN، مما يسمح بحفظ البيانات محلياً وإرسالها فور معاودة الاتصال.',
        createdAt: '2026-03-06T10:00:00Z',
      },
    ],
  },
];

// Permanent deletion tracking so deleted items NEVER resurrect under any conditions
export function markIdAsDeleted(id: string): void {
  try {
    const raw = localStorage.getItem('arsheef_permanent_deleted_ids');
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem('arsheef_permanent_deleted_ids', JSON.stringify(list));
    }
  } catch {}
}

export function isIdDeleted(id: string): boolean {
  try {
    const raw = localStorage.getItem('arsheef_permanent_deleted_ids');
    if (!raw) return false;
    const list: string[] = JSON.parse(raw);
    return list.includes(id);
  } catch {
    return false;
  }
}

class DatabaseService {
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  public async init(): Promise<void> {
    if (this.isInitialized && this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('documents')) {
          const docStore = db.createObjectStore('documents', { keyPath: 'id' });
          docStore.createIndex('code', 'code', { unique: true });
          docStore.createIndex('classification', 'classification', { unique: false });
          docStore.createIndex('department', 'department', { unique: false });
          docStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains('folders')) {
          const folderStore = db.createObjectStore('folders', { keyPath: 'id' });
          folderStore.createIndex('code', 'code', { unique: true });
        }

        if (!db.objectStoreNames.contains('auditLogs')) {
          const logStore = db.createObjectStore('auditLogs', { keyPath: 'id' });
          logStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('tickets')) {
          const ticketStore = db.createObjectStore('tickets', { keyPath: 'id' });
          ticketStore.createIndex('ticketNumber', 'ticketNumber', { unique: true });
        }

        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('errorLogs')) {
          db.createObjectStore('errorLogs', { keyPath: 'id' });
        }
      };

      request.onsuccess = async (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.isInitialized = true;
        await this.seedDefaultsIfEmpty();
        resolve();
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  private async seedDefaultsIfEmpty(): Promise<void> {
    const SEED_KEY = 'arsheef_db_seeded_once_permanent';
    const isAlreadySeeded = localStorage.getItem(SEED_KEY);

    // If database was already initialized and seeded once, NEVER re-seed!
    // Whatever the user deletes stays deleted permanently!
    if (isAlreadySeeded === 'true') {
      return;
    }
    // Set immediately so no race condition can re-seed
    localStorage.setItem(SEED_KEY, 'true');

    const [docs, flds] = await Promise.all([this.getAllDocuments(), this.getAllFolders()]);

    // Check if user still has the old corporate placeholder data
    const hasOldCorporateData = flds.some(f =>
      f.department === 'تقنية المعلومات والشؤون القانونية' ||
      f.department === 'الإدارة المالية والمحاسبة' ||
      f.name === 'عقود المشروعات والتوريدات'
    );

    if (hasOldCorporateData) {
      // Clean up old corporate records
      for (const f of flds) {
        if (f.id.startsWith('fld-10')) {
          await this.deleteFolder(f.id);
        }
      }
      for (const d of docs) {
        if (d.id.startsWith('doc-10')) {
          await this.deleteDocument(d.id);
        }
      }
      for (const fld of INITIAL_FOLDERS) {
        if (!isIdDeleted(fld.id)) {
          await this.putFolder(fld);
        }
      }
      for (const doc of INITIAL_DOCUMENTS) {
        if (!isIdDeleted(doc.id)) {
          await this.putDocument(doc);
        }
      }
      for (const u of INITIAL_USERS) {
        if (!isIdDeleted(u.id)) {
          await this.putUser(u);
        }
      }
    } else if (docs.length === 0 && flds.length === 0) {
      // First-time setup on a completely fresh browser installation
      for (const fld of INITIAL_FOLDERS) {
        if (!isIdDeleted(fld.id)) {
          await this.putFolder(fld);
        }
      }
      for (const doc of INITIAL_DOCUMENTS) {
        if (!isIdDeleted(doc.id)) {
          await this.putDocument(doc);
        }
      }
      for (const log of INITIAL_AUDIT_LOGS) {
        await this.addAuditLog(log);
      }
      for (const tck of INITIAL_TICKETS) {
        await this.putTicket(tck);
      }
      for (const u of INITIAL_USERS) {
        if (!isIdDeleted(u.id)) {
          await this.putUser(u);
        }
      }
    }
  }

  // Document Operations
  public async getAllDocuments(): Promise<ArchiveDocument[]> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('documents', 'readonly');
      const store = tx.objectStore('documents');
      const request = store.getAll();
      request.onsuccess = () => {
        const list = (request.result || []).filter((d: ArchiveDocument) => !isIdDeleted(d.id));
        resolve(list);
      };
      request.onerror = () => reject(request.error);
    });
  }

  public async putDocument(doc: ArchiveDocument): Promise<void> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('documents', 'readwrite');
      const store = tx.objectStore('documents');
      const request = store.put(doc);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async deleteDocument(id: string): Promise<void> {
    await this.ensureReady();
    markIdAsDeleted(id);
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('documents', 'readwrite');
      const store = tx.objectStore('documents');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Audit Logs
  public async getAuditLogs(): Promise<AuditLogEntry[]> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('auditLogs', 'readonly');
      const store = tx.objectStore('auditLogs');
      const request = store.getAll();
      request.onsuccess = () => {
        const list = request.result || [];
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        resolve(list);
      };
      request.onerror = () => reject(request.error);
    });
  }

  public async addAuditLog(entry: AuditLogEntry): Promise<void> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('auditLogs', 'readwrite');
      const store = tx.objectStore('auditLogs');
      const request = store.put(entry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Tickets
  public async getTickets(): Promise<SupportTicket[]> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('tickets', 'readonly');
      const store = tx.objectStore('tickets');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  public async putTicket(ticket: SupportTicket): Promise<void> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('tickets', 'readwrite');
      const store = tx.objectStore('tickets');
      const request = store.put(ticket);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Users
  public async getUsers(): Promise<User[]> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('users', 'readonly');
      const store = tx.objectStore('users');
      const request = store.getAll();
      request.onsuccess = () => {
        const list = (request.result || []).filter((u: User) => !isIdDeleted(u.id));
        resolve(list);
      };
      request.onerror = () => reject(request.error);
    });
  }

  public async putUser(user: User): Promise<void> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('users', 'readwrite');
      const store = tx.objectStore('users');
      const request = store.put(user);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async deleteUser(id: string): Promise<void> {
    await this.ensureReady();
    markIdAsDeleted(id);
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('users', 'readwrite');
      const store = tx.objectStore('users');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // System Diagnostics Error Logs
  public async getErrorLogs(): Promise<SystemErrorLog[]> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('errorLogs', 'readonly');
      const store = tx.objectStore('errorLogs');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  public async addErrorLog(log: SystemErrorLog): Promise<void> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('errorLogs', 'readwrite');
      const store = tx.objectStore('errorLogs');
      const request = store.put(log);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async clearErrorLogs(): Promise<void> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('errorLogs', 'readwrite');
      const store = tx.objectStore('errorLogs');
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Folder Operations
  public async getAllFolders(): Promise<ArchiveFolder[]> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('folders', 'readonly');
      const store = tx.objectStore('folders');
      const request = store.getAll();
      request.onsuccess = () => {
        const list = (request.result || []).filter((f: ArchiveFolder) => !isIdDeleted(f.id));
        resolve(list);
      };
      request.onerror = () => reject(request.error);
    });
  }

  public async putFolder(folder: ArchiveFolder): Promise<void> {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('folders', 'readwrite');
      const store = tx.objectStore('folders');
      const request = store.put(folder);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async deleteFolder(id: string): Promise<void> {
    await this.ensureReady();
    markIdAsDeleted(id);
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('folders', 'readwrite');
      const store = tx.objectStore('folders');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Backup Export
  public async exportAllData(): Promise<{
    folders: ArchiveFolder[];
    documents: ArchiveDocument[];
    auditLogs: AuditLogEntry[];
    tickets: SupportTicket[];
    users: User[];
  }> {
    const folders = await this.getAllFolders();
    const documents = await this.getAllDocuments();
    const auditLogs = await this.getAuditLogs();
    const tickets = await this.getTickets();
    const users = await this.getUsers();
    return { folders, documents, auditLogs, tickets, users };
  }

  // Restore Import
  public async importAllData(data: {
    folders?: ArchiveFolder[];
    documents: ArchiveDocument[];
    auditLogs?: AuditLogEntry[];
    tickets?: SupportTicket[];
    users?: User[];
  }): Promise<void> {
    await this.ensureReady();
    if (data.folders) {
      for (const folder of data.folders) {
        await this.putFolder(folder);
      }
    }
    for (const doc of data.documents) {
      await this.putDocument(doc);
    }
    if (data.auditLogs) {
      for (const log of data.auditLogs) {
        await this.addAuditLog(log);
      }
    }
    if (data.tickets) {
      for (const ticket of data.tickets) {
        await this.putTicket(ticket);
      }
    }
    if (data.users) {
      for (const user of data.users) {
        await this.putUser(user);
      }
    }
  }

  private async ensureReady() {
    if (!this.db) {
      await this.init();
    }
  }
}

export const dbService = new DatabaseService();
