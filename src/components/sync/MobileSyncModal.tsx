import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Smartphone,
  Wifi,
  Copy,
  Check,
  RefreshCw,
  Camera,
  Layers,
  ArrowRightLeft,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileSyncModalProps {
  onClose: () => void;
}

export const MobileSyncModal: React.FC<MobileSyncModalProps> = ({ onClose }) => {
  const { syncStatus, triggerSync, t, language, addDocument, currentUser } = useApp();
  const isArabic = language === 'ar';

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [mobileSimulatorActive, setMobileSimulatorActive] = useState(false);

  // Mobile companion form simulator
  const [simDocTitle, setSimDocTitle] = useState('');
  const [simDocDept, setSimDocDept] = useState('إدارة العمليات الميدانية');
  const [simSending, setSimSending] = useState(false);
  const [simSuccess, setSimSuccess] = useState(false);

  const localUrl = `http://${syncStatus.lanIp}`;

  useEffect(() => {
    // Generate QR Code containing connection schema for Android companion app
    const connectionPayload = JSON.stringify({
      protocol: 'arsheef-lan-sync-v1',
      app: 'Arsheef Pro Enterprise',
      url: localUrl,
      pin: syncStatus.pinCode,
      peerId: 'desktop-host-01',
      timestamp: Date.now(),
    });

    QRCode.toDataURL(connectionPayload, {
      margin: 1,
      width: 220,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).then(setQrDataUrl);
  }, [localUrl, syncStatus.pinCode]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(localUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Simulate Android Phone Mobile Companion pushing document directly to Desktop DB
  const handleSimulateMobilePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simDocTitle.trim()) return;

    setSimSending(true);
    setSimSuccess(false);

    try {
      await addDocument({
        code: `MOB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        title: simDocTitle,
        description: isArabic
          ? 'تم المسح الضوئي والإرسال لاسلكياً عبر هاتف أندرويد (تزامن لحظي محلي)'
          : 'Scanned and synced in real-time from Android mobile companion over LAN',
        category: 'المسح الميداني السريع',
        department: simDocDept,
        classification: 'internal',
        status: 'active',
        physicalLocation: 'وارد الأندرويد اللاسلكي - محطة الأرشفة المركزية',
        tags: ['أندرويد', 'تزامن محلي', 'مسح لاسلكي'],
        documentDate: new Date().toISOString().slice(0, 10),
        ocrText: `Android Cam OCR: ${simDocTitle}\nDevice: Samsung Galaxy S24 / Android OS\nSync Protocol: P2P Local Broadcast`,
        createdBy: `${currentUser.name} (عبر هاتف الأندرويد)`,
        attachments: [],
      });

      triggerSync();
      setSimSuccess(true);
      setSimDocTitle('');
      setTimeout(() => setSimSuccess(false), 3000);
    } finally {
      setSimSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                {t.syncModalTitle}
              </h2>
              <p className="text-[11px] text-neutral-500">
                {isArabic ? 'ربط مباشر عبر شبكة الواي فاي المحلية بدون سيرفر خارجي' : 'Direct LAN synchronization via local WiFi without external cloud'}
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

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* QR Code Presentation */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-neutral-200/80 mb-3">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Android Sync QR Code" className="w-44 h-44 rounded-xl" />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-xs text-neutral-400">
                    Generating QR...
                  </div>
                )}
              </div>

              <span className="text-xs font-bold text-neutral-900 dark:text-white mb-0.5">
                {isArabic ? 'امسح الكود بكاميرا الأندرويد' : 'Scan with Android Camera'}
              </span>
              <p className="text-[11px] text-neutral-500 max-w-[200px] leading-relaxed">
                {isArabic ? 'يفتح شاشة المسح اللاسلكي المباشر ويربط الهاتف بالحاسوب' : 'Instantly connects mobile scanner to desktop database'}
              </p>
            </div>

            {/* Connection Parameters */}
            <div className="space-y-4 text-xs">
              {/* Local Network IP & URL */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                  {t.localNetworkIp}
                </label>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono">
                  <span className="flex-1 text-neutral-900 dark:text-neutral-100 font-semibold truncate">
                    {localUrl}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="p-1 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                    title="Copy URL"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Security PIN */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                  {t.securityPairingPin}
                </label>
                <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 flex items-center justify-between font-mono">
                  <span className="text-base font-bold text-blue-700 dark:text-blue-300 tracking-wider">
                    {syncStatus.pinCode}
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-semibold">
                    {isArabic ? 'تأمين مشفر' : 'AES Protected'}
                  </span>
                </div>
              </div>

              {/* Status and Active Peers */}
              <div className="space-y-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{t.connectionStatus}</span>
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {t.instantSyncActive}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-500">
                  <span>{t.connectedClients}:</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">
                    {syncStatus.activePeers} {isArabic ? 'أجهزة أندرويد' : 'devices'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-500">
                  <span>{isArabic ? 'الحزم المتزامنة:' : 'Packets Transferred:'}</span>
                  <span className="font-mono text-neutral-900 dark:text-white">
                    {syncStatus.packetsExchanged}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => setMobileSimulatorActive(!mobileSimulatorActive)}
                  className="w-full py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {mobileSimulatorActive
                      ? (isArabic ? 'إخفاء محاكي شاشة الأندرويد' : 'Hide Android Simulator')
                      : (isArabic ? 'تجربة إرسال وثيقة من هاتف الأندرويد الآن' : 'Test Android Mobile Push Simulation')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Android Mobile Companion Push Simulator */}
          {mobileSimulatorActive && (
            <div className="p-4 rounded-2xl bg-neutral-900 text-white border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>{isArabic ? 'محاكي هاتف الأندرويد (تطبيق المسح الميداني)' : 'Android Mobile Scanner Companion Simulator'}</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Connected to {localUrl}
                </span>
              </div>

              <form onSubmit={handleSimulateMobilePush} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-neutral-300 mb-1">
                    {isArabic ? 'عنوان الوثيقة الممسوحة بالهاتف' : 'Document Title Captured on Mobile'}
                  </label>
                  <input
                    type="text"
                    value={simDocTitle}
                    onChange={e => setSimDocTitle(e.target.value)}
                    placeholder={isArabic ? 'مثال: فحص ميداني ومعاينة توريد أجهزة' : 'e.g. Field Inspection Report #441'}
                    required
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:ring-1 focus:ring-sky-400"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={simDocDept}
                      onChange={e => setSimDocDept(e.target.value)}
                      placeholder="القسم"
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={simSending}
                    className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{simSending ? (isArabic ? 'جاري البث...' : 'Syncing...') : (isArabic ? 'إرسال للحاسوب فوراً' : 'Push to Desktop')}</span>
                  </button>
                </div>

                {simSuccess && (
                  <p className="text-xs text-emerald-400 font-medium">
                    {isArabic ? '✓ تم إرسال الوثيقة وتحديث قاعدة بيانات الكمبيوتر فوراً!' : '✓ Document synced directly into desktop archive!'}
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
