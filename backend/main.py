import os
import random
import datetime
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from data_loader import db
from allocation_engine import match_candidates_for_task
from email_service import email_service

app = FastAPI(
    title="SmartAllocate AI Backend API",
    description="Intelligent Task & Team Allocation System API powered by 600-employee database",
    version="2.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Tasks Store
TASKS_DB: List[Dict[str, Any]] = [
    {
        "id": "TSK-1001",
        "title": "Cloud-Native Microservices Gateway",
        "description": "Architect and deploy high-throughput API gateway with OAuth2, rate limiting, and Kubernetes cluster orchestration.",
        "skills_category": "DevOps",
        "required_skills": ["DevOps", "AWS", "Kubernetes", "Docker", "Python"],
        "complexity": "High",
        "team_size": 3,
        "deadline": "2 Weeks",
        "status": "In Progress",
        "created_at": (datetime.datetime.now() - datetime.timedelta(days=2)).strftime("%Y-%m-%d"),
        "assigned_team": [
            {"id": "EMP-0004", "name": "Rohit Nathan", "role": "Team Lead & Mentor", "category": "Experienced"},
            {"id": "EMP-0012", "name": "Ananya Sen", "role": "Core Engineer", "category": "Mid-level"},
            {"id": "EMP-0025", "name": "Karthik Raja", "role": "Fresher Mentee", "category": "Fresher"}
        ]
    },
    {
        "id": "TSK-1002",
        "title": "Real-Time Customer Sentiment NLP Pipeline",
        "description": "Build end-to-end streaming data ingestion with PyTorch transformer inference for multilingual reviews.",
        "skills_category": "Machine Learning",
        "required_skills": ["Python", "Machine Learning", "PyTorch", "FastAPI"],
        "complexity": "Critical",
        "team_size": 3,
        "deadline": "3 Weeks",
        "status": "In Progress",
        "created_at": (datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
        "assigned_team": [
            {"id": "EMP-0008", "name": "Venkatesh Iyer", "role": "Team Lead & Mentor", "category": "Experienced"},
            {"id": "EMP-0019", "name": "Priya Sharma", "role": "Core Engineer", "category": "Mid-level"},
            {"id": "EMP-0033", "name": "Deepak Verma", "role": "Fresher Mentee", "category": "Fresher"}
        ]
    },
    {
        "id": "TSK-1003",
        "title": "Next.js Executive Analytics Dashboard Revamp",
        "description": "Design dynamic charts, responsive dark mode UI, and interactive data visualization for c-suite analytics.",
        "skills_category": "Frontend",
        "required_skills": ["React", "JavaScript", "HTML", "CSS", "Figma"],
        "complexity": "Medium",
        "team_size": 2,
        "deadline": "10 Days",
        "status": "Pending Allocation",
        "created_at": datetime.datetime.now().strftime("%Y-%m-%d"),
        "assigned_team": []
    }
]

# Pydantic Request Models
class TaskMatchRequest(BaseModel):
    title: str = Field(..., example="Fintech Payment Microservice")
    description: str = Field(..., example="Build resilient payment processing with Stripe and webhook callbacks.")
    required_skills: List[str] = Field(default=[], example=["Python", "FastAPI", "PostgreSQL"])
    complexity: str = Field(default="Medium", example="Medium")
    team_size: int = Field(default=3, ge=1, le=5)
    skip_busy: bool = Field(default=True)
    enforce_buddy: bool = Field(default=True)
    task_id: Optional[str] = None
    deadline: Optional[str] = "14 Days"

class TaskConfirmRequest(BaseModel):
    task_id: str
    task_title: str
    complexity: str
    deadline: Optional[str] = "14 Days"
    assigned_team: List[Dict[str, Any]]

class DevReportRequest(BaseModel):
    developer_name: Optional[str] = "Nandhini Shankar"
    role: Optional[str] = "Debugger / Core Contributor"
    git_commits: Optional[List[str]] = None

@app.get("/")
def root():
    return {
        "system": "SmartAllocate AI — Intelligent Task & Team Allocation System",
        "version": "2.0.0",
        "status": "operational",
        "total_employees": len(db.get_all()),
        "endpoints": [
            "/api/stats",
            "/api/employees",
            "/api/employees/{id}",
            "/api/allocate/match",
            "/api/allocate/confirm",
            "/api/tasks",
            "/api/notifications",
            "/api/reports/generate"
        ]
    }

@app.get("/api/stats")
def get_dashboard_stats():
    employees = db.get_all()
    total = len(employees)
    
    available_count = sum(1 for e in employees if e["workload_status"] == "Available")
    busy_count = sum(1 for e in employees if e["workload_status"] == "Busy")
    
    categories = {"Fresher": 0, "Mid-level": 0, "Experienced": 0}
    skills_cat = {}
    total_rating = 0.0
    total_attendance = 0.0
    total_completion = 0.0

    for e in employees:
        cat = e["category"]
        categories[cat] = categories.get(cat, 0) + 1
        
        scat = e["skills_category"]
        skills_cat[scat] = skills_cat.get(scat, 0) + 1
        
        total_rating += e["overall_rating"]
        total_attendance += e["attendance_pct"]
        total_completion += e["project_completion_pct"]

    avg_rating = round(total_rating / total, 2) if total else 0
    avg_attendance = round(total_attendance / total, 1) if total else 0
    avg_completion = round(total_completion / total, 1) if total else 0

    return {
        "total_employees": total,
        "available_employees": available_count,
        "busy_employees": busy_count,
        "utilization_pct": round((busy_count / total) * 100, 1) if total else 0,
        "categories_distribution": categories,
        "skills_distribution": skills_cat,
        "avg_rating": avg_rating,
        "avg_attendance": avg_attendance,
        "avg_completion": avg_completion,
        "active_tasks_count": len([t for t in TASKS_DB if t["status"] == "In Progress"]),
        "total_tasks_count": len(TASKS_DB),
        "notifications_count": len(email_service.get_all_notifications())
    }

@app.get("/api/employees")
def list_employees(
    search: Optional[str] = Query(None, description="Search by name, skills, or email"),
    category: Optional[str] = Query(None, description="Fresher / Mid-level / Experienced"),
    skills_category: Optional[str] = Query(None, description="Frontend, Backend, DevOps, etc."),
    workload_status: Optional[str] = Query(None, description="Available or Busy"),
    sort_by: Optional[str] = Query("overall_rating", description="Sort field: overall_rating, attendance_pct, salary, leadership_score"),
    order: Optional[str] = Query("desc", description="asc or desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=600)
):
    all_emp = db.get_all()
    filtered = all_emp

    # Search filter
    if search:
        s = search.lower().strip()
        filtered = [
            e for e in filtered
            if s in e["name"].lower() or s in e["email"].lower() or s in e["skills_raw"].lower() or s in e["id"].lower()
        ]

    # Category filter
    if category and category != "All":
        filtered = [e for e in filtered if e["category"].lower() == category.lower()]

    # Skills Category filter
    if skills_category and skills_category != "All":
        filtered = [e for e in filtered if e["skills_category"].lower() == skills_category.lower()]

    # Workload status filter
    if workload_status and workload_status != "All":
        filtered = [e for e in filtered if e["workload_status"].lower() == workload_status.lower()]

    # Sort
    valid_sort_keys = ["overall_rating", "attendance_pct", "project_completion_pct", "salary", "leadership_score", "experience_years"]
    sort_key = sort_by if sort_by in valid_sort_keys else "overall_rating"
    reverse = (order.lower() == "desc")
    filtered.sort(key=lambda x: x.get(sort_key, 0), reverse=reverse)

    total_filtered = len(filtered)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_items = filtered[start_idx:end_idx]

    return {
        "total": total_filtered,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_filtered + page_size - 1) // page_size,
        "employees": paginated_items
    }

@app.get("/api/employees/{emp_id}")
def get_employee_detail(emp_id: str):
    emp = db.get_by_id(emp_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@app.post("/api/employees/reload")
def reload_employee_database():
    try:
        db.load_data()
        return {
            "status": "success",
            "message": f"Successfully reloaded {len(db.get_all())} employee records from Excel database.",
            "total_employees": len(db.get_all())
        }
    except Exception as ex:
        raise HTTPException(status_code=500, detail=str(ex))

@app.post("/api/allocate/match")
def match_task_allocation(req: TaskMatchRequest):
    task_dict = {
        "id": req.task_id or f"TSK-{random.randint(2000, 9999)}",
        "title": req.title,
        "description": req.description,
        "required_skills": req.required_skills,
        "complexity": req.complexity,
        "deadline": req.deadline
    }

    match_result = match_candidates_for_task(
        task=task_dict,
        team_size=req.team_size,
        skip_busy=req.skip_busy,
        enforce_buddy=req.enforce_buddy
    )

    # Trigger Stage 1 — Preview Email for recommended candidates
    preview_notifications = []
    for member in match_result["recommended_team"]:
        emp_obj = db.get_by_id(member["employee_id"])
        if emp_obj:
            notif = email_service.send_preview_notification(
                employee=emp_obj,
                task=task_dict,
                reason=member["explanation"]
            )
            preview_notifications.append(notif)

    return {
        "status": "success",
        "task": task_dict,
        "recommended_team": match_result["recommended_team"],
        "top_candidates_pool": match_result["top_candidates_pool"],
        "metrics": match_result["metrics"],
        "stage_1_notifications_sent": len(preview_notifications),
        "notifications": preview_notifications
    }

@app.post("/api/allocate/confirm")
def confirm_task_allocation(req: TaskConfirmRequest):
    # 1. Update workload status for assigned members
    task_dict = {
        "id": req.task_id,
        "title": req.task_title,
        "complexity": req.complexity,
        "deadline": req.deadline
    }

    confirmed_notifications = []
    for member in req.assigned_team:
        emp_id = member.get("employee_id") or member.get("id")
        emp_obj = db.get_by_id(emp_id)
        if emp_obj:
            # Update status to Busy
            db.update_workload_status(
                emp_id=emp_id,
                status="Busy",
                task_id=req.task_id,
                task_title=req.task_title
            )
            # Send Stage 2 Confirmation Email
            notif = email_service.send_confirmation_notification(
                employee=emp_obj,
                task=task_dict,
                role=member.get("assigned_role") or member.get("role", "Core Engineer"),
                team_members=req.assigned_team
            )
            confirmed_notifications.append(notif)

    # 2. Add or update in TASKS_DB
    existing_task = next((t for t in TASKS_DB if t["id"] == req.task_id), None)
    if existing_task:
        existing_task["status"] = "In Progress"
        existing_task["assigned_team"] = req.assigned_team
    else:
        TASKS_DB.append({
            "id": req.task_id,
            "title": req.task_title,
            "description": "Manager-authorized task assignment.",
            "skills_category": req.assigned_team[0].get("skills_category", "Fullstack") if req.assigned_team else "General",
            "required_skills": [],
            "complexity": req.complexity,
            "team_size": len(req.assigned_team),
            "deadline": req.deadline or "14 Days",
            "status": "In Progress",
            "created_at": datetime.datetime.now().strftime("%Y-%m-%d"),
            "assigned_team": req.assigned_team
        })

    return {
        "status": "success",
        "message": f"Task '{req.task_title}' successfully confirmed! Stage 2 emails dispatched to {len(confirmed_notifications)} team members.",
        "assigned_team": req.assigned_team,
        "stage_2_notifications_sent": len(confirmed_notifications),
        "notifications": confirmed_notifications
    }

@app.get("/api/tasks")
def get_all_tasks():
    return TASKS_DB

@app.post("/api/tasks")
def create_custom_task(task_data: Dict[str, Any]):
    new_task = {
        "id": f"TSK-{random.randint(1050, 9999)}",
        "title": task_data.get("title", "Untitled Task"),
        "description": task_data.get("description", ""),
        "skills_category": task_data.get("skills_category", "Fullstack"),
        "required_skills": task_data.get("required_skills", []),
        "complexity": task_data.get("complexity", "Medium"),
        "team_size": task_data.get("team_size", 3),
        "deadline": task_data.get("deadline", "14 Days"),
        "status": "Pending Allocation",
        "created_at": datetime.datetime.now().strftime("%Y-%m-%d"),
        "assigned_team": []
    }
    TASKS_DB.insert(0, new_task)
    return new_task

@app.get("/api/notifications")
def get_notifications(stage: Optional[str] = None):
    return email_service.get_all_notifications(filter_stage=stage)

@app.post("/api/reports/generate")
def generate_dev_report(req: DevReportRequest):
    # Live "Automate Dev Reports" demonstration feature
    developer_name = req.developer_name or "Nandhini Shankar"
    role = req.role or "Debugger & Systems Contributor"
    
    sample_commits = req.git_commits or [
        "feat(auth): add OAuth2 JWT refresh token rotation mechanism",
        "fix(cache): resolve race condition in Redis cluster key invalidation",
        "perf(db): add composite index on (tenant_id, created_at) reducing query latency by 45%",
        "test(e2e): add Playwright end-to-end integration tests for checkout flow"
    ]

    report = {
        "report_id": f"REP-{random.randint(1000, 9999)}",
        "generated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "developer": developer_name,
        "role": role,
        "sprint_period": "Current Sprint (Week 34)",
        "velocity_score": "94.8% (Optimal)",
        "commit_count": len(sample_commits),
        "executive_summary": f"During this sprint cycle, {developer_name} demonstrated exceptional delivery velocity across authentication security and database performance optimization, successfully closing 4 high-priority technical debt items with zero regression.",
        "key_highlights": [
            "🔐 **Authentication Security**: Hardened authorization layer with automated JWT token rotation.",
            "⚡ **Database Performance**: Reduced query execution time by 45% via strategic composite index tuning.",
            "🛡️ **System Stability**: Resolved critical Redis race condition under high concurrency.",
            "🧪 **Quality Assurance**: Expanded automated E2E integration test suite."
        ],
        "blockers_and_risks": "None reported. All CI/CD pipelines green.",
        "next_focus_areas": [
            "Complete load testing for 10k concurrent sessions",
            "Mentor junior peers during Friday code review clinic"
        ],
        "raw_git_commits": sample_commits
    }
    return report

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
