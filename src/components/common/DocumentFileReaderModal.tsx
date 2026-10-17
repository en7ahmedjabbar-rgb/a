import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCode,
  File,
  Search,
  ExternalLink,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { DocumentAttachment } from '../../types';
import { useApp } from '../../context/AppContext';

interface DocumentFileReaderModalProps {
  attachment: DocumentAttachment | null;
  onClose: () => void;
}

export const DocumentFileReaderModal: React.FC<DocumentFileReaderModalProps> = ({
  attachment,
  onClose,
}) => {
  const { language } = useApp();
  const isArabic = language === 'ar';

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  // Word state
  const [wordHtml, setWordHtml] = useState<string | null>(null);
  const [wordLoading, setWordLoading] = useState(false);
  const [wordError, setWordError] = useState<string | null>(null);

  // Excel state
  const [excelSheets, setExcelSheets] = useState<{ name: string; data: (string | number)[][] }[]>([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelError, setExcelError] = useState<string | null>(null);
  const [excelSearch, setExcelSearch] = useState('');

  if (!attachment) return null;

  // Determine file type category
  const fileExt = attachment.name.split('.').pop()?.toLowerCase() || '';
  const isPdf = attachment.type.includes('pdf') || fileExt === 'pdf';
  const isWord =
    fileExt === 'docx' ||
    fileExt === 'doc' ||
    attachment.type.includes('word') ||
    attachment.type.includes('officedocument.wordprocessingml');
  const isExcel =
    fileExt === 'xlsx' ||
    fileExt === 'xls' ||
    fileExt === 'csv' ||
    attachment.type.includes('sheet') ||
    attachment.type.includes('excel') ||
    attachment.type.includes('csv');
  const isImage =
    attachment.type.startsWith('image/') ||
    ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'bmp'].includes(fileExt);
  const isText =
    attachment.type.startsWith('text/') ||
    ['txt', 'json', 'log', 'xml', 'md'].includes(fileExt);

  // Parse Word documents (.docx)
  useEffect(() => {
    if (!isWord || !attachment.dataUrl) return;

    setWordLoading(true);
    setWordError(null);

    try {
      // Extract base64 part
      const base64Data = attachment.dataUrl.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid file data URL');
      }
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      mammoth
        .convertToHtml({ arrayBuffer: bytes.buffer })
        .then(result => {
          setWordHtml(result.value);
          setWordLoading(false);
        })
        .catch(err => {
          console.error('Word rendering error:', err);
          setWordError(isArabic ? 'تعذر قراءة مستند Word. يمكنك تحميل الملف وفتحه على جهازك.' : 'Failed to parse Word document.');
          setWordLoading(false);
        });
    } catch (err: any) {
      console.error('Word parse error:', err);
      setWordError(isArabic ? 'صيغة الملف غير متوافقة مع القارئ المباشر.' : 'Incompatible Word document format.');
      setWordLoading(false);
    }
  }, [attachment, isWord, isArabic]);

  // Parse Excel spreadsheets (.xlsx, .xls, .csv)
  useEffect(() => {
    if (!isExcel || !attachment.dataUrl) return;

    setExcelLoading(true);
    setExcelError(null);

    try {
      const base64Data = attachment.dataUrl.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid file data URL');
      }

      const workbook = XLSX.read(base64Data, { type: 'base64' });
      const sheets = workbook.SheetNames.map(name => {
        const sheet = workbook.Sheets[name];
        const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        return {
          name,
          data: rawRows,
        };
      });

      setExcelSheets(sheets);
      setSelectedSheetIndex(0);
      setExcelLoading(false);
    } catch (err: any) {
      console.error('Excel parse error:', err);
      setExcelError(isArabic ? 'تعذر قراءة جدول الإكسل. يمكنك تحميل الملف وفتحه على جهازك.' : 'Failed to parse Excel file.');
      setExcelLoading(false);
    }
  }, [attachment, isExcel, isArabic]);

  // Download handler
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = attachment.dataUrl;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Filtered Excel Rows
  const currentSheet = excelSheets[selectedSheetIndex];
  const filteredExcelRows = useMemo(() => {
    if (!currentSheet) return [];
    if (!excelSearch.trim()) return currentSheet.data;
    const query = excelSearch.toLowerCase();
    return currentSheet.data.filter((row, idx) => {
      if (idx === 0) return true; // keep header
      return row.some(cell => String(cell).toLowerCase().includes(query));
    });
  }, [currentSheet, excelSearch]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileBadge = () => {
    if (isWord) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-[10px] font-bold">
          <FileText className="w-3 h-3 text-blue-600" />
          مستند Word (.docx)
        </span>
      );
    }
    if (isExcel) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold">
          <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
          جدول Excel (.xlsx)
        </span>
      );
    }
    if (isPdf) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 text-[10px] font-bold">
          <FileText className="w-3 h-3 text-red-600" />
          وثيقة PDF
        </span>
      );
    }
    if (isImage) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 text-[10px] font-bold">
          <ImageIcon className="w-3 h-3 text-purple-600" />
          صورة / مسح ضوئي
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 text-[10px] font-bold">
        <FileCode className="w-3 h-3 text-neutral-500" />
        ملف نصي
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-150">
      <div
        className={`relative rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen ? 'w-screen h-screen rounded-none' : 'w-full max-w-5xl h-[88vh]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/90 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {getFileBadge()}
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate max-w-xs sm:max-w-md">
                {attachment.name}
              </h2>
              <span className="text-[10px] text-neutral-400 font-mono">
                {formatSize(attachment.size)} · {new Date(attachment.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Image zoom & rotate controls */}
            {isImage && (
              <>
                <button
                  onClick={() => setZoom(prev => Math.max(prev - 25, 50))}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
                  title="تصغير"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono text-neutral-500 px-1">{zoom}%</span>
                <button
                  onClick={() => setZoom(prev => Math.min(prev + 25, 250))}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
                  title="تكبير"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
                  title="تدوير 90 درجة"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Direct Local Download Button ("نظام تحميل داخلي") */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              title={isArabic ? 'تحميل الملف داخلياً على جهازك' : 'Download file to device'}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isArabic ? 'تحميل الملف' : 'Download'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
              title={isArabic ? 'طباعة' : 'Print'}
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
              title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-950 flex flex-col relative">
          {/* 1. PDF Viewer */}
          {isPdf && (
            <div className="w-full h-full flex flex-col">
              <iframe
                src={`${attachment.dataUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full border-none flex-1"
                title={attachment.name}
              />
            </div>
          )}

          {/* 2. Image Viewer */}
          {isImage && (
            <div className="w-full h-full flex items-center justify-center p-6 overflow-auto">
              <img
                src={attachment.dataUrl}
                alt={attachment.name}
                className="max-w-full max-h-full object-contain transition-transform duration-200 rounded-lg shadow-md"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                }}
              />
            </div>
          )}

          {/* 3. Word Document Viewer (.docx) */}
          {isWord && (
            <div className="w-full h-full overflow-y-auto p-4 sm:p-8 flex justify-center">
              {wordLoading ? (
                <div className="flex flex-col items-center justify-center p-12 text-neutral-500">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
                  <span className="text-xs">{isArabic ? 'جاري فتح وقراءة مستند Word...' : 'Opening Word document...'}</span>
                </div>
              ) : wordError ? (
                <div className="p-8 text-center max-w-md bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 m-auto shadow-sm">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 mb-4">{wordError}</p>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    {isArabic ? 'تحميل المستند لفتحه في Microsoft Word' : 'Download Word file'}
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-4xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-8 sm:p-12 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 leading-relaxed font-serif prose dark:prose-invert max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: wordHtml || '<p class="text-neutral-400">مستند فارغ</p>' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* 4. Excel Spreadsheet Viewer (.xlsx, .xls, .csv) */}
          {isExcel && (
            <div className="w-full h-full flex flex-col overflow-hidden">
              {excelLoading ? (
                <div className="flex flex-col items-center justify-center p-12 text-neutral-500 m-auto">
                  <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                  <span className="text-xs">{isArabic ? 'جاري قراءة وتحليل بيانات جدول Excel...' : 'Parsing spreadsheet...'}</span>
                </div>
              ) : excelError ? (
                <div className="p-8 text-center max-w-md bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 m-auto shadow-sm">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 mb-4">{excelError}</p>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    {isArabic ? 'تحميل جدول الإكسل لفتحه في Excel' : 'Download Excel file'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Search inside sheet bar */}
                  <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={excelSearch}
                        onChange={e => setExcelSearch(e.target.value)}
                        placeholder={isArabic ? 'بحث في خلايا الجدول...' : 'Search cells...'}
                        className="w-full ps-8 pe-3 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      {isArabic ? `${filteredExcelRows.length} صفوف` : `${filteredExcelRows.length} rows`}
                    </span>
                  </div>

                  {/* Excel Grid Table */}
                  <div className="flex-1 overflow-auto bg-white dark:bg-neutral-900">
                    <table className="w-full border-collapse text-xs font-mono">
                      <tbody>
                        {filteredExcelRows.map((row, rIdx) => {
                          const isHeader = rIdx === 0;
                          return (
                            <tr
                              key={rIdx}
                              className={
                                isHeader
                                  ? 'bg-neutral-100 dark:bg-neutral-800 font-bold sticky top-0 border-b border-neutral-300 dark:border-neutral-700 z-10'
                                  : 'border-b border-neutral-100 dark:border-neutral-800/60 hover:bg-blue-50/40 dark:hover:bg-blue-950/20'
                              }
                            >
                              {/* Row Number */}
                              <td className="w-10 px-2 py-1.5 text-[10px] text-neutral-400 bg-neutral-50 dark:bg-neutral-850 border-e border-neutral-200 dark:border-neutral-700 text-center select-none">
                                {rIdx + 1}
                              </td>
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="px-3 py-1.5 border-e border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 whitespace-nowrap max-w-xs truncate"
                                  title={String(cell)}
                                >
                                  {String(cell)}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Sheet Tabs at bottom */}
                  {excelSheets.length > 1 && (
                    <div className="flex items-center gap-1 px-3 py-1.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-850 overflow-x-auto">
                      <span className="text-[10px] text-neutral-500 font-bold px-1">
                        {isArabic ? 'أوراق العمل:' : 'Sheets:'}
                      </span>
                      {excelSheets.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedSheetIndex(idx);
                            setExcelSearch('');
                          }}
                          className={`px-3 py-1 text-xs font-semibold rounded-t-lg transition cursor-pointer ${
                            selectedSheetIndex === idx
                              ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                              : 'text-neutral-600 dark:text-neutral-400 hover:bg-white/50'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* 5. Generic Text / Monospace Viewer */}
          {isText && (
            <div className="w-full h-full p-6 overflow-auto">
              <pre className="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
                {atob(attachment.dataUrl.split(',')[1] || '')}
              </pre>
            </div>
          )}

          {/* 6. Unsupported format fallback */}
          {!isPdf && !isImage && !isWord && !isExcel && !isText && (
            <div className="m-auto text-center p-8 max-w-sm bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <File className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                {attachment.name}
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                {isArabic
                  ? 'هذا الملف محفوظ داخل الأرشيف. يمكنك تحميله وحفظه على حاسوبك مباشرة.'
                  : 'File is stored in archive. You can download and open locally.'}
              </p>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs hover:bg-blue-700 transition"
              >
                <Download className="w-4 h-4" />
                <span>{isArabic ? 'تحميل وحفظ الملف' : 'Download File'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
