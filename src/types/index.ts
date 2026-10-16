export type Language = 'ar' | 'en';
export type Theme = 'dark' | 'light' | 'system';

export type UserRole = 'admin' | 'officer' | 'auditor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export type DocumentClassification = 'public' | 'internal' | 'confidential' | 'top_secret';

export type DocumentStatus = 'active' | 'archived' | 'pending_review' | 'disposed';

export interface DocumentAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  uploadedAt: string;
  isScanned?: boolean;
}

export interface DocumentVersion {
  version: string;
  updatedAt: string;
  updatedBy: string;
  notes: string;
}

export interface ArchiveDocument {
  id: string;
  code: string; // e.g. DOC-2026-0012
  title: string;
  description: string;
  category: string;
  department: string;
  classification: DocumentClassification;
  status: DocumentStatus;
  physicalLocation: string; // e.g. Archive Wing A - Shelf 04 - Box 18
  tags: string[];
  documentDate: string;
  expiryDate?: string;
  ocrText?: string;
  hash: string; // SHA-256 integrity checksum
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attachments: DocumentAttachment[];
  versions: DocumentVersion[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'SCAN' | 'BACKUP' | 'RESTORE' | 'LOGIN' | 'AUTH_2FA';
  targetResource: string;
  details: string;
  ipAddress: string;
  hashSignature: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'system' | 'sync' | 'scanner' | 'database' | 'security' | 'other';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  responses: {
    id: string;
    senderName: string;
    senderRole: string;
    message: string;
    createdAt: string;
  }[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export interface SystemErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  source: string;
  stack?: string;
}

export interface BackupMetadata {
  version: string;
  timestamp: string;
  documentCount: number;
  auditCount: number;
  isEncrypted: boolean;
  checksum: string;
}
