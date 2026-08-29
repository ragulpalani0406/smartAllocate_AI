import React, { useState } from 'react';
import { Sparkles, RefreshCw, FileText, CheckCircle2, Menu, X, Zap, Database } from 'lucide-react';
import { reloadDatabase } from '../api';

export default function Header({ stats, onReloadSuccess, onOpenDevReport, onOpenNewAllocation, isSidebarOpen, setIsSidebarOpen }) {
  const [reloading, setReloading] = useState(false);
  const [reloadMsg, setReloadMsg] = useState('');

  const handleReload = async () => {
    try {
      setReloading(true);
      const res = await reloadDatabase();
      setReloadMsg(res.message);
      if (onReloadSuccess) onReloadSuccess();
      setTimeout(() => setReloadMsg(''), 3500);
    } catch (err) {
      setReloadMsg('Sync failed');
      setTimeout(() => setReloadMsg(''), 3500);
    } finally {
      setReloading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full"
      style={{ background: 'rgba(56, 11, 28, 0.65)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">

        {/* Hamburger + Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="md:hidden p-2 rounded-xl text-white/70 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-3 min-w-0">
            {/* Logo bubble */}
            <div className="relative shrink-0">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                <Sparkles className="h-4 w-4 text-white animate-pulse-subtle" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#00E676] border-2"
                style={{ borderColor: 'transparent' }} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-white truncate">
                  SmartAllocate <span className="gradient-text">AI</span>
                </h1>
                <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.9)' }}>
                  v2 Pro
                </span>
              </div>
              <p className="hidden sm:flex items-center gap-1 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Database className="h-2.5 w-2.5" style={{ color: '#00E676' }} />
                600-Employee Live Database
              </p>
            </div>
          </div>
        </div>

        {/* Center Stats */}
        <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}>
          <div className="flex items-center gap-2 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ background: '#00E676' }} />
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Total:</span>
            <span className="text-[11px] font-bold text-white">{stats?.total_employees || 600}</span>
          </div>
          <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <div className="flex items-center gap-2 px-3 py-1">
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Available:</span>
            <span className="text-[11px] font-bold" style={{ color: '#00E676' }}>{stats?.available_employees || 0}</span>
          </div>
          <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <div className="flex items-center gap-2 px-3 py-1">
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Rating:</span>
            <span className="text-[11px] font-bold" style={{ color: '#FFD54F' }}>{stats?.avg_rating || '—'}/5</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenDevReport}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-white/80 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Dev Reports</span>
          </button>

          <button
            onClick={handleReload}
            disabled={reloading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white/70 hover:text-white text-xs font-medium transition-all disabled:opacity-40 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${reloading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{reloading ? 'Syncing…' : 'Sync'}</span>
          </button>

          <button
            onClick={onOpenNewAllocation}
            className="gradient-btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Allocate Task</span>
            <span className="sm:hidden">Go</span>
          </button>
        </div>
      </div>

      {reloadMsg && (
        <div className="px-4 sm:px-6 pb-2 animate-fadeIn">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs"
            style={{ background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.35)', color: '#00E676' }}>
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            {reloadMsg}
          </div>
        </div>
      )}
    </header>
  );
}
