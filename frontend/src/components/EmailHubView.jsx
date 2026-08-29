import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  CheckCircle2, 
  Clock, 
  Send, 
  Eye, 
  ShieldCheck, 
  User, 
  ExternalLink,
  Filter,
  X
} from 'lucide-react';
import { fetchNotifications } from '../api';

export default function EmailHubView() {
  const [notifications, setNotifications] = useState([]);
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications(stageFilter === 'all' ? null : stageFilter);
      setNotifications(data);
      if (data.length > 0 && !selectedNotif) {
        setSelectedNotif(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [stageFilter]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
          <Mail className="h-4 w-4" />
          Two-Stage Automated Email Notification Engine
        </div>
        <h2 className="text-2xl font-black text-white">Live Email Audit & Dispatch Center</h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setStageFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              stageFilter === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Logs ({notifications.length})
          </button>
          <button
            onClick={() => setStageFilter('preview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              stageFilter === 'preview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Stage 1: Preview Sent
          </button>
          <button
            onClick={() => setStageFilter('confirmed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              stageFilter === 'confirmed' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Stage 2: Confirmed Sent
          </button>
        </div>

        <button
          onClick={loadNotifications}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Refresh Audit Feed</span>
        </button>
      </div>

      {/* 2-Column Split Viewer: Left List / Right Live HTML Email Renderer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Notification List (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading audit events...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 glass-panel rounded-xl">
              No notifications sent yet in this category. Generate a task allocation to trigger Stage 1 & 2 emails.
            </div>
          ) : (
            notifications.map((n) => {
              const isSelected = selectedNotif?.id === n.id;
              const isConfirmed = n.stage === 'confirmed';
              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNotif(n)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-indigo-950/70 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400">{n.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isConfirmed ? 'badge-available' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {n.status_label}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white line-clamp-1">{n.subject}</h4>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <User className="h-3 w-3 text-slate-400" />
                      <span>{n.employee_name} ({n.employee_email})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>Task: {n.task_title?.slice(0, 24)}...</span>
                    <span>{n.timestamp}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Col: Live Rendered HTML Email Inspector (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-700/80 space-y-4">
          {selectedNotif ? (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Email Envelope Bar */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{selectedNotif.subject}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedNotif.stage === 'confirmed' ? 'badge-available' : 'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {selectedNotif.status_label}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <div><strong>To:</strong> {selectedNotif.employee_name} &lt;{selectedNotif.employee_email}&gt;</div>
                  <div><strong>From:</strong> SmartAllocate AI &lt;notifications@smartallocate.internal&gt;</div>
                  <div><strong>Task Reference:</strong> {selectedNotif.task_title}</div>
                  <div><strong>Dispatched At:</strong> {selectedNotif.timestamp}</div>
                </div>
              </div>

              {/* Rendered HTML Email Body */}
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-white text-slate-900 shadow-inner">
                <div 
                  dangerouslySetInnerHTML={{ __html: selectedNotif.html_content }} 
                  className="p-2 sm:p-4 max-h-[500px] overflow-y-auto"
                />
              </div>

            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400 text-xs">
              <Mail className="h-8 w-8 text-slate-400 mb-2" />
              <span>Select an email notification on the left to inspect its live HTML rendering</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
