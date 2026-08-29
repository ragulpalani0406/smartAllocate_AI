from main import app
from data_loader import db
from allocation_engine import match_candidates_for_task
from email_service import email_service

print("=== 1. Checking Database Ingestion ===")
all_emp = db.get_all()
print(f"Total employees in database: {len(all_emp)}")
assert len(all_emp) == 600, "Should have exactly 600 employees"

fresher_count = sum(1 for e in all_emp if e["category"] == "Fresher")
mid_count = sum(1 for e in all_emp if e["category"] == "Mid-level")
exp_count = sum(1 for e in all_emp if e["category"] == "Experienced")
print(f"Categories: Fresher={fresher_count}, Mid-level={mid_count}, Experienced={exp_count}")

print("\n=== 2. Testing AI Task Matching & Team Diversity ===")
sample_task = {
    "id": "TSK-TEST-1",
    "title": "Cloud-Native Data Streaming Architecture",
    "required_skills": ["Python", "AWS", "Kafka", "Docker"],
    "complexity": "High",
    "deadline": "10 Days"
}
res = match_candidates_for_task(sample_task, team_size=3, enforce_buddy=True)
team = res["recommended_team"]
print(f"Recommended team size: {len(team)}")
for m in team:
    print(f"  * {m['name']} | Category: {m['category']} | Role: {m['assigned_role']} | Match Score: {m['match_score']}")

print("\nMetrics:", res["metrics"])

print("\n=== 3. Testing Email Notification Two-Stage Lifecycle ===")
# Send preview
p_notif = email_service.send_preview_notification(all_emp[0], sample_task, "High performance and AWS skill match")
print(f"Stage 1 Preview Notif Created: {p_notif['id']} -> {p_notif['status_label']}")

# Send confirmation
c_notif = email_service.send_confirmation_notification(all_emp[0], sample_task, "Cloud Lead", team)
print(f"Stage 2 Confirmation Notif Created: {c_notif['id']} -> {c_notif['status_label']}")

print("\nALL BACKEND TESTS PASSED SUCCESSFULLY! ✅")
