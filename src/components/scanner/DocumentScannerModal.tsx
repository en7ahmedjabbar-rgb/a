import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  X,
  Camera,
  Upload,
  RefreshCw,
  Sliders,
  Check,
  FileText,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DocumentScannerModalProps {
  onClose: () => void;
  onSaveToArchive: (scannedData: {
    title: string;
    ocrText: string;
    imagePreview: string;
  }) => void;
}

type FilterMode = 'original' | 'document_bw' | 'grayscale' | 'sharp';

export const DocumentScannerModal: React.FC<DocumentScannerModalProps> = ({
  onClose,
  onSaveToArchive,
}) => {
  const { t, language, logAuditEvent } = useApp();
  const isArabic = language === 'ar';

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('document_bw');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [extractedTitle, setExtractedTitle] = useState('');
  const [extractedOcrText, setExtractedOcrText] = useState('');

  // Start Camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      console.warn('Camera access error:', err);
      setCameraError(
        isArabic
          ? 'تعذر الوصول إلى الكاميرا. يمكنك رفع صورة المستند من القرص بدلاً من ذلك.'
          : 'Camera access denied or unavailable. You can upload a document image instead.'
      );
      setCameraActive(false);
    }
  }, [isArabic]);

  // Stop Camera on unmount
  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle Capture
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    applyFilterToCanvas(ctx, canvas.width, canvas.height, filterMode);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);

    // Stop video tracks while previewing
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }

    // Trigger OCR simulation
    runOcrExtraction();
  };

  // Handle File Upload as Scan
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        applyFilterToCanvas(ctx, canvas.width, canvas.height, filterMode);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setCapturedImage(dataUrl);

        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setCameraActive(false);
        }

        runOcrExtraction();
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Image Processing Filters (Pure Canvas math)
  const applyFilterToCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    mode: FilterMode
  ) => {
    if (mode === 'original') return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      if (mode === 'grayscale') {
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      } else if (mode === 'document_bw') {
        // High Contrast Document Threshold
        const v = gray > 130 ? 255 : 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
      } else if (mode === 'sharp') {
        // High contrast boost
        const factor = 1.3;
        data[i] = Math.min(255, Math.max(0, (r - 128) * factor + 128));
        data[i + 1] = Math.min(255, Math.max(0, (g - 128) * factor + 128));
        data[i + 2] = Math.min(255, Math.max(0, (b - 128) * factor + 128));
      }
    }
    ctx.putImageData(imgData, 0, 0);
  };

  // OCR Recognition Simulation
  const runOcrExtraction = () => {
    setIsProcessingOcr(true);
    setTimeout(() => {
      const sampleTitles = [
        'محضر استلام وتوريد معدات تقنية أصلية - محطة رقم 402',
        'عقد اتفاقية الصيانة الشاملة للتجهيزات الإلكترونية',
        'قرار إداري رقم 88/2026 بشأن اعتماد نظام الأرشفة المركزي',
        'تقرير المطابقة والمواصفات القياسية - ديوان الرقابة',
      ];
      const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];

      const sampleText = isArabic
        ? `جمهورية العراق - الإدارة العامة للتوثيق والأرشفة.\nالموضوع: ${randomTitle}\nالرقم الإشاري: REF-${Date.now().toString().slice(-6)}\nالتاريخ: ${new Date().toISOString().slice(0, 10)}\n\nبموجب الصلاحيات المخولة ووفقاً لتعليمات حفظ الوثائق الرسمية، تقرر اعتماد كافة البنود الواردة في هذا المستند وختمه بالبصمة الرقمية المعتمدة.`
        : `DOCUMENT RECORD & VERIFICATION CERTIFICATE\nSubject: Official Executive Endorsement\nRef Number: REF-${Date.now().toString().slice(-6)}\nDate: ${new Date().toISOString().slice(0, 10)}\n\nPursuant to enterprise archival regulations, this document has been scanned and verified under tamper-evident compliance.`;

      setExtractedTitle(randomTitle);
      setExtractedOcrText(sampleText);
      setIsProcessingOcr(false);

      logAuditEvent('SCAN', 'OPTICAL_SCANNER', `مسح وثيقة ضوئياً واستخراج النصوص: ${randomTitle}`);
    }, 700);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedTitle('');
    setExtractedOcrText('');
    startCamera();
  };

  const handleComplete = () => {
    onSaveToArchive({
      title: extractedTitle || (isArabic ? 'وثيقة ممسوحة ضوئياً' : 'Scanned Document'),
      ocrText: extractedOcrText,
      imagePreview: capturedImage || '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 my-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>{t.scannerTitle}</span>
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {t.scannerSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Viewport */}
        <div className="p-6 space-y-4">
          {/* Hidden Canvas for Processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Viewport Frame */}
          <div className="relative w-full aspect-16/10 rounded-2xl bg-neutral-950 overflow-hidden flex items-center justify-center border border-neutral-800 shadow-inner">
            {!capturedImage ? (
              cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Framing Overlay Guides */}
                  <div className="absolute inset-8 pointer-events-none border-2 border-dashed border-sky-400/60 rounded-xl flex items-center justify-center">
                    <span className="text-[11px] font-medium text-sky-200 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                      {isArabic ? 'حاذِ إطار الوثيقة داخل الخطوط' : 'Align document inside frame'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    {cameraError || (isArabic ? 'جاري تهيئة بث الكاميرا...' : 'Initializing camera stream...')}
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer transition">
                    <Upload className="w-4 h-4" />
                    <span>{t.uploadScanFile}</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )
            ) : (
              /* Preview of captured image */
              <img
                src={capturedImage}
                alt="Captured Document"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Filter Selection Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => setFilterMode('document_bw')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  filterMode === 'document_bw'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {t.filterDocumentBW}
              </button>
              <button
                onClick={() => setFilterMode('grayscale')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  filterMode === 'grayscale'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {t.filterGrayscale}
              </button>
              <button
                onClick={() => setFilterMode('original')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  filterMode === 'original'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {t.filterOriginal}
              </button>
            </div>

            {/* Shutter / Capture Button or Upload */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.uploadScanFile}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {!capturedImage ? (
                <button
                  onClick={handleCapture}
                  disabled={!cameraActive}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t.capturePhoto}</span>
                </button>
              ) : (
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.retakeScan}</span>
                </button>
              )}
            </div>
          </div>

          {/* OCR Result View */}
          {capturedImage && (
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.ocrDetectedText}</span>
                </span>
                {isProcessingOcr && (
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 animate-pulse">
                    {isArabic ? 'جاري تحليل النص بالذكاء الاصطناعي...' : 'Extracting text...'}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                  {isArabic ? 'العنوان المقترح آلياً' : 'Suggested Title'}
                </label>
                <input
                  type="text"
                  value={extractedTitle}
                  onChange={e => setExtractedTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                  {isArabic ? 'النص الكامل المستخرج' : 'Extracted Text'}
                </label>
                <textarea
                  rows={3}
                  value={extractedOcrText}
                  onChange={e => setExtractedOcrText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>
          )}

          {/* Footer Action */}
          {capturedImage && (
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{t.saveScannedDocument}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
