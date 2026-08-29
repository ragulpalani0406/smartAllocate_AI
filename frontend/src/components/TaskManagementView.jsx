import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Sparkles, 
  Users, 
  Clock, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  User,
  X
} from 'lucide-react';
import { fetchTasks, createTask } from '../api';

export default function TaskManagementView({ onSelectTaskForAllocation, onOpenEmployeeDetail }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDomain, setNewDomain] = useState('Frontend');
  const [newSkills, setNewSkills] = useState('');
  const [newComplexity, setNewComplexity] = useState('Medium');
  const [newTeamSize, setNewTeamSize] = useState(3);
  const [newDeadline, setNewDeadline] = useState('14 Days');

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const skillsArr = newSkills.split(',').map((s) => s.trim()).filter(Boolean);
      await createTask({
        title: newTitle,
        description: newDesc,
        skills_category: newDomain,
        required_skills: skillsArr,
        complexity: newComplexity,
        team_size: Number(newTeamSize),
        deadline: newDeadline
      });
      setShowCreateModal(false);
      // Reset form
      setNewTitle('');
      setNewDesc('');
      setNewSkills('');
      loadTasks();
    } catch (err) {
      alert('Error creating task: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <CheckSquare className="h-4 w-4" />
            Active Tasks & Squad Formations
          </div>
          <h2 className="text-2xl font-black text-white">Project Workstream Allocations</h2>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="gradient-btn px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Task List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {tasks.map((task) => {
          const isAssigned = task.assigned_team && task.assigned_team.length > 0;
          return (
            <div
              key={task.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">{task.id}</span>
                    <h3 className="text-base font-bold text-white">{task.title}</h3>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    task.status === 'In Progress'
                      ? 'badge-available'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {task.status}
                  </span>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-indigo-300 font-medium">
                    {task.skills_category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                    Complexity: <strong>{task.complexity}</strong>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {task.deadline}
                  </span>
                </div>
              </div>

              {/* Assigned Team Members Roster */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-indigo-400" />
                    Assigned Team ({task.assigned_team?.length || 0} devs):
                  </span>
                  {isAssigned && (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Buddy Mentorship Formed
                    </span>
                  )}
                </div>

                {isAssigned ? (
                  <div className="space-y-1.5">
                    {task.assigned_team.map((member, idx) => (
                      <div
                        key={idx}
                        onClick={() => onOpenEmployeeDetail && onOpenEmployeeDetail(member.id || member.employee_id)}
                        className="p-2 rounded-lg bg-slate-900/70 hover:bg-slate-900 border border-slate-800 flex items-center justify-between text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-semibold text-white">{member.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            member.category === 'Fresher' ? 'badge-fresher' :
                            member.category === 'Mid-level' ? 'badge-mid' : 'badge-exp'
                          }`}>
                            {member.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-indigo-300 font-medium">
                          {member.role || member.assigned_role || 'Contributor'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-2">
                    <p className="text-xs text-slate-400">No team allocated yet.</p>
                    <button
                      onClick={() => onSelectTaskForAllocation(task)}
                      className="gradient-btn px-4 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-1.5 mx-auto cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Formulate AI Squad</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE TASK MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg glass-panel-glow rounded-2xl p-6 space-y-5 border border-slate-700 shadow-2xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Create New Task Initiative</h3>
              <p className="text-xs text-slate-400">Define mission parameters for AI allocation.</p>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-200">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Real-Time Chat & Collaboration Engine"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200">Task Scope</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Technical overview and goals..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Primary Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Software Testing">Software Testing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Complexity</label>
                  <select
                    value={newComplexity}
                    onChange={(e) => setNewComplexity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="e.g. React, Node.js, WebSockets, Redis"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Team Size</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newTeamSize}
                    onChange={(e) => setNewTeamSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Timeline / Sprint</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="e.g. 2 Weeks"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gradient-btn px-5 py-2 rounded-xl text-white font-bold cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
