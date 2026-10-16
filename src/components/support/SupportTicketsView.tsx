import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  User,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';

export const SupportTicketsView: React.FC = () => {
  const { tickets, addTicket, addTicketReply, updateTicketStatus, t, language, currentUser } = useApp();
  const isArabic = language === 'ar';

  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);

  // New ticket form
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<SupportTicket['priority']>('medium');
  const [category, setCategory] = useState<SupportTicket['category']>('system');

  // Reply form
  const [replyMessage, setReplyMessage] = useState('');

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    await addTicket(subject, description, priority, category);
    setSubject('');
    setDescription('');
    setIsNewTicketOpen(false);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    await addTicketReply(selectedTicket.id, replyMessage);
    setReplyMessage('');

    // Update selected ticket in place
    const updated = tickets.find(t => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  const getPriorityBadge = (p: SupportTicket['priority']) => {
    switch (p) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">{t.priorityCritical}</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">{t.priorityHigh}</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">{t.priorityMedium}</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">{t.priorityLow}</span>;
    }
  };

  const getStatusBadge = (st: SupportTicket['status']) => {
    switch (st) {
      case 'open':
        return <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400">{isArabic ? 'مفتوحة' : 'Open'}</span>;
      case 'in_progress':
        return <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">{isArabic ? 'قيد المعالجة' : 'In Progress'}</span>;
      case 'resolved':
        return <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{isArabic ? 'تم الحل' : 'Resolved'}</span>;
      default:
        return <span className="text-[10px] font-semibold text-neutral-400">{isArabic ? 'مغلقة' : 'Closed'}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div>
          <h1 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-blue-600" />
            <span>{t.supportTitle}</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {isArabic ? 'متابعة المشكلات الفنية، طلبات الصيانة، ودعم الماسحات الضوئية والتزامن' : 'Internal IT service desk and document infrastructure maintenance'}
          </p>
        </div>

        <button
          onClick={() => setIsNewTicketOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.createNewTicket}</span>
        </button>
      </div>

      {/* Main 2-Column Split: Tickets List & Active Ticket Conversation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Tickets List) */}
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800 text-xs font-bold text-neutral-900 dark:text-white">
            <span>{isArabic ? 'التذاكر النشطة' : 'Active Tickets'}</span>
            <span className="font-mono text-neutral-400">({tickets.length})</span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[500px] overflow-y-auto">
            {tickets.map(tck => {
              const isSelected = selectedTicket?.id === tck.id;
              return (
                <div
                  key={tck.id}
                  onClick={() => setSelectedTicket(tck)}
                  className={`p-3 rounded-xl cursor-pointer transition text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[11px] text-blue-600 dark:text-blue-400">
                      {tck.ticketNumber}
                    </span>
                    {getPriorityBadge(tck.priority)}
                  </div>

                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                    {tck.subject}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>{tck.createdBy}</span>
                    <span>{getStatusBadge(tck.status)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (Ticket Detail & Thread) */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs flex flex-col justify-between min-h-[460px]">
          {selectedTicket ? (
            <div className="space-y-4">
              {/* Ticket Header */}
              <div className="flex items-start justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="text-xs text-neutral-500">{selectedTicket.category.toUpperCase()}</span>
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                    {selectedTicket.subject}
                  </h2>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    {isArabic ? `أنشأها: ${selectedTicket.createdBy} في ${new Date(selectedTicket.createdAt).toLocaleDateString()}` : `Opened by ${selectedTicket.createdBy}`}
                  </p>
                </div>

                {/* Status Toggle */}
                <select
                  value={selectedTicket.status}
                  onChange={e => updateTicketStatus(selectedTicket.id, e.target.value as SupportTicket['status'])}
                  className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                >
                  <option value="open">{isArabic ? 'مفتوحة' : 'Open'}</option>
                  <option value="in_progress">{isArabic ? 'قيد المعالجة' : 'In Progress'}</option>
                  <option value="resolved">{isArabic ? 'تم الحل' : 'Resolved'}</option>
                  <option value="closed">{isArabic ? 'إغلاق التذكرة' : 'Closed'}</option>
                </select>
              </div>

              {/* Initial description */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {selectedTicket.description}
              </div>

              {/* Thread Responses */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">
                  {isArabic ? 'سجل الردود والتوجيهات' : 'Activity & Responses'}
                </span>

                {selectedTicket.responses.length === 0 ? (
                  <p className="text-xs text-neutral-400 py-3 text-center">
                    {isArabic ? 'لا توجد ردود بعد. يمكنك كتابة تعليق أدناه.' : 'No responses yet. Add a reply below.'}
                  </p>
                ) : (
                  selectedTicket.responses.map(resp => (
                    <div
                      key={resp.id}
                      className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-blue-700 dark:text-blue-300">
                          {resp.senderName} ({resp.senderRole})
                        </span>
                        <span className="font-mono text-neutral-400 text-[10px]">
                          {new Date(resp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                        {resp.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="flex gap-2 pt-4">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  placeholder={t.replyPlaceholder}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.sendReply}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-400 text-xs">
              {isArabic ? 'اختر تذكرة لعرض التفاصيل' : 'Select a ticket to view thread'}
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
              {t.createNewTicket}
            </h3>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t.ticketSubject} *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                  placeholder={isArabic ? 'مثال: مشكلة في تعريف ماسح الباركود' : 'e.g. Barcode scanner configuration issue'}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.ticketPriority}
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as SupportTicket['priority'])}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="low">{t.priorityLow}</option>
                    <option value="medium">{t.priorityMedium}</option>
                    <option value="high">{t.priorityHigh}</option>
                    <option value="critical">{t.priorityCritical}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.ticketCategory}
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as SupportTicket['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="system">النظام والتشغيل (System)</option>
                    <option value="scanner">الماسح الضوئي (Scanner)</option>
                    <option value="sync">تزامن الأندرويد (Mobile Sync)</option>
                    <option value="database">قاعدة البيانات (Database)</option>
                    <option value="security">الأمان والصلاحيات (Security)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {isArabic ? 'التفاصيل والملاحظات الفنية' : 'Description'} *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  placeholder={isArabic ? 'اشرح المشكلة أو الطلب بالتفصيل...' : 'Detailed description...'}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  {isArabic ? 'فتح التذكرة' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
