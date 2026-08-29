const API_BASE = "http://localhost:8000/api";

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchEmployees(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.category && params.category !== "All") query.append("category", params.category);
  if (params.skills_category && params.skills_category !== "All") query.append("skills_category", params.skills_category);
  if (params.workload_status && params.workload_status !== "All") query.append("workload_status", params.workload_status);
  if (params.sort_by) query.append("sort_by", params.sort_by);
  if (params.order) query.append("order", params.order);
  if (params.page) query.append("page", params.page);
  if (params.page_size) query.append("page_size", params.page_size);

  const res = await fetch(`${API_BASE}/employees?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
}

export async function fetchEmployeeById(id) {
  const res = await fetch(`${API_BASE}/employees/${id}`);
  if (!res.ok) throw new Error("Failed to fetch employee details");
  return res.json();
}

export async function reloadDatabase() {
  const res = await fetch(`${API_BASE}/employees/reload`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to reload database");
  return res.json();
}

export async function matchTaskAllocation(taskData) {
  const res = await fetch(`${API_BASE}/allocate/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) throw new Error("Failed to generate AI allocation");
  return res.json();
}

export async function confirmTaskAllocation(confirmData) {
  const res = await fetch(`${API_BASE}/allocate/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(confirmData)
  });
  if (!res.ok) throw new Error("Failed to confirm task allocation");
  return res.json();
}

export async function fetchTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function createTask(taskData) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function fetchNotifications(stage = null) {
  const url = stage ? `${API_BASE}/notifications?stage=${stage}` : `${API_BASE}/notifications`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function generateDevReport(reportReq = {}) {
  const res = await fetch(`${API_BASE}/reports/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reportReq)
  });
  if (!res.ok) throw new Error("Failed to generate developer report");
  return res.json();
}
