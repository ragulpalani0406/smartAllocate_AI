import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  Table as TableIcon,
  User,
  Award,
  Sparkles
} from 'lucide-react';
import { fetchEmployees } from '../api';

const SKILL_CATEGORIES = [
  "All",
  "Frontend",
  "Backend",
  "DevOps",
  "Data Analyst",
  "Machine Learning",
  "Data Scientist",
  "Software Testing",
  "Debugger",
  "UI/UX"
];

export default function EmployeeDirectoryView({ onSelectEmployee }) {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(24);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [skillsCategory, setSkillsCategory] = useState('All');
  const [workloadStatus, setWorkloadStatus] = useState('All');
  const [sortBy, setSortBy] = useState('overall_rating');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchEmployees({
        search,
        category,
        skills_category: skillsCategory,
        workload_status: workloadStatus,
        sort_by: sortBy,
        order: 'desc',
        page,
        page_size: pageSize
      });
      setEmployees(res.employees);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, category, skillsCategory, workloadStatus, sortBy]);

  // Debounced search trigger
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <Users className="h-4 w-4" />
            600-Employee Talent Intelligence Directory
          </div>
          <h2 className="text-2xl font-black text-white">Workforce Roster & Skills Database</h2>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by employee name, skills (e.g. React, Python), email or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-white outline-none"
            />
          </div>
          <button
            type="submit"
            className="gradient-btn px-5 py-2 rounded-xl text-white text-xs font-bold shrink-0 cursor-pointer shadow-md"
          >
            Search Talent
          </button>
        </form>

        {/* Category Pills & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          
          {/* Experience Category Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Experience:</span>
            {['All', 'Fresher', 'Mid-level', 'Experienced'].map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  category === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Domain Dropdown */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={skillsCategory}
              onChange={(e) => { setSkillsCategory(e.target.value); setPage(1); }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none"
            >
              {SKILL_CATEGORIES.map((sc) => (
                <option key={sc} value={sc}>Domain: {sc}</option>
              ))}
            </select>

            <select
              value={workloadStatus}
              onChange={(e) => { setWorkloadStatus(e.target.value); setPage(1); }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none"
            >
              <option value="All">Status: All</option>
              <option value="Available">Available Only</option>
              <option value="Busy">Busy / On Project</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none"
            >
              <option value="overall_rating">Sort: Rating</option>
              <option value="attendance_pct">Sort: Attendance</option>
              <option value="project_completion_pct">Sort: Delivery %</option>
              <option value="leadership_score">Sort: Leadership</option>
              <option value="salary">Sort: Salary</option>
            </select>
          </div>

        </div>
      </div>

      {/* Results Count Strip */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <strong>{employees.length}</strong> of <strong>{total}</strong> employees
        </div>
        <div>
          Page {page} of {totalPages}
        </div>
      </div>

      {/* Loading indicator */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">
          <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mr-3" />
          Loading talent records...
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => onSelectEmployee(emp)}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4 cursor-pointer group shadow-xl shadow-black/20"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-bold group-hover:border-indigo-500/50 transition-colors">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {emp.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">{emp.id}</span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    emp.workload_status === 'Available' ? 'badge-available' : 'badge-busy'
                  }`}>
                    {emp.workload_status}
                  </span>
                </div>

                {/* Category & Domain badge */}
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    emp.category === 'Fresher' ? 'badge-fresher' :
                    emp.category === 'Mid-level' ? 'badge-mid' : 'badge-exp'
                  }`}>
                    {emp.category} ({emp.experience_raw})
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    {emp.skills_category}
                  </span>
                </div>

                {/* Skills tags preview */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {emp.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800">
                      {skill}
                    </span>
                  ))}
                  {emp.skills.length > 3 && (
                    <span className="text-[10px] text-slate-400 px-1">+{emp.skills.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Footer Scores */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{emp.overall_rating}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Att: <span className="text-emerald-400 font-semibold">{emp.attendance_pct}%</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {emp.category === 'Fresher' ? (
                    <span className="text-purple-400 font-semibold">Intv: {emp.interview_score}</span>
                  ) : (
                    <span>Del: <strong className="text-slate-200">{emp.project_completion_pct}%</strong></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Skills</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Delivery</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp)}
                  className="hover:bg-slate-900/60 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{emp.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{emp.id} • {emp.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      emp.category === 'Fresher' ? 'badge-fresher' :
                      emp.category === 'Mid-level' ? 'badge-mid' : 'badge-exp'
                    }`}>
                      {emp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-indigo-300 font-medium">{emp.skills_category}</td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-400">{emp.skills_raw}</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">{emp.overall_rating}</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">{emp.attendance_pct}%</td>
                  <td className="py-3 px-4 font-semibold">{emp.project_completion_pct}%</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      emp.workload_status === 'Available' ? 'badge-available' : 'badge-busy'
                    }`}>
                      {emp.workload_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="text-xs text-slate-400">
          Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer transition-all"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
