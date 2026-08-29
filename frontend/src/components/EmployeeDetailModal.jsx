import React from 'react';
import { 
  X, User, Mail, Phone, Briefcase, Award, Calendar, 
  Star, CheckCircle2, Sparkles, Activity, DollarSign, 
  Layers, MessageSquare
} from 'lucide-react';

const G = {
  glassBg: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  textMuted: 'rgba(255,255,255,0.55)',
  green: '#00E676',
  amber: '#FFD54F',
  coral: '#FF8A65',
};

export default function EmployeeDetailModal({ employee, onClose, onAssignTask }) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
         style={{ background: 'rgba(30, 5, 14, 0.8)' }}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6"
           style={{ background: 'linear-gradient(160deg, rgba(80, 40, 50, 0.95), rgba(40, 15, 25, 0.98))', border: '1px solid rgba(255,255,255,0.15)' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl hover:text-white transition-all cursor-pointer"
          style={{ background: G.glassBg, border: G.border, color: G.textMuted }}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Top Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5"
             style={{ borderBottom: G.border }}>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl p-0.5 shadow-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #FF6B6B, #E91E8C)', boxShadow: '0 4px 15px rgba(233,30,140,0.3)' }}>
              <div className="h-full w-full rounded-[14px] flex items-center justify-center"
                   style={{ background: 'rgba(40, 15, 25, 0.9)' }}>
                <User className="h-7 w-7" style={{ color: '#FF8A65' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">{employee.name}</h3>
                <span className="text-xs font-mono font-bold" style={{ color: G.textMuted }}>({employee.id})</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  employee.category === 'Fresher' ? 'badge-fresher' :
                  employee.category === 'Mid-level' ? 'badge-mid' : 'badge-exp'
                }`}>
                  {employee.category} • {employee.experience_raw}
                </span>
                <span className="text-xs font-medium" style={{ color: G.coral }}>{employee.skills_category}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              employee.workload_status === 'Available' ? 'badge-available' : 'badge-busy'
            }`}>
              ● {employee.workload_status}
            </span>
            {employee.current_task_title && (
              <span className="text-[10px] mt-1 max-w-[180px] truncate text-right" style={{ color: G.textMuted }}>
                {employee.current_task_title}
              </span>
            )}
          </div>
        </div>

        {/* Scores & Performance Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl text-center" style={{ background: G.glassBg, border: G.border }}>
            <span className="text-[10px] uppercase font-bold" style={{ color: G.textMuted }}>Overall Rating</span>
            <div className="text-lg font-black flex items-center justify-center gap-1 mt-0.5" style={{ color: G.amber }}>
              <Star className="h-4 w-4 fill-current" />
              {employee.overall_rating}
            </div>
          </div>

          <div className="p-3 rounded-xl text-center" style={{ background: G.glassBg, border: G.border }}>
            <span className="text-[10px] uppercase font-bold" style={{ color: G.textMuted }}>Leadership Score</span>
            <div className="text-lg font-black flex items-center justify-center gap-1 mt-0.5" style={{ color: '#CE93D8' }}>
              <Award className="h-4 w-4" />
              {employee.leadership_score}/5.0
            </div>
          </div>

          <div className="p-3 rounded-xl text-center" style={{ background: G.glassBg, border: G.border }}>
            <span className="text-[10px] uppercase font-bold" style={{ color: G.textMuted }}>Communication</span>
            <div className="text-xs font-bold mt-1" style={{ color: '#FF8A65' }}>
              {employee.communication_raw} ({employee.communication_score}/5)
            </div>
          </div>

          <div className="p-3 rounded-xl text-center" style={{ background: G.glassBg, border: G.border }}>
            <span className="text-[10px] uppercase font-bold" style={{ color: G.textMuted }}>
              {employee.category === 'Fresher' ? 'Interview Signal' : 'Project Delivery'}
            </span>
            <div className="text-lg font-black mt-0.5" style={{ color: G.green }}>
              {employee.category === 'Fresher' 
                ? `${employee.interview_score}/5.0`
                : `${employee.project_completion_pct}%`}
            </div>
          </div>
        </div>

        {/* Skills Tag Matrix */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white">
            Verified Competencies & Toolchain
          </label>
          <div className="flex flex-wrap gap-2">
            {employee.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.08)', border: G.border, color: G.amber }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements & Honors */}
        {employee.achievements && (
          <div className="p-3.5 rounded-xl flex items-center gap-3"
               style={{ background: 'linear-gradient(90deg, rgba(255,213,79,0.15), transparent)', border: '1px solid rgba(255,213,79,0.2)' }}>
            <Award className="h-6 w-6 shrink-0" style={{ color: G.amber }} />
            <div>
              <div className="text-xs font-bold" style={{ color: '#FFD54F' }}>Company Recognition</div>
              <div className="text-sm font-semibold text-white">{employee.achievements}</div>
            </div>
          </div>
        )}

        {/* Task & Project History */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider flex items-center justify-between text-white">
            <span>Project Track Record & Past Initiatives</span>
            <span className="text-[11px] font-normal" style={{ color: G.textMuted }}>{employee.task_history?.length || 0} initiatives</span>
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {employee.task_history?.map((task, idx) => (
              <div key={idx} className="p-3 rounded-lg flex items-center justify-between text-xs"
                   style={{ background: G.glassBg, border: G.border }}>
                <div>
                  <div className="font-bold text-white">{task.title}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: G.textMuted }}>Role: <span style={{ color: G.coral }}>{task.role}</span> • Tech: {task.tech}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold" style={{ color: G.green }}>{task.completion}</div>
                  <div className="text-[10px]" style={{ color: G.textMuted }}>Rating: {task.rating}/5</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Administrative Details Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs"
             style={{ borderTop: G.border, color: G.textMuted }}>
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            <span>+91 {employee.mobile}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-3.5 w-3.5" />
            <span>INR {employee.salary?.toLocaleString()}/mo</span>
          </div>
        </div>

      </div>
    </div>
  );
}
