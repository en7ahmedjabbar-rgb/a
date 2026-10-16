import React, { useState } from 'react';
import {
  Code2,
  Play,
  CheckCircle,
  Copy,
  Check,
  Server,
  Download,
  Terminal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  summary: string;
  summaryEn: string;
  description: string;
  requestBodySample?: string;
  responseSample: string;
}

export const ApiExplorerView: React.FC = () => {
  const { documents, auditLogs, syncStatus, t, language } = useApp();
  const isArabic = language === 'ar';

  const [activeMethod, setActiveMethod] = useState<'GET' | 'POST'>('GET');
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);

  const endpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/api/v1/documents',
      summary: 'استرجاع قائمة الوثائق المؤرشفة مع التصفية والبحث',
      summaryEn: 'Retrieve list of archived documents with search & filters',
      description: 'Returns all verified documents including metadata, SHA-256 integrity checksums, and physical location coordinates.',
      responseSample: JSON.stringify(
        {
          status: 'success',
          count: documents.length,
          data: documents.slice(0, 2),
        },
        null,
        2
      ),
    },
    {
      method: 'POST',
      path: '/api/v1/documents',
      summary: 'أرشفة وثيقة رسمية جديدة عبر الـ API',
      summaryEn: 'Archive a new document programmatically',
      description: 'Accepts document payload, verifies digital signature, stores to IndexedDB and triggers real-time LAN broadcast.',
      requestBodySample: JSON.stringify(
        {
          code: 'DOC-2026-9901',
          title: 'اتفاقية الشراكة الاستراتيجية والتطوير الرقمي',
          category: 'العقود والاتفاقيات',
          department: 'الشؤون القانونية',
          classification: 'confidential',
          physicalLocation: 'الجناح المركزي - رف 02',
          tags: ['عقود', 'شراكة'],
        },
        null,
        2
      ),
      responseSample: JSON.stringify(
        {
          status: 'success',
          message: 'Document archived and hash verified',
          recordId: 'doc-17482910',
          hash: 'a5c71b489ef09238472918bcde01827491028472819203847591028374950182',
        },
        null,
        2
      ),
    },
    {
      method: 'GET',
      path: '/api/v1/sync/status',
      summary: 'فحص حالة التزامن اللحظي عبر الشبكة المحلية (LAN Heartbeat)',
      summaryEn: 'Check real-time LAN synchronization heartbeat',
      description: 'Returns live connected peers, active LAN IP, and packet throughput counter.',
      responseSample: JSON.stringify(
        {
          status: 'online',
          lanIp: syncStatus.lanIp,
          activePeers: syncStatus.activePeers,
          packetsExchanged: syncStatus.packetsExchanged,
          isSynced: true,
        },
        null,
        2
      ),
    },
    {
      method: 'GET',
      path: '/api/v1/audit/logs',
      summary: 'استرجاع سجلات الرقابة والامتثال ISO 27001',
      summaryEn: 'Retrieve immutable ISO 27001 audit logs',
      description: 'Fetches cryptographic audit trail for external oversight and compliance monitoring.',
      responseSample: JSON.stringify(
        {
          status: 'success',
          totalEntries: auditLogs.length,
          logs: auditLogs.slice(0, 2),
        },
        null,
        2
      ),
    },
  ];

  const currentEndpoint = endpoints[selectedEndpointIndex] || endpoints[0];

  const handleExecuteRequest = () => {
    setIsExecuting(true);
    setTestResponse(null);

    setTimeout(() => {
      // Dynamic live response based on real state
      if (currentEndpoint.path === '/api/v1/documents') {
        setTestResponse(
          JSON.stringify(
            {
              status: 200,
              ok: true,
              timestamp: new Date().toISOString(),
              totalArchived: documents.length,
              documents: documents.slice(0, 3),
            },
            null,
            2
          )
        );
      } else if (currentEndpoint.path === '/api/v1/sync/status') {
        setTestResponse(
          JSON.stringify(
            {
              status: 200,
              ok: true,
              lanNode: syncStatus.lanIp,
              connectedPeers: syncStatus.activePeers,
              packets: syncStatus.packetsExchanged,
              heartbeat: 'NOMINAL',
            },
            null,
            2
          )
        );
      } else {
        setTestResponse(currentEndpoint.responseSample);
      }
      setIsExecuting(false);
    }, 400);
  };

  const handleCopyOpenApiSpec = () => {
    const spec = {
      openapi: '3.0.3',
      info: {
        title: 'Arsheef Pro Enterprise API',
        version: '2.6.0',
        description: 'REST API for high-availability electronic document archiving and LAN synchronization',
      },
      servers: [{ url: `http://${syncStatus.lanIp}` }],
      paths: {
        '/api/v1/documents': {
          get: { summary: 'List documents' },
          post: { summary: 'Archive document' },
        },
        '/api/v1/sync/status': {
          get: { summary: 'LAN sync heartbeat' },
        },
      },
    };

    navigator.clipboard.writeText(JSON.stringify(spec, null, 2));
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div>
          <h1 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-600" />
            <span>{t.apiDocsTitle}</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {t.apiDocsSubtitle}
          </p>
        </div>

        <button
          onClick={handleCopyOpenApiSpec}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition cursor-pointer"
        >
          {copiedSpec ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedSpec ? (isArabic ? 'تم نسخ المواصفة' : 'Copied') : (isArabic ? 'نسخ مواصفة OpenAPI (JSON)' : 'Copy OpenAPI JSON')}</span>
        </button>
      </div>

      {/* Main 2-Column Split: Endpoints List & Interactive Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Endpoints Navigation */}
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider mb-2">
            {isArabic ? 'نقاط النهاية البرمجية (REST Endpoints)' : 'Available Endpoints'}
          </span>

          <div className="space-y-1.5">
            {endpoints.map((ep, idx) => {
              const isSelected = selectedEndpointIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedEndpointIndex(idx);
                    setTestResponse(null);
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition text-xs space-y-1 ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        ep.method === 'GET'
                          ? 'bg-blue-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {ep.path}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-1">
                    {isArabic ? ep.summary : ep.summaryEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Explorer & Request Runner */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span
                className={`px-2 py-0.5 rounded-md font-bold text-white ${
                  currentEndpoint.method === 'GET' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}
              >
                {currentEndpoint.method}
              </span>
              <span className="font-bold text-neutral-900 dark:text-white">
                {currentEndpoint.path}
              </span>
            </div>

            <button
              onClick={handleExecuteRequest}
              disabled={isExecuting}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecuting ? (isArabic ? 'جاري الإرسال...' : 'Executing...') : t.executeRequest}</span>
            </button>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            {isArabic ? currentEndpoint.summary : currentEndpoint.summaryEn}
          </p>

          {/* Request Payload Sample if POST */}
          {currentEndpoint.requestBodySample && (
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 block mb-1">
                {isArabic ? 'جسم الطلب التجريبي (Request Body JSON)' : 'Request Body (JSON)'}
              </span>
              <pre className="p-3 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-[11px] overflow-x-auto border border-neutral-800">
                {currentEndpoint.requestBodySample}
              </pre>
            </div>
          )}

          {/* Response Console */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>{isArabic ? 'مخرجات الاستجابة الحية (Live Response 200 OK)' : 'Live Response (200 OK)'}</span>
              </span>
              {testResponse && (
                <span className="text-[10px] font-mono text-emerald-500 font-bold">
                  200 OK · 14ms
                </span>
              )}
            </div>

            <pre className="p-4 rounded-xl bg-neutral-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-neutral-800 leading-relaxed max-h-80">
              {testResponse || currentEndpoint.responseSample}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
