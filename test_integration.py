import urllib.request
import json

base = 'http://127.0.0.1:8000'

print("=== 1. Testing /api/stats ===")
req = urllib.request.urlopen(f'{base}/api/stats')
stats = json.loads(req.read().decode('utf-8'))
print(f"Stats OK! Total employees: {stats['total_employees']} | Utilization: {stats['utilization_pct']}%")

print("\n=== 2. Testing /api/employees with Filters ===")
req = urllib.request.urlopen(f'{base}/api/employees?category=Fresher&page_size=5')
res = json.loads(req.read().decode('utf-8'))
print(f"Fresher query OK! Count returned: {len(res['employees'])} | Total freshers in DB: {res['total']}")

print("\n=== 3. Testing /api/allocate/match (AI Matching & Stage 1 Email) ===")
post_data = json.dumps({
    'title': 'High Throughput AI Engine',
    'description': 'PyTorch transformer model with FastAPI',
    'required_skills': ['Python', 'Machine Learning', 'FastAPI'],
    'complexity': 'High',
    'team_size': 3,
    'skip_busy': True,
    'enforce_buddy': True
}).encode('utf-8')

req = urllib.request.Request(f'{base}/api/allocate/match', data=post_data, headers={'Content-Type': 'application/json'})
match_res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
print(f"Match OK! Recommended team size: {len(match_res['recommended_team'])}")
print(f"Stage 1 Preview notifications dispatched: {match_res['stage_1_notifications_sent']}")
for m in match_res['recommended_team']:
    print(f"   * {m['name']} ({m['category']}) | Role: {m['assigned_role']} | Match Score: {m['match_score']}")

print("\n=== 4. Testing /api/allocate/confirm (Manager Authorization & Stage 2 Email) ===")
confirm_data = json.dumps({
    'task_id': match_res['task']['id'],
    'task_title': match_res['task']['title'],
    'complexity': match_res['task']['complexity'],
    'assigned_team': match_res['recommended_team']
}).encode('utf-8')

req = urllib.request.Request(f'{base}/api/allocate/confirm', data=confirm_data, headers={'Content-Type': 'application/json'})
confirm_res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
print(f"Confirm OK! Stage 2 confirmation emails dispatched: {confirm_res['stage_2_notifications_sent']}")

print("\n=== 5. Testing /api/notifications (Audit Log) ===")
req = urllib.request.urlopen(f'{base}/api/notifications')
notifs = json.loads(req.read().decode('utf-8'))
print(f"Audit log entry count: {len(notifs)}")
print(f"Latest Notification: {notifs[0]['subject']} -> [{notifs[0]['status_label']}]")

print("\n=== 6. Testing /api/reports/generate (Automate Dev Reports Feature 6) ===")
rep_data = json.dumps({'developer_name': 'Nandhini Shankar', 'role': 'Debugger'}).encode('utf-8')
req = urllib.request.Request(f'{base}/api/reports/generate', data=rep_data, headers={'Content-Type': 'application/json'})
rep_res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
print(f"Dev Report OK! Velocity: {rep_res['velocity_score']}")
print(f"Summary: {rep_res['executive_summary'][:90]}...")

print("\n=== 7. Testing Frontend Server Availability ===")
req = urllib.request.urlopen('http://127.0.0.1:5173/')
html_content = req.read().decode('utf-8')
assert 'SmartAllocate AI' in html_content, "Frontend index.html should contain SmartAllocate AI"
print("Frontend server OK! Serving index.html on port 5173")

print("\n>>> ALL INTEGRATION TESTS COMPLETED SUCCESSFULLY! <<<")
