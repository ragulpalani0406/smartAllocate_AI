import React from 'react';
import { LayoutDashboard, Sparkles, Users, CheckSquare, Mail, FileText, ShieldCheck, ChevronRight } from 'lucide-react';

const menuItems = [
  { id: 'dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'allocate',      label: 'AI Task Matcher',  icon: Sparkles,    badge: 'AI' },
  { id: 'directory',     label: 'Talent Directory', icon: Users,       badge: '600' },
  { id: 'tasks',         label: 'Task Management',  icon: CheckSquare },
  { id: 'notifications', label: 'Email Hub',        icon: Mail,        badge: '2-Stage' },
  { id: 'devreports',    label: 'Dev Reports',      icon: FileText,    badge: 'F6' },
];

export default function Sidebar({ activeTab, setActiveTab, unreadNotificationsCount = 0, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-desktop fixed md:relative inset-y-0 left-0 z-50 w-64 shrink-0 flex flex-col h-[calc(100vh-57px)] overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ background: 'rgba(71, 55, 68, 0.45)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <nav className="flex-1 p-3 space-y-1 pt-4">
          <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Workforce Intelligence
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className="w-full group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all duration-200 cursor-pointer"
                style={isActive ? {
                  background: 'rgba(255,255,255,0.22)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  color: '#ffffff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                } : {
                  border: '1px solid transparent',
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
                    style={isActive ? { background: 'rgba(255,255,255,0.2)' } : { background: 'rgba(255,255,255,0.08)' }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)' }} />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.id === 'notifications' && unreadNotificationsCount > 0 ? (
                  <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,230,118,0.25)', color: '#00E676', border: '1px solid rgba(0,230,118,0.4)' }}>
                    {unreadNotificationsCount}
                  </span>
                ) : item.badge ? (
                  <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                    style={isActive
                      ? { background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }
                      : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <ChevronRight className="h-3 w-3 shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }} />
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Bottom status */}
        <div className="p-3 m-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" style={{ color: '#00E676' }} />
            <span className="text-[11px] font-bold text-white">Guardrails Active</span>
            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-black"
              style={{ background: 'rgba(0,230,118,0.2)', color: '#00E676', border: '1px solid rgba(0,230,118,0.35)' }}>ON</span>
          </div>
          <div className="flex items-center justify-between text-[10px] pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }}>
            <span>Dataset</span>
            <span className="font-semibold" style={{ color: '#FFD54F' }}>600 Records</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav justify-around px-2">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)' }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-semibold">{item.label.split(' ')[0]}</span>
              {isActive && <div className="h-0.5 w-4 rounded-full" style={{ background: '#00E676' }} />}
            </button>
          );
        })}
      </nav>
    </>
  );
}
