import { ArchiveDocument, AuditLogEntry, SupportTicket, SystemErrorLog, User } from '../types';

const DB_NAME = 'ArsheefProEnterpriseDB';
const DB_VERSION = 1;

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin-1',
    name: 'م. أحمد جبار (المدير العام)',
    email: 'en7ahmedjabbar@gmail.com',
    role: 'admin',
    department: 'الإدارة التنفيذية العليا',
    twoFactorEnabled: true,
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'u-officer-1',
    name: 'سارة المنصوري',
    email: 'sara.mansoor@enterprise.local',
    role: 'officer',
    department: 'قسم الأرشفة والتوثيق',
    twoFactorEnabled: true,
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'u-auditor-1',
    name: 'د. كريم الخالدي',
    email: 'karim.khalidi@audit-board.gov',
    role: 'auditor',
    department: 'ديوان الرقابة والامتثال',
    twoFactorEnabled: false,
    createdAt: '2026-02-01T11:00:00Z',
  },
  {
    id: 'u-viewer-1',
    name: 'زائر تدقيق خارجي',
    email: 'visitor@external-audit.com',
    role: 'viewer',
    department: 'المراجعة الخارجية',
    twoFactorEnabled: false,
    createdAt: '2026-03-01T14:00:00Z',
  },
];

export const INITIAL_DOCUMENTS: ArchiveDocument[] = [
  {
    id: 'doc-101',
    code: 'DOC-2026-0842',
    title: 'عقد توريد وتجهيز أنظمة الخوادم ومراكز البيانات السحابية',
    description: 'العقد المبرم مع شركة الحوسبة المتقدمة لتوريد أجهزة التخزين الشبكي SAN وتجهيز غرف الخوادم مع شروط الضمان والصيانة لمدة 5 سنوات.',
    category: 'العقود والاتفاقيات',
    department: 'تقنية المعلومات والشؤون القانونية',
    classification: 'confidential',
    status: 'active',
    physicalLocation: 'الجناح المركزي - رف A-14 - صندوق التخزين 09',
    tags: ['عقود', 'خوادم', 'تقنية المعلومات', 'ضمان 5 سنوات'],
    documentDate: '2026-02-14',
    expiryDate: '2031-02-14',
    ocrText: 'جمهورية العراق - عقد توريد رقم 442/2026 - الطرف الأول: المؤسسة العامة، الطرف الثاني: شركة التقنيات المتقدمة. القيمة الإجمالية: خمسمائة وخمسون ألف دولار أمريكي.',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    createdBy: 'م. أحمد جبار (المدير العام)',
    createdAt: '2026-02-15T10:14:00Z',
    updatedAt: '2026-02-15T10:14:00Z',
    attachments: [
      {
        id: 'att-1',
        name: 'Contract_Servers_DC_Signed.pdf',
        size: 3450000,
        type: 'application/pdf',
        dataUrl: '',
        uploadedAt: '2026-02-15T10:14:00Z',
      },
    ],
    versions: [
      {
        version: '1.0',
        updatedAt: '2026-02-15T10:14:00Z',
        updatedBy: 'م. أحمد جبار (المدير العام)',
        notes: 'النسخة الأصلية الموقعة والمختومة أصولاً',
      },
    ],
  },
  {
    id: 'doc-102',
    code: 'DOC-2026-0319',
    title: 'محضر اجتماع مجلس الإدارة بشأن الموازنة الاستثمارية السنوية',
    description: 'اعتماد الموازنة التشغيلية والاستثمارية للعام المالي 2026-2027 وموافقة أعضاء المجلس بالإجماع على خطة التحول الرقمي الشامل.',
    category: 'قرارات إدارية ومحاضر',
    department: 'أمانة سر مجلس الإدارة',
    classification: 'top_secret',
    status: 'active',
    physicalLocation: 'خزينة الوثائق السرية - القاصة رقم 02',
    tags: ['مجلس الإدارة', 'الموازنة', 'التحول الرقمي', 'قرارات سرية'],
    documentDate: '2026-01-20',
    expiryDate: '2036-01-20',
    ocrText: 'محضر اجتماع مجلس الإدارة رقم 01/2026. المنعقد في القاعة الكبرى. تقرر بالإجماع تخصيص 2.4 مليون دولار لمشاريع الأتمتة والأرشفة المؤسسية.',
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    createdBy: 'سارة المنصوري',
    createdAt: '2026-01-21T08:30:00Z',
    updatedAt: '2026-01-21T08:30:00Z',
    attachments: [],
    versions: [
      {
        version: '1.0',
        updatedAt: '2026-01-21T08:30:00Z',
        updatedBy: 'سارة المنصوري',
        notes: 'المحضر النهائي مصدق بتوقيع رئيس المجلس',
      },
    ],
  },
  {
    id: 'doc-103',
    code: 'DOC-2026-0925',
    title: 'شهادة الاعتماد الدولية للأمن السيبراني ISO/IEC 27001:2022',
    description: 'شهادة المطابقة الصادرة من هيئة التدقيق الدولية للمواصفات والمقاييس بتأكيد استيفاء النظام أعلى معايير أمان وحماية البيانات والخصوصية.',
    category: 'شهادات الجودة والامتثال',
    department: 'قسم الجودة والأمن السيبراني',
    classification: 'public',
    status: 'active',
    physicalLocation: 'الجناح الشرقي - ملفات الجودة رف B-02',
    tags: ['ISO 27001', 'أمن المعلومات', 'شهادات جودة', 'اعتماد رسمي'],
    documentDate: '2026-03-01',
    expiryDate: '2029-03-01',
    ocrText: 'CERTIFICATE OF REGISTRATION: Information Security Management System complies with ISO/IEC 27001:2022. Scope: Enterprise Document Archival & Cryptographic Systems.',
    hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    createdBy: 'د. كريم الخالدي',
    createdAt: '2026-03-02T13:45:00Z',
    updatedAt: '2026-03-02T13:45:00Z',
    attachments: [],
    versions: [
      {
        version: '1.0',
        updatedAt: '2026-03-02T13:45:00Z',
        updatedBy: 'د. كريم الخالدي',
        notes: 'الشهادة المعتمدة الأصلية الصادرة عن هيئة UKAS',
      },
    ],
  },
  {
    id: 'doc-104',
    code: 'DOC-2025-1188',
    title: 'تقرير التدقيق المالي الختامي وميزان المراجعة السنوي',
    description: 'تقرير مدققي الحسابات القانونيين المستقلين حول القوائم المالية الموحدة وبيان التدفقات النقدية والأرباح المحتجزة.',
    category: 'التقارير المالية والضريبية',
    department: 'الإدارة المالية والمحاسبة',
    classification: 'confidential',
    status: 'archived',
    physicalLocation: 'المخزن الدائم - الرف المالي F-08',
    tags: ['تدقيق مالي', 'ميزان مراجعة', 'تقارير محاسبية', '2025'],
    documentDate: '2025-12-30',
    expiryDate: '2035-12-30',
    ocrText: 'تقرير مراقب الحسابات المستقل: تعبر القوائم المالية بصورة صادقة وعادلة عن المركز المالي لكافة الفروع في 31 ديسمبر 2025.',
    hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    createdBy: 'سارة المنصوري',
    createdAt: '2026-01-05T12:00:00Z',
    updatedAt: '2026-01-05T12:00:00Z',
    attachments: [],
    versions: [
      {
        version: '1.0',
        updatedAt: '2026-01-05T12:00:00Z',
        updatedBy: 'سارة المنصوري',
        notes: 'أرشيف مالي نهائي مغلق',
      },
    ],
  },
  {
    id: 'doc-105',
    code: 'DOC-2026-0104',
    title: 'المخططات الهندسية ورخصة البناء للمجمع التقني الجديد',
    description: 'المخططات المعمارية والإنشائية ومخططات الدفاع المدني والتراخيص البلدية المعتمدة لإنشاء المجمع الذكي لتقنية المعلومات.',
    category: 'المخططات والتراخيص الهندسية',
    department: 'الإدارة الهندسية والمشاريع',
    classification: 'internal',
    status: 'pending_review',
    physicalLocation: 'أدراج المخططات الهندسية الكبرى - درج D-01',
    tags: ['هندسة', 'رخصة بناء', 'مخططات إنشائية', 'دفاع مدني'],
    documentDate: '2026-02-28',
    expiryDate: '2040-02-28',
    ocrText: 'أمانة العاصمة - دائرة التخطيط العمراني. رخصة بناء مجمع تقني متعدد الطوابق رقم 991204/2026 بموجب الاشتراطات الكودية الحديثة.',
    hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    createdBy: 'م. أحمد جبار (المدير العام)',
    createdAt: '2026-03-01T09:15:00Z',
    updatedAt: '2026-03-01T09:15:00Z',
    attachments: [],
    versions: [
      {
        version: '1.0',
        updatedAt: '2026-03-01T09:15:00Z',
        updatedBy: 'م. أحمد جبار (المدير العام)',
        notes: 'قيد الاعتماد النهائي من هيئة التخطيط',
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
    const docs = await this.getAllDocuments();
    if (docs.length === 0) {
      for (const doc of INITIAL_DOCUMENTS) {
        await this.putDocument(doc);
      }
      for (const log of INITIAL_AUDIT_LOGS) {
        await this.addAuditLog(log);
      }
      for (const tck of INITIAL_TICKETS) {
        await this.putTicket(tck);
      }
      for (const u of INITIAL_USERS) {
        await this.putUser(u);
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
      request.onsuccess = () => resolve(request.result || []);
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
      request.onsuccess = () => resolve(request.result || []);
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

  // Backup Export
  public async exportAllData(): Promise<{
    documents: ArchiveDocument[];
    auditLogs: AuditLogEntry[];
    tickets: SupportTicket[];
    users: User[];
  }> {
    const documents = await this.getAllDocuments();
    const auditLogs = await this.getAuditLogs();
    const tickets = await this.getTickets();
    const users = await this.getUsers();
    return { documents, auditLogs, tickets, users };
  }

  // Restore Import
  public async importAllData(data: {
    documents: ArchiveDocument[];
    auditLogs?: AuditLogEntry[];
    tickets?: SupportTicket[];
    users?: User[];
  }): Promise<void> {
    await this.ensureReady();
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
