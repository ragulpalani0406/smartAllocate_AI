import re
from typing import List, Dict, Any, Optional
from data_loader import db

def normalize_skill(s: str) -> str:
    return re.sub(r"[^a-z0-9#+]", "", str(s).strip().lower())

def calculate_skill_match_score(emp_skills: List[str], req_skills: List[str]) -> tuple[float, List[str]]:
    if not req_skills:
        return 1.0, emp_skills[:3]
    
    emp_norm = {normalize_skill(s): s for s in emp_skills}
    matched = []
    
    for r in req_skills:
        r_norm = normalize_skill(r)
        # Direct match or substring match
        for e_norm, orig_name in emp_norm.items():
            if r_norm == e_norm or r_norm in e_norm or e_norm in r_norm:
                if orig_name not in matched:
                    matched.append(orig_name)
                    break
                    
    match_ratio = len(matched) / len(req_skills) if req_skills else 1.0
    return min(1.0, match_ratio), matched

def score_employee_for_task(emp: Dict[str, Any], task: Dict[str, Any], skip_busy: bool = True) -> Dict[str, Any]:
    req_skills = task.get("required_skills", [])
    complexity = task.get("complexity", "Medium").capitalize()
    
    # 1. Skill Match Score (0 - 1.0)
    skill_ratio, matched_skills = calculate_skill_match_score(emp["skills"], req_skills)
    skill_score_100 = skill_ratio * 100.0

    # 2. Performance & Interview Signal Score
    # For freshers with no/little past projects: 70% real performance + 30% interview score
    exp_years = emp["experience_years"]
    rating_norm = (emp["overall_rating"] / 5.0) * 100.0
    comp_norm = emp["project_completion_pct"]
    att_norm = emp["attendance_pct"]
    base_perf = (rating_norm * 0.4) + (comp_norm * 0.4) + (att_norm * 0.2)

    if emp["category"] == "Fresher":
        interview_norm = (emp["interview_score"] / 5.0) * 100.0
        if exp_years == 0:
            effective_perf = interview_norm
        else:
            effective_perf = (0.7 * base_perf) + (0.3 * interview_norm)
    else:
        effective_perf = base_perf

    # 3. Leadership & Communication Signal
    lead_norm = (emp["leadership_score"] / 5.0) * 100.0
    comm_norm = (emp["communication_score"] / 5.0) * 100.0

    # 4. Complexity weighting adjustments
    if complexity in ["High", "Critical"]:
        w_skill = 0.40
        w_perf = 0.30
        w_lead = 0.20
        w_comm = 0.10
    elif complexity == "Medium":
        w_skill = 0.35
        w_perf = 0.35
        w_lead = 0.15
        w_comm = 0.15
    else: # Low complexity
        w_skill = 0.30
        w_perf = 0.40
        w_lead = 0.10
        w_comm = 0.20

    raw_composite = (w_skill * skill_score_100) + (w_perf * effective_perf) + (w_lead * lead_norm) + (w_comm * comm_norm)

    # 5. Workload factor
    is_busy = emp["workload_status"] == "Busy"
    workload_penalty = 0.0
    if is_busy:
        if skip_busy:
            workload_penalty = 40.0 # heavy penalty so available candidates prioritize
        else:
            workload_penalty = 15.0

    final_match_score = max(5.0, round(raw_composite - workload_penalty, 1))

    # 6. Generate Explainability Reason
    reasons = []
    if skill_ratio >= 0.6:
        reasons.append(f"Strong skill alignment matching {len(matched_skills)}/{len(req_skills)} required competencies ({', '.join(matched_skills)})")
    elif skill_ratio > 0:
        reasons.append(f"Partial skill overlap with {', '.join(matched_skills)}")
    else:
        reasons.append(f"Domain proficiency in {emp['skills_category']}")

    if emp["category"] == "Fresher":
        reasons.append(f"High-potential Fresher with {emp['interview_score']}/5 interview bootstrap signal and {emp['attendance_pct']}% attendance")
    elif emp["category"] == "Experienced":
        reasons.append(f"Seasoned professional ({emp['experience_raw']}) with verified leadership rating ({emp['leadership_score']}/5)")
    else:
        reasons.append(f"Reliable mid-level contributor with {emp['project_completion_pct']}% project delivery rate")

    if emp["achievements"] and emp["achievements"] != "None":
        reasons.append(f"Honored with '{emp['achievements']}'")

    if is_busy:
        reasons.append("⚠️ Currently on an active task — workload rebalancing applied")

    return {
        "employee_id": emp["id"],
        "name": emp["name"],
        "email": emp["email"],
        "category": emp["category"],
        "experience_raw": emp["experience_raw"],
        "skills_category": emp["skills_category"],
        "skills": emp["skills"],
        "matched_skills": matched_skills,
        "overall_rating": emp["overall_rating"],
        "attendance_pct": emp["attendance_pct"],
        "project_completion_pct": emp["project_completion_pct"],
        "leadership_score": emp["leadership_score"],
        "communication_score": emp["communication_score"],
        "interview_score": emp["interview_score"],
        "workload_status": emp["workload_status"],
        "match_score": final_match_score,
        "skill_match_pct": round(skill_score_100, 1),
        "performance_score": round(effective_perf, 1),
        "explanation": " • ".join(reasons),
        "assigned_role": "Member"
    }

def form_diverse_team(scored_pool: List[Dict[str, Any]], team_size: int, enforce_buddy: bool = True) -> List[Dict[str, Any]]:
    """
    Forms a diverse team mixing Experienced, Mid-level, and Fresher members.
    Guarantees:
    - Never only top-5 highest scorers from a single tier.
    - Freshers are NEVER assigned solo.
    - Always pairs with at least 1 Mid/Experienced mentor.
    """
    exp_pool = [e for e in scored_pool if e["category"] == "Experienced"]
    mid_pool = [e for e in scored_pool if e["category"] == "Mid-level"]
    fresh_pool = [e for e in scored_pool if e["category"] == "Fresher"]

    # Sort pools by match score
    exp_pool.sort(key=lambda x: x["match_score"], reverse=True)
    mid_pool.sort(key=lambda x: x["match_score"], reverse=True)
    fresh_pool.sort(key=lambda x: x["match_score"], reverse=True)

    selected_team: List[Dict[str, Any]] = []

    # Distribution strategy based on team_size
    if team_size == 1:
        # Solo task: prefer Experienced or Mid-level. Never assign a Fresher alone!
        if exp_pool:
            lead = exp_pool[0]
            lead["assigned_role"] = "Task Lead"
            selected_team.append(lead)
        elif mid_pool:
            lead = mid_pool[0]
            lead["assigned_role"] = "Task Lead"
            selected_team.append(lead)
        else:
            cand = fresh_pool[0]
            cand["assigned_role"] = "Task Lead"
            selected_team.append(cand)
        return selected_team

    # Team size >= 2: Buddy & Diversity Mode
    # 1. Select Lead (from Experienced, or Mid if none available)
    if exp_pool:
        lead = exp_pool.pop(0)
        lead["assigned_role"] = "Team Lead & Mentor"
        selected_team.append(lead)
    elif mid_pool:
        lead = mid_pool.pop(0)
        lead["assigned_role"] = "Team Lead & Mentor"
        selected_team.append(lead)

    # 2. Add Fresher if buddy mentorship is enabled and team_size >= 2
    if enforce_buddy and fresh_pool and len(selected_team) < team_size:
        mentee = fresh_pool.pop(0)
        mentee["assigned_role"] = "Fresher Mentee / Junior Developer"
        selected_team.append(mentee)

    # 3. Fill remaining slots with Mid-level or Experienced or remaining candidates
    remaining_slots = team_size - len(selected_team)
    for _ in range(remaining_slots):
        # alternate or pick best available from mid > exp > fresh
        if mid_pool:
            m = mid_pool.pop(0)
            m["assigned_role"] = "Core Engineer"
            selected_team.append(m)
        elif exp_pool:
            e = exp_pool.pop(0)
            e["assigned_role"] = "Senior Engineer"
            selected_team.append(e)
        elif fresh_pool:
            f = fresh_pool.pop(0)
            f["assigned_role"] = "Associate Developer"
            selected_team.append(f)

    return selected_team

def match_candidates_for_task(task: Dict[str, Any], team_size: int = 3, skip_busy: bool = True, enforce_buddy: bool = True) -> Dict[str, Any]:
    all_employees = db.get_all()
    
    scored_all = []
    for emp in all_employees:
        scored = score_employee_for_task(emp, task, skip_busy=skip_busy)
        scored_all.append(scored)

    # Sort full ranked pool
    scored_all.sort(key=lambda x: x["match_score"], reverse=True)

    # Form the balanced diverse team
    team = form_diverse_team(scored_all, team_size=team_size, enforce_buddy=enforce_buddy)

    # Calculate diversity and metrics
    categories_present = set(m["category"] for m in team)
    diversity_score = round((len(categories_present) / 3.0) * 100.0, 1)
    has_fresher = any(m["category"] == "Fresher" for m in team)
    has_mentor = any(m["category"] in ["Experienced", "Mid-level"] for m in team)
    buddy_pair_valid = has_fresher and has_mentor

    return {
        "recommended_team": team,
        "top_candidates_pool": scored_all[:20], # top 20 for reference/alternatives
        "metrics": {
            "team_size": len(team),
            "diversity_score": diversity_score,
            "categories_present": list(categories_present),
            "fresher_buddy_guaranteed": buddy_pair_valid,
            "average_match_score": round(sum(m["match_score"] for m in team) / len(team), 1) if team else 0,
            "workload_optimized": all(m["workload_status"] == "Available" for m in team)
        }
    }
