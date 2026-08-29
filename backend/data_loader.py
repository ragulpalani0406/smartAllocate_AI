import os
import re
import pandas as pd
from typing import List, Dict, Any, Optional

DATASET_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "SmartAllocate_600_Employee_Database_Updated.xlsx")

def parse_experience_years(exp_str: str) -> float:
    if not exp_str or str(exp_str).strip().lower() == "fresher":
        return 0.0
    match = re.search(r"(\d+)", str(exp_str))
    if match:
        return float(match.group(1))
    return 0.0

def categorize_experience(years: float) -> str:
    if years <= 1.0:
        return "Fresher"
    elif years <= 4.0:
        return "Mid-level"
    else:
        return "Experienced"

def parse_communication_score(comm_str: str) -> float:
    c = str(comm_str).strip().lower()
    if "advanced" in c:
        return 4.8
    elif "well" in c:
        return 4.2
    elif "average" in c and "lise" not in c:
        return 3.4
    else:
        return 2.8

def calculate_leadership_score(achievement: str, overall_rating: float, exp_years: float) -> float:
    base = min(5.0, (overall_rating * 0.7) + min(1.5, exp_years * 0.15))
    ach = str(achievement).lower()
    if "leadership award" in ach:
        base += 1.0
    elif "best project award" in ach or "employee of the year" in ach:
        base += 0.7
    elif "rising star" in ach or "best team player" in ach:
        base += 0.4
    return round(min(5.0, max(1.0, base)), 2)

def calculate_interview_score(overall_rating: float, attendance: float, exp_years: float) -> float:
    # For freshers with 0-1 yrs exp, provides an aptitude/interview baseline
    base = (overall_rating * 0.6) + ((attendance / 100.0) * 5.0 * 0.4)
    return round(min(5.0, max(2.5, base)), 2)

def generate_past_tasks(skills_cat: str, exp_years: float, achievements: str) -> List[Dict[str, Any]]:
    # Generate realistic past task history based on their profile
    tasks = []
    if exp_years == 0:
        tasks.append({
            "title": "Onboarding & Internal Capstone Project",
            "role": "Trainee / Mentee",
            "completion": "100%",
            "rating": 4.5,
            "tech": "Core Stack & Git Workflow"
        })
    else:
        num_tasks = min(4, max(1, int(exp_years)))
        templates = {
            "Frontend": [
                ("Enterprise Analytics Dashboard Redesign", "Lead UI Developer", "React, Tailwind, Recharts", 4.8),
                ("Customer Portal Microfrontend Migration", "Frontend Engineer", "Next.js, TypeScript", 4.6),
                ("Design System & Component Library", "Core Contributor", "Figma, React, Storybook", 4.9)
            ],
            "Backend": [
                ("High-Throughput Order Processing Service", "Backend Architect", "FastAPI, PostgreSQL, Redis", 4.9),
                ("Auth0 & OAuth2 Security Gateway", "Security Backend Engineer", "Python, JWT, Docker", 4.7),
                ("Real-time Event Streaming Pipeline", "Service Developer", "Kafka, Go, Python", 4.8)
            ],
            "DevOps": [
                ("Multi-Region Kubernetes CI/CD Automation", "DevOps Specialist", "K8s, GitHub Actions, Terraform", 4.9),
                ("Infrastructure Cost Optimization & APM", "Cloud Engineer", "AWS, Prometheus, Grafana", 4.7)
            ],
            "Data Scientist": [
                ("Predictive Churn Model & Feature Store", "Lead Data Scientist", "Python, Scikit-learn, MLflow", 4.8),
                ("Recommendation Engine Optimization", "ML Specialist", "PyTorch, Vector Search", 4.9)
            ],
            "Machine Learning": [
                ("LLM Pipeline & RAG Search Implementation", "ML Engineer", "LangChain, ChromaDB, FastAPI", 4.9),
                ("Computer Vision Defect Detection Model", "CV Specialist", "OpenCV, PyTorch", 4.7)
            ],
            "Data Analyst": [
                ("Executive Revenue & Retention BI Reporting", "Lead Analyst", "SQL, PowerBI, Tableau", 4.8),
                ("Marketing Funnel Attribution Analysis", "Data Analyst", "Python, Snowflake", 4.6)
            ],
            "Software Testing": [
                ("Automated End-to-End Test Suite Suite", "QA Automation Lead", "Playwright, Cypress, Jest", 4.8),
                ("Load & Performance Stress Testing", "QA Engineer", "JMeter, k6, Postman", 4.7)
            ],
            "Debugger": [
                ("Core Memory Leak & Profiling Overhaul", "Senior Systems Debugger", "GDB, Valgrind, C++", 4.9),
                ("High-Concurrency Race Condition Fixes", "Core Engineer", "Go, Python, Threading", 4.8)
            ],
            "UI/UX": [
                ("SaaS Platform User Experience Revamp", "Lead Product Designer", "Figma, Wireframing, UX Research", 4.9),
                ("Mobile App Design System & Interaction Prototyping", "UI Designer", "Adobe XD, Proto.io", 4.7)
            ]
        }
        domain_list = templates.get(skills_cat, templates["Frontend"])
        for i in range(min(num_tasks, len(domain_list))):
            t = domain_list[i]
            tasks.append({
                "title": t[0],
                "role": t[1],
                "tech": t[2],
                "completion": "100%",
                "rating": t[3]
            })
    return tasks

class EmployeeDatabase:
    def __init__(self, file_path: str = DATASET_PATH):
        self.file_path = file_path
        self.employees: List[Dict[str, Any]] = []
        self.employee_map: Dict[str, Dict[str, Any]] = {}
        self.load_data()

    def load_data(self):
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"Excel database not found at {self.file_path}")

        df = pd.read_excel(self.file_path)
        required_cols = [
            'Employee Name', 'Salary (INR)', 'Experience', 'Communication Skills',
            'Skills (Programming Languages / Tools)', 'Attendance Percentage',
            'Email ID', 'Mobile Number', 'Project Completion Percentage',
            'Achievements', 'Overall Rating', 'Skills Category', 'Current Project Working'
        ]
        for col in required_cols:
            if col not in df.columns:
                raise ValueError(f"Missing required column '{col}' in database")

        records = []
        emp_map = {}

        for idx, row in df.iterrows():
            emp_id = f"EMP-{idx + 1:04d}"
            name = str(row['Employee Name']).strip()
            email = str(row['Email ID']).strip()
            mobile = str(row['Mobile Number']).strip()
            salary = int(row['Salary (INR)'])
            exp_raw = str(row['Experience']).strip()
            exp_years = parse_experience_years(exp_raw)
            category = categorize_experience(exp_years)
            
            skills_raw = str(row['Skills (Programming Languages / Tools)']).strip()
            skills_list = [s.strip() for s in skills_raw.split(',') if s.strip()]
            skills_cat = str(row['Skills Category']).strip()
            
            attendance = float(row['Attendance Percentage'])
            project_comp = float(row['Project Completion Percentage'])
            overall_rating = float(row['Overall Rating'])
            achievements = str(row['Achievements']).strip()
            comm_raw = str(row['Communication Skills']).strip()
            comm_score = parse_communication_score(comm_raw)
            
            lead_score = calculate_leadership_score(achievements, overall_rating, exp_years)
            interview_score = calculate_interview_score(overall_rating, attendance, exp_years)
            
            curr_proj = str(row['Current Project Working']).strip()
            workload_status = "Busy" if curr_proj.lower() == "working" else "Available"
            
            past_tasks = generate_past_tasks(skills_cat, exp_years, achievements)
            
            emp_obj = {
                "id": emp_id,
                "name": name,
                "email": email,
                "mobile": mobile,
                "salary": salary,
                "experience_raw": exp_raw,
                "experience_years": exp_years,
                "category": category,
                "skills": skills_list,
                "skills_raw": skills_raw,
                "skills_category": skills_cat,
                "attendance_pct": attendance,
                "project_completion_pct": project_comp,
                "overall_rating": overall_rating,
                "achievements": achievements,
                "communication_raw": comm_raw,
                "communication_score": comm_score,
                "leadership_score": lead_score,
                "interview_score": interview_score,
                "workload_status": workload_status,
                "current_task_id": None,
                "current_task_title": "Enterprise Pipeline Migration" if workload_status == "Busy" else None,
                "task_history": past_tasks
            }
            records.append(emp_obj)
            emp_map[emp_id] = emp_obj

        self.employees = records
        self.employee_map = emp_map
        print(f"Successfully loaded {len(self.employees)} employees from {self.file_path}")

    def get_all(self) -> List[Dict[str, Any]]:
        return self.employees

    def get_by_id(self, emp_id: str) -> Optional[Dict[str, Any]]:
        return self.employee_map.get(emp_id)

    def update_workload_status(self, emp_id: str, status: str, task_id: Optional[str] = None, task_title: Optional[str] = None):
        if emp_id in self.employee_map:
            self.employee_map[emp_id]["workload_status"] = status
            self.employee_map[emp_id]["current_task_id"] = task_id
            self.employee_map[emp_id]["current_task_title"] = task_title

# Singleton instance
db = EmployeeDatabase()
