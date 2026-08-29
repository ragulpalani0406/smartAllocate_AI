import React from 'react';
import {
  Users, UserCheck, Award, Sparkles, Layers,
  Briefcase, CheckCircle2, ArrowUpRight, Zap, TrendingUp, ShieldCheck
} from 'lucide-react';

const G = {
  glassBg: 'rgba(255,255,255,0.10)',
  glassBg2: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.20)',
  borderBright: '1px solid rgba(255,255,255,0.32)',
  textMuted: 'rgba(255,255,255,0.55)',
  textSub: 'rgba(255,255,255,0.75)',
  green: '#00E676',
  amber: '#FFD54F',
  coral: '#FF8A65',
};

function StatCard({ label, value, sub, subColor, icon: Icon }) {
  return (
    <div className="stat-card animate-fadeIn" style={{ background: 'linear-gradient(160deg, rgba(80, 40, 50, 0.7), rgba(40, 15, 25, 0.8))', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: G.textMuted }}>{label}</span>
        <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="text-3xl font-black tracking-tight text-white">{value}</div>
      {sub && <p className="mt-1.5 text-[11px] font-semibold" style={{ color: subColor || G.textMuted }}>{sub}</p>}
    </div>
  );
}

export default function DashboardView({ stats, onNavigateTab }) {
  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-72 gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        <p className="text-white/50 text-sm">Loading intelligence metrics…</p>
      </div>
    );
  }

  const {
    total_employees = 600,
    available_employees = 0,
    busy_employees = 0,
    utilization_pct = 0,
    categories_distribution = { Fresher: 163, 'Mid-level': 202, Experienced: 235 },
    skills_distribution = {},
    avg_rating = 0,
    avg_attendance = 0,
  } = stats;

  const skillEntries = Object.entries(skills_distribution);
  const maxSkillCount = Math.max(...skillEntries.map(([, v]) => v), 1);

  return (
    <div className="space-y-6 pb-24 md:pb-10 animate-fadeIn">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{ background: 'linear-gradient(135deg, rgba(230,0,50,0.8) 0%, rgba(130,0,50,0.9) 100%)', border: G.borderBright, boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <Sparkles className="h-3 w-3" style={{ color: G.amber }} />
              Autonomous Workforce Intelligence
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
              Talent Optimization &<br className="hidden sm:block" />
              <span className="gradient-text"> Diverse Team Engine</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigateTab('allocate')}
              className="gradient-btn px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer">
              <Zap className="h-4 w-4" /> Match New Task
            </button>
            <button onClick={() => onNavigateTab('directory')}
              className="px-4 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)' }}>
              <Users className="h-4 w-4" /> Browse Talent
            </button>
          </div>
        </div>
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', filter: 'blur(40px)' }} />
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Database"  value={total_employees}           sub="100% Ingested ✓"             subColor={G.green}  icon={Users} />
        <StatCard label="Available Now"   value={available_employees}       sub={`${busy_employees} on project`} subColor={G.amber}  icon={UserCheck} />
        <StatCard label="Fresher Pool"    value={categories_distribution.Fresher || 163} sub="Buddy System Ready"  subColor={G.coral}  icon={Sparkles} />
        <StatCard label="Avg Rating"      value={avg_rating}                sub={`Attendance ${avg_attendance}%`} subColor={G.textMuted} icon={Award} />
      </div>

      {/* ── Analytics ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left col */}
        <div className="xl:col-span-2 space-y-6">

          {/* Experience distribution */}
          <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(160deg, rgba(80, 40, 50, 0.7), rgba(40, 15, 25, 0.8))', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: G.textMuted }}>Talent Distribution</p>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="h-4 w-4" style={{ color: G.amber }} />
                  Experience Balance Pool
                </h3>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-lg font-mono text-white"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                600 Profiles
              </span>
            </div>

            {/* Stacked bar */}
            <div className="h-3 w-full rounded-full overflow-hidden flex gap-0.5 mb-5"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-l-full"
                style={{ width: `${(categories_distribution.Experienced / total_employees) * 100}%`, background: 'linear-gradient(90deg, #FF6B6B, #FF8A65)' }} />
              <div className="h-full"
                style={{ width: `${(categories_distribution['Mid-level'] / total_employees) * 100}%`, background: 'linear-gradient(90deg, #E91E8C, #CE93D8)' }} />
              <div className="h-full rounded-r-full"
                style={{ width: `${(categories_distribution.Fresher / total_employees) * 100}%`, background: 'linear-gradient(90deg, #00C853, #00E676)' }} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Experienced', sub: '5+ yrs', count: categories_distribution.Experienced || 235, color: '#FF8A65', bg: 'rgba(255,138,101,0.15)' },
                { label: 'Mid-level',   sub: '2-4 yrs', count: categories_distribution['Mid-level'] || 202, color: '#CE93D8', bg: 'rgba(206,147,216,0.15)' },
                { label: 'Fresher',     sub: '0-1 yr',  count: categories_distribution.Fresher || 163, color: '#00E676', bg: 'rgba(0,230,118,0.12)' },
              ].map(({ label, sub, count, color, bg }) => (
                <div key={label} className="p-3 rounded-xl text-center"
                  style={{ background: bg, border: `1px solid ${color}30` }}>
                  <div className="text-xl font-black text-white">{count}</div>
                  <div className="text-[10px] font-bold" style={{ color }}>{label}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: G.textMuted }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Spectrum */}
          <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(160deg, rgba(80, 40, 50, 0.7), rgba(40, 15, 25, 0.8))', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: G.textMuted }}>Skills Spectrum</p>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
              <Briefcase className="h-4 w-4" style={{ color: G.coral }} />
              9 Core Skill Domains
            </h3>
            <div className="space-y-3">
              {skillEntries.map(([domain, count]) => {
                const pct = Math.round((count / maxSkillCount) * 100);
                return (
                  <div key={domain} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-white/80 w-32 shrink-0 truncate">{domain}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #FF6B6B, #E91E8C, #9C27B0)' }} />
                    </div>
                    <span className="text-xs font-bold w-8 text-right font-mono" style={{ color: G.amber }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-4">

          {/* Guardrails */}
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(160deg, rgba(80, 40, 50, 0.7), rgba(40, 15, 25, 0.8))', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)' }}>
                <ShieldCheck className="h-4 w-4" style={{ color: G.green }} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Guardrails Active</h4>
                <p className="text-[10px] font-semibold" style={{ color: G.green }}>Zero Unsupervised Freshers</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Fresher Buddy Rule', status: 'Enforced', color: G.green,   bg: 'rgba(0,230,118,0.15)' },
                { label: 'Burnout Protection', status: 'Active',   color: G.amber,   bg: 'rgba(255,213,79,0.12)' },
                { label: '2-Stage Email',       status: 'Live',     color: '#CE93D8', bg: 'rgba(206,147,216,0.12)' },
              ].map(({ label, status, color, bg }) => (
                <div key={label} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <span className="text-xs font-semibold text-white/80">{label}</span>
                  <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{ background: bg, color }}>{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Utilization Ring */}
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(160deg, rgba(80, 40, 50, 0.7), rgba(40, 15, 25, 0.8))', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: G.textMuted }}>Utilization</p>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="32" cy="32" r="26" fill="none"
                    stroke="url(#pinkGrad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - utilization_pct / 100)}`} />
                  <defs>
                    <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF6B6B" />
                      <stop offset="100%" stopColor="#E91E8C" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-white">{utilization_pct}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Workforce Busy</p>
                <p className="text-xs mt-0.5" style={{ color: G.textMuted }}>{available_employees} available</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingUp className="h-3 w-3" style={{ color: G.green }} />
                  <span className="text-[11px] font-semibold" style={{ color: G.green }}>Healthy capacity</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(160deg, rgba(80, 40, 50, 0.7), rgba(40, 15, 25, 0.8))', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: G.textMuted }}>Quick Actions</p>
            <div className="space-y-2">
              {[
                { label: 'Run AI Team Matching', tab: 'allocate',      icon: Sparkles    },
                { label: 'Browse All Talent',    tab: 'directory',     icon: Users       },
                { label: 'View Email Hub',        tab: 'notifications', icon: CheckCircle2 },
              ].map(({ label, tab, icon: Icon }) => (
                <button key={tab} onClick={() => onNavigateTab(tab)}
                  className="w-full group flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" style={{ color: G.amber }} />
                    {label}
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5" style={{ color: 'rgba(255,255,255,0.4)' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
