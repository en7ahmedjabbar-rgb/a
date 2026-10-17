import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/auth/LoginView';
import { FoldersView } from './components/folders/FoldersView';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { DocumentList } from './components/documents/DocumentList';
import { DocumentDetailModal } from './components/documents/DocumentDetailModal';
import { DocumentFormModal } from './components/documents/DocumentFormModal';
import { DocumentScannerModal } from './components/scanner/DocumentScannerModal';
import { MobileSyncModal } from './components/sync/MobileSyncModal';
import { UsersPermissionsView } from './components/users/UsersPermissionsView';
import { BackupModal } from './components/backup/BackupModal';
import { TwoFactorModal } from './components/auth/TwoFactorModal';
import { ArchiveDocument } from './types';
import { useOnlineStatus } from './hooks/useOnlineStatus';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, language, isAuthenticated, documents } = useApp();
  const isOnline = useOnlineStatus();
  const isArabic = language === 'ar';

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Modals state - persistent document viewing across updates
  const [selectedDocIdForDetail, setSelectedDocIdForDetail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('arsheef_viewing_doc_id') || null;
    } catch {
      return null;
    }
  });

  const selectedDocForDetail = useMemo(() => {
    if (!selectedDocIdForDetail) return null;
    return documents.find(d => d.id === selectedDocIdForDetail) || null;
  }, [documents, selectedDocIdForDetail]);

  const handleOpenDocDetail = (doc: ArchiveDocument | null) => {
    setSelectedDocIdForDetail(doc ? doc.id : null);
    try {
      if (doc) {
        localStorage.setItem('arsheef_viewing_doc_id', doc.id);
      } else {
        localStorage.removeItem('arsheef_viewing_doc_id');
      }
    } catch {}
  };

  const [selectedDocForEdit, setSelectedDocForEdit] = useState<ArchiveDocument | null>(null);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [scannedTransferData, setScannedTransferData] = useState<{
    title: string;
    ocrText: string;
    imagePreview: string;
  } | null>(null);

  // If user is not authenticated, render dedicated enterprise login view
  if (!isAuthenticated) {
    return <LoginView />;
  }

  const handleScannerSave = (data: { title: string; ocrText: string; imagePreview: string }) => {
    setScannedTransferData(data);
    setIsScannerOpen(false);
    setIsNewDocModalOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            onOpenNewDocModal={() => setIsNewDocModalOpen(true)}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenSync={() => setIsSyncModalOpen(true)}
            onOpenBackup={() => setActiveTab('backup')}
          />
        );
      case 'folders':
        return (
          <FoldersView
            onOpenDocument={doc => handleOpenDocDetail(doc)}
            onOpenNewDocInFolder={(folderId, folderName) => {
              setIsNewDocModalOpen(true);
            }}
          />
        );
      case 'documents':
        return (
          <DocumentList
            onOpenNewDocModal={() => setIsNewDocModalOpen(true)}
            onSelectDocument={doc => handleOpenDocDetail(doc)}
            onEditDocument={doc => setSelectedDocForEdit(doc)}
          />
        );
      case 'scanner':
        return (
          <div className="py-6">
            <DocumentScannerModal
              onClose={() => setActiveTab('documents')}
              onSaveToArchive={handleScannerSave}
            />
          </div>
        );
      case 'sync':
        return (
          <div className="py-6">
            <MobileSyncModal onClose={() => setActiveTab('dashboard')} />
          </div>
        );
      case 'users':
        return <UsersPermissionsView />;
      case 'backup':
        return <BackupModal />;
      default:
        return (
          <DashboardOverview
            onOpenNewDocModal={() => setIsNewDocModalOpen(true)}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenSync={() => setIsSyncModalOpen(true)}
            onOpenBackup={() => setActiveTab('backup')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100/60 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${isArabic ? 'lg:mr-64' : 'lg:ml-64'}`}>
        <Header onOpenMobileMenu={() => setIsMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Offline Toast if offline */}
      {!isOnline && (
        <div className="fixed bottom-4 end-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span>{isArabic ? 'وضع عدم الاتصال: قاعدة البيانات المحلية تعمل بكفاءة' : 'Offline Mode: Local database fully operational'}</span>
        </div>
      )}

      {/* Modals */}
      {selectedDocForDetail && (
        <DocumentDetailModal
          document={selectedDocForDetail}
          onClose={() => handleOpenDocDetail(null)}
          onEdit={doc => {
            handleOpenDocDetail(null);
            setSelectedDocForEdit(doc);
          }}
        />
      )}

      {(isNewDocModalOpen || selectedDocForEdit) && (
        <DocumentFormModal
          documentToEdit={selectedDocForEdit}
          scannedData={scannedTransferData}
          onClose={() => {
            setIsNewDocModalOpen(false);
            setSelectedDocForEdit(null);
            setScannedTransferData(null);
          }}
          onSuccess={() => {
            setIsNewDocModalOpen(false);
            setSelectedDocForEdit(null);
            setScannedTransferData(null);
          }}
        />
      )}

      {isScannerOpen && (
        <DocumentScannerModal
          onClose={() => setIsScannerOpen(false)}
          onSaveToArchive={handleScannerSave}
        />
      )}

      {isSyncModalOpen && (
        <MobileSyncModal onClose={() => setIsSyncModalOpen(false)} />
      )}

      <TwoFactorModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
