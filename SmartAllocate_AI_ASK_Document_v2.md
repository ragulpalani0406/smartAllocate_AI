# ASK Document — SmartAllocate AI

## Intelligent Task & Team Allocation System

---

## 1. Project Overview

**Project Name:** SmartAllocate AI — Intelligent Task & Team Allocation System

**Problem Statement:**
Companies manually allocate tasks to employees based on resumes/gut-feel, which is time-consuming, biased, causes over-allocation of top performers, and gives freshers fewer growth opportunities.

**Proposed Solution:**
An AI-powered system that recommends best-fit employees for tasks using **an existing employee database (Excel/CSV)**, forms diverse/balanced teams, manages workload dynamically, and automatically notifies assigned employees via email — removing manual coordination overhead entirely.

**Target Success Metric:** ~40% reduction in manual/unqualified task allocation time.

---

## 2. Existing Data Source (Important — No New Dataset Needed)

**We already have a ready, structured Excel/CSV database** containing full employee details. The system will read directly from this file — no synthetic/dummy dataset creation needed for the hackathon.

**Expected columns in the existing CSV/Excel file:**
| Column | Description |
|---|---|
| Employee ID | Unique identifier |
| Name | Employee name |
| Email | For automated notifications |
| Category | Fresher / Mid-level / Experienced |
| Skills | Comma-separated skill tags |
| Task History | Past tasks completed (list/reference) |
| Achievement Score | Numeric performance rating |
| Communication Score | Numeric rating |
| Leadership Score | Numeric rating |
| Interview Score | Used for freshers with no task history |
| Current Workload Status | Available / Busy / On task |

**Integration Approach:**
- Backend reads the CSV/Excel file using **pandas** (Python) on startup, or loads it into a lightweight DB table (SQLite/PostgreSQL) for querying at runtime
- If the file gets updated externally, a re-sync/reload mechanism should refresh the in-memory or DB copy
- For the hackathon demo, the file can be loaded once at backend startup — no need for a full live-sync pipeline unless time permits

**Backend Load Logic (Pseudocode):**
```
import pandas as pd

def load_employee_data(file_path):
    df = pd.read_csv(file_path)  # or pd.read_excel() for .xlsx
    validate_columns(df)  # check required columns exist
    return df.to_dict(orient="records")

employee_db = load_employee_data("employees.csv")
```

---

## 3. Core Features

### Feature 1 — Employee Profile Management
- Employee data sourced directly from the **existing Excel/CSV database** (see Section 2)
- Categorized as: **Fresher / Mid-level / Experienced**
- Click on any employee → shows full profile: skills, task history, achievements, communication score, leadership score, interview score (freshers), current workload status

### Feature 2 — AI-Based Task Matching
- **Input:** Task description + required skills + complexity
- **Output:** Ranked employee list (pulled from the existing database) with a **reason** for each recommendation (achievement, communication, leadership signals)
- **Freshers with zero task history:** interview score (from the existing database) used as a bootstrap signal, which decays as real performance data accumulates
  - Weighting once history exists: **70% real performance + 30% interview score**

### Feature 3 — Diverse Team Formation
- System does **not** return only the top-5 highest scorers
- Auto-mixes experience levels per team (e.g., 2 experienced + 3 mid-level)
- Freshers are **never assigned solo** — mandatory 2-3 member buddy team, always paired with at least 1 mid/experienced member for mentorship and risk mitigation

### Feature 4 — Dynamic Workload Balancing
- Real-time task load tracking per employee (workload status field updated in the database)
- Auto-skips already-busy employees, recommends next best-fit
- Burnout-prevention threshold alerts

### Feature 5 — Automated Email Notification (Two-Stage)

**Stage 1 — Recommendation / Preview Email**
- **Trigger:** The moment the AI recommendation engine suggests an employee for a task
- **Recipient:** The recommended employee (email pulled from the existing database)
- **Content:** Notice that they've been recommended for a potential task + task summary + reason + status: *Pending Manager Approval*

**Stage 2 — Confirmation / Final Email**
- **Trigger:** Manager clicks "Approve/Confirm" on the dashboard
- **Recipient:** Final assigned employee(s) + team members
- **Content:** Full task details, role (Lead/Support/Learning), deadline, team members list, reason — official assignment, status: *Confirmed*

**Backend Logic (Pseudocode):**
```
ON ai_recommendation_generated:
    FOR employee IN recommended_list:
        send_email(employee.email,  # from existing database
                    subject="You've been recommended for a task",
                    body=preview_template,
                    status="pending_approval")
        log_notification(employee_id, task_id, type="preview", status="sent")

ON manager_confirms_assignment:
    FOR employee IN final_assigned_team:
        send_email(employee.email,
                    subject="Task Assignment Confirmed",
                    body=confirmation_template,
                    status="confirmed")
        log_notification(employee_id, task_id, type="final", status="sent")
```

**Dashboard Requirement:**
- Notification log tracks two statuses: `Preview Sent` → `Confirmed Sent`

**Bonus (if time permits):** Weekly auto-summary email to managers showing workload distribution.

### Feature 6 — "Automate Dev Reports" Demo Feature
- Frontend button: **"Automate Dev Reports"**
- On click: backend takes mock developer logs → AI converts them into a short, readable standup summary → displayed instantly on screen
- Purpose: demonstrates the core value proposition live, in a single click

### Feature 7 — Manager Dashboard
- View all employees (from the existing database), current assignments, workload %, team composition per task
- Explainability panel: shows why each person was recommended
- Email notification status/log (Preview Sent / Confirmed Sent) visible per assignment

---

## 4. Technical Requirements

| Layer | Suggested Tech |
|---|---|
| Frontend | React / Next.js |
| Backend | Python (FastAPI/Flask) — pandas for reading existing CSV/Excel database |
| AI Layer | LLM API (Claude/OpenAI) — recommendation reasoning, report generation, email content drafting |
| Email Service | SMTP (Gmail API) or a transactional email service (SendGrid/Resend) |
| Data Source | **Existing Excel/CSV file** (already prepared, fully populated with employee data) — no new dataset creation needed |
| Optional DB Layer | Load CSV into SQLite/PostgreSQL at runtime for faster querying, if time permits |

---

## 5. Constraints & Non-Functional Requirements

- AI recommendations are **advisory only** — manager gives final approval before the confirmation email is triggered
- Must avoid "rich-get-richer" bias — same top performers should not always be recommended/emailed
- Data privacy: employee data and email handling must be compliant (e.g., DPDP Act if India-based)
- Interview score is a **temporary signal** for freshers only, not a permanent weight
- Email sending must be async/queued — should not block the UI or freeze the dashboard
- Existing CSV/Excel database must be validated on load (check for missing/malformed columns) to avoid runtime errors during the demo

---

## 6. Success Metrics (For Pitch Slide)

| Metric | Target |
|---|---|
| Manual allocation time reduction | ~40% |
| Manual notification/coordination time reduction | Near 100% (fully automated via email) |
| Fresher opportunity increase | Measurable via buddy-team assignment rate |
| Workload balance improvement | Reduced over-allocation incidents |

---

## 7. Out of Scope (Hackathon Phase)

- Real-time chat integration (Slack/Teams) — future scope
- Mobile app version — future scope
- Advanced ML model training on performance data — hackathon uses rule-based logic + LLM reasoning, not custom-trained ML
- Live bi-directional sync with the source Excel/CSV file (read-only load is sufficient for demo)

---

## 8. Open Questions for Team Alignment

- [ ] Python or JavaScript/TypeScript for backend?
- [ ] How many team members on backend/text-analytics parsing?
- [ ] Team size threshold logic (2 vs 3 members) — configurable per task complexity?
- [ ] Should the CSV/Excel database be loaded into SQLite for the demo, or read directly via pandas each time?
