import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert, 
  GitCommit, 
  Copy, 
  Check,
  User
} from 'lucide-react';
import { generateDevReport } from '../api';

export default function DevReportsModal({ isOpen, onClose }) {
  const [developerName, setDeveloperName] = useState('Nandhini Shankar');
  const [role, setRole] = useState('Core Debugger & Systems Specialist');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await generateDevReport({
        developer_name: developerName,
        role: role
      });
      setReport(res);
    } catch (err) {
      alert("Error generating report: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    const text = `${report.developer} - Sprint Standup Report\nVelocity: ${report.velocity_score}\n\nSummary:\n${report.executive_summary}\n\nHighlights:\n${report.key_highlights.join('\n')}\n\nNext Steps:\n${report.next_focus_areas.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel-glow rounded-2xl border border-indigo-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Feature 6 Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
            <Sparkles className="h-3 w-3" />
            ASK Document Feature 6: Automate Dev Reports Demo
          </div>
          <h3 className="text-xl font-extrabold text-white">AI Developer Standup & Telemetry Synthesizer</h3>
        </div>

        {/* Quick Developer Selection & Trigger */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Select Engineer (From 600 Database)</label>
              <select
                value={developerName}
                onChange={(e) => setDeveloperName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none"
              >
                <option value="Nandhini Shankar">Nandhini Shankar (Debugger / Core)</option>
                <option value="Suresh Reddy">Suresh Reddy (UI/UX / Frontend)</option>
                <option value="Rohit Nathan">Rohit Nathan (DevOps Specialist)</option>
                <option value="Priya Sharma">Priya Sharma (Data Scientist)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Engineering Role Context</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full gradient-btn py-2.5 rounded-xl text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Synthesizing Developer Logs...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>Generate Instant AI Standup Report</span>
              </>
            )}
          </button>
        </div>

        {/* AI GENERATED REPORT VIEW */}
        {report && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-white text-sm">{report.developer}</span>
                <span className="text-slate-400">({report.sprint_period})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                  Velocity: {report.velocity_score}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Copy Report"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Executive Summary</span>
              <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                {report.executive_summary}
              </p>
            </div>

            {/* Key Deliverables & Highlights */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Key Deliverables</span>
              <div className="space-y-1.5">
                {report.key_highlights.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/80 text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Focus */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next Sprint Objectives</span>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                {report.next_focus_areas.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
