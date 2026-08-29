import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Layers, 
  Mail, 
  ShieldCheck, 
  Send, 
  Sliders, 
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Info,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { matchTaskAllocation, confirmTaskAllocation } from '../api';

const PRESET_TASKS = [
  {
    title: "Enterprise Multi-Region Kubernetes & CI/CD Pipeline",
    description: "Design fault-tolerant container architecture on AWS with Terraform, ArgoCD, and automated canary deployments.",
    category: "DevOps",
    skills: ["DevOps", "AWS", "Kubernetes", "Docker", "Python"],
    complexity: "High",
    team_size: 3,
    deadline: "3 Weeks"
  },
  {
    title: "Next-Gen React & AI Analytics Dashboard",
    description: "Build an interactive SaaS dashboard with dynamic chart telemetry, WebSockets, and low-latency API integration.",
    category: "Frontend",
    skills: ["React", "JavaScript", "HTML", "CSS", "Figma"],
    complexity: "Medium",
    team_size: 3,
    deadline: "2 Weeks"
  },
  {
    title: "Real-time High Concurrency Payment Microservice",
    description: "Architect distributed payment settlement service with idempotent transactions, PostgreSQL, and Redis caching.",
    category: "Backend",
    skills: ["Python", "FastAPI", "PostgreSQL", "C++", "Docker"],
    complexity: "Critical",
    team_size: 4,
    deadline: "4 Weeks"
  },
  {
    title: "Enterprise LLM RAG & Document Intelligence",
    description: "Build an end-to-end vector search pipeline with chunking, embedding generation, and fast semantic retrieval.",
    category: "Machine Learning",
    skills: ["Python", "Machine Learning", "PyTorch", "Data Scientist"],
    complexity: "High",
    team_size: 3,
    deadline: "3 Weeks"
  }
];

export default function AllocationWizardView({ onAllocationConfirmed, onOpenEmployeeDetail }) {
  // Form State
  const [taskTitle, setTaskTitle] = useState(PRESET_TASKS[0].title);
  const [taskDesc, setTaskDesc] = useState(PRESET_TASKS[0].description);
  const [requiredSkills, setRequiredSkills] = useState(PRESET_TASKS[0].skills.join(', '));
  const [complexity, setComplexity] = useState(PRESET_TASKS[0].complexity);
  const [teamSize, setTeamSize] = useState(PRESET_TASKS[0].team_size);
  const [deadline, setDeadline] = useState(PRESET_TASKS[0].deadline);
  const [skipBusy, setSkipBusy] = useState(true);
  const [enforceBuddy, setEnforceBuddy] = useState(true);

  // Result State
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmationSuccess, setConfirmationSuccess] = useState(null);

  const applyPreset = (preset) => {
    setTaskTitle(preset.title);
    setTaskDesc(preset.description);
    setRequiredSkills(preset.skills.join(', '));
    setComplexity(preset.complexity);
    setTeamSize(preset.team_size);
    setDeadline(preset.deadline);
    setMatchResult(null);
    setConfirmationSuccess(null);
  };

  const handleRunMatch = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setConfirmationSuccess(null);
      
      const skillsArray = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: taskTitle,
        description: taskDesc,
        required_skills: skillsArray,
        complexity,
        team_size: Number(teamSize),
        deadline,
        skip_busy: skipBusy,
        enforce_buddy: enforceBuddy
      };

      const result = await matchTaskAllocation(payload);
      setMatchResult(result);
    } catch (err) {
      alert("Error generating match: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAllocation = async () => {
    if (!matchResult) return;
    try {
      setConfirming(true);
      const confirmPayload = {
        task_id: matchResult.task.id,
        task_title: matchResult.task.title,
        complexity: matchResult.task.complexity,
        deadline: matchResult.task.deadline,
        assigned_team: matchResult.recommended_team
      };

      const res = await confirmTaskAllocation(confirmPayload);
      setConfirmationSuccess(res);

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onAllocationConfirmed) onAllocationConfirmed();
    } catch (err) {
      alert("Error confirming assignment: " + err.message);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
          <Zap className="h-4 w-4" />
          AI-Powered Task & Team Allocation Wizard
        </div>
        <h2 className="text-2xl font-black text-white">Intelligent Candidate Matching Engine</h2>
      </div>

      {/* Preset Tasks Selector */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-300">Quick Test Presets (1-Click Fill):</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_TASKS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                taskTitle === preset.title
                  ? 'bg-indigo-950/60 border-indigo-500/60 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white line-clamp-1">{preset.title}</div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-indigo-400 font-semibold">{preset.category}</span>
                <span>{preset.complexity} • {preset.team_size} devs</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Task Configuration Form */}
      <form onSubmit={handleRunMatch} className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Task Title */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-200">Task Title / Mission Name</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Real-Time Distributed Payment Gateway"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white transition-all outline-none"
            />
          </div>

          {/* Task Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-200">Task Scope & Technical Overview</label>
            <textarea
              rows={2}
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="Brief description of task deliverables and technical context..."
              className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white transition-all outline-none"
            />
          </div>

          {/* Required Skills */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span>Required Competencies & Tools (Comma-separated)</span>
              <span className="text-[11px] text-slate-400 font-normal">Matched against 600 database profiles</span>
            </label>
            <input
              type="text"
              required
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g. Python, Docker, AWS, Kubernetes, React"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white font-mono transition-all outline-none"
            />
          </div>

          {/* Complexity Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">Complexity Level</label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Target Team Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span>Target Team Size: <strong>{teamSize} Member{teamSize > 1 ? 's' : ''}</strong></span>
              <span className="text-[11px] text-indigo-400">Auto-balanced Experience Mix</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 (Solo Lead)</span>
              <span>2 (Buddy Pair)</span>
              <span>3 (Lead+Mid+Fresher)</span>
              <span>4 (Squad)</span>
              <span>5 (Full Pod)</span>
            </div>
          </div>
        </div>

        {/* Guardrail Controls / Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-all">
            <input
              type="checkbox"
              checked={enforceBuddy}
              onChange={(e) => setEnforceBuddy(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-indigo-600 cursor-pointer"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Mandatory Fresher Buddy System
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-all">
            <input
              type="checkbox"
              checked={skipBusy}
              onChange={(e) => setSkipBusy(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-indigo-600 cursor-pointer"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
                Burnout Protection & Workload Balance
              </div>
            </div>
          </label>
        </div>

        {/* Submit Matching Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="gradient-btn px-6 py-3 rounded-xl text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Running AI Multi-Criteria Scoring...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate AI Team Recommendation</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* MATCH RESULTS SECTION */}
      {matchResult && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Recommendation Overview Header */}
          <div className="glass-panel-glow rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                AI Recommendation Formulated ({matchResult.recommended_team.length} Members)
              </div>
              <h3 className="text-xl font-bold text-white">{matchResult.task.title}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span>Diversity Score: <strong className="text-purple-400">{matchResult.metrics.diversity_score}%</strong></span>
                <span>•</span>
                <span>Avg Match Score: <strong className="text-emerald-400">{matchResult.metrics.average_match_score}/100</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Buddy Mentorship Active
                </span>
              </div>
            </div>

            {/* Stage 1 Notification Banner */}
            <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-800/80 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span>Stage 1 Preview Emails Sent ({matchResult.stage_1_notifications_sent})</span>
              </div>
            </div>
          </div>

          {/* Recommended Team Members Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assigned Team Roster & Role Distribution
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {matchResult.recommended_team.map((member, idx) => (
                <div 
                  key={member.employee_id}
                  className="glass-card rounded-xl p-5 border-l-4 border-l-indigo-500 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Member Identity & Role */}
                  <div className="space-y-2 max-w-lg">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-semibold text-slate-400">{member.employee_id}</span>
                      <h4 
                        onClick={() => onOpenEmployeeDetail(member.employee_id)}
                        className="text-base font-bold text-white hover:text-indigo-400 transition-colors cursor-pointer"
                      >
                        {member.name}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        member.category === 'Fresher' ? 'badge-fresher' :
                        member.category === 'Mid-level' ? 'badge-mid' : 'badge-exp'
                      }`}>
                        {member.category} ({member.experience_raw})
                      </span>
                    </div>

                    {/* Assigned Role Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold">
                      <Users className="h-3 w-3 text-indigo-400" />
                      Role: {member.assigned_role}
                    </div>

                    {/* Explainability Signal */}
                    <div className="text-xs text-slate-300 bg-slate-900/70 p-3 rounded-lg border border-slate-800/80">
                      <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5 text-indigo-400" />
                        AI Recommendation Rationalization:
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {member.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Quantitative Signals & Scores */}
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Match Score</div>
                      <div className="text-xl font-extrabold text-emerald-400">{member.match_score}</div>
                    </div>
                    <div className="h-8 w-px bg-slate-800" />
                    <div className="text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Skill Match</div>
                      <div className="text-sm font-bold text-indigo-300">{member.skill_match_pct}%</div>
                    </div>
                    <div className="h-8 w-px bg-slate-800" />
                    <div className="text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Leadership</div>
                      <div className="text-sm font-bold text-amber-300">{member.leadership_score}/5.0</div>
                    </div>
                    {member.category === 'Fresher' && (
                      <>
                        <div className="h-8 w-px bg-slate-800" />
                        <div className="text-center">
                          <div className="text-[10px] uppercase font-bold text-purple-400">Interview Sig.</div>
                          <div className="text-sm font-bold text-purple-300">{member.interview_score}/5.0</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MANAGER CONFIRMATION ACTION BAR */}
          <div className="glass-panel-glow rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-emerald-500/30">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Manager Authorization & Confirmation (Stage 2)
              </h4>
            </div>

            <button
              onClick={handleConfirmAllocation}
              disabled={confirming || confirmationSuccess !== null}
              className={`px-6 py-3 rounded-xl text-xs font-bold text-white shadow-xl transition-all cursor-pointer flex items-center gap-2 ${
                confirmationSuccess
                  ? 'bg-emerald-600 cursor-default'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
              }`}
            >
              {confirming ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Dispatching Confirmation Emails...</span>
                </>
              ) : confirmationSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Assignment Authorized! 🎉</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Approve & Confirm Assignment</span>
                </>
              )}
            </button>
          </div>

          {/* Confirmation Alert banner */}
          {confirmationSuccess && (
            <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                {confirmationSuccess.message}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
