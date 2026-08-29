import datetime
from typing import List, Dict, Any, Optional

class EmailNotificationService:
    def __init__(self):
        self.notification_log: List[Dict[str, Any]] = []
        self._init_sample_notifications()

    def _init_sample_notifications(self):
        now = datetime.datetime.now()
        # Seed a few initial audit logs for demonstrative visibility
        self.notification_log.append({
            "id": "NOTIF-0001",
            "timestamp": (now - datetime.timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S"),
            "task_id": "TSK-1001",
            "task_title": "Enterprise Cloud Migration & Microservices Gateway",
            "employee_id": "EMP-0005",
            "employee_name": "Sathish Reddy",
            "employee_email": "sathish.reddy005@smartallocate-demo.com",
            "stage": "preview",
            "status_label": "Preview Sent",
            "subject": "Recommendation Notice: Enterprise Cloud Migration & Microservices Gateway",
            "role": "Cloud Architect",
            "preview_snippet": "You have been recommended by SmartAllocate AI for the upcoming Enterprise Cloud Migration task.",
            "html_content": self._render_preview_html(
                "Sathish Reddy", "Enterprise Cloud Migration & Microservices Gateway",
                "High", ["DevOps", "Kubernetes", "AWS", "Terraform"],
                "Exceptional leadership score (4.8/5) and strong proven track record in cloud architecture."
            )
        })

    def send_preview_notification(self, employee: Dict[str, Any], task: Dict[str, Any], reason: str) -> Dict[str, Any]:
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        notif_id = f"NOTIF-{len(self.notification_log) + 1:04d}"
        
        subject = f"[Recommendation Notice] You have been recommended for: {task.get('title')}"
        html_body = self._render_preview_html(
            employee["name"], task.get("title", "Untitled Task"),
            task.get("complexity", "Medium"), task.get("required_skills", []),
            reason
        )

        entry = {
            "id": notif_id,
            "timestamp": now,
            "task_id": task.get("id", "TSK-GEN"),
            "task_title": task.get("title", "Untitled Task"),
            "employee_id": employee["id"],
            "employee_name": employee["name"],
            "employee_email": employee["email"],
            "stage": "preview",
            "status_label": "Preview Sent",
            "subject": subject,
            "role": "Recommended Candidate",
            "preview_snippet": f"SmartAllocate AI recommendation preview generated. Awaiting manager confirmation.",
            "html_content": html_body
        }
        self.notification_log.insert(0, entry)
        return entry

    def send_confirmation_notification(self, employee: Dict[str, Any], task: Dict[str, Any], role: str, team_members: List[Dict[str, Any]]) -> Dict[str, Any]:
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        notif_id = f"NOTIF-{len(self.notification_log) + 1:04d}"
        
        subject = f"[Confirmed Assignment] Official Team Assignment: {task.get('title')}"
        html_body = self._render_confirmation_html(
            employee["name"], task.get("title", "Untitled Task"),
            task.get("complexity", "Medium"), role,
            task.get("deadline", "14 Days"), team_members
        )

        entry = {
            "id": notif_id,
            "timestamp": now,
            "task_id": task.get("id", "TSK-GEN"),
            "task_title": task.get("title", "Untitled Task"),
            "employee_id": employee["id"],
            "employee_name": employee["name"],
            "employee_email": employee["email"],
            "stage": "confirmed",
            "status_label": "Confirmed Sent",
            "subject": subject,
            "role": role,
            "preview_snippet": f"Official assignment confirmed by Manager. Role: {role}.",
            "html_content": html_body
        }
        self.notification_log.insert(0, entry)
        return entry

    def get_all_notifications(self, filter_stage: Optional[str] = None) -> List[Dict[str, Any]]:
        if filter_stage:
            return [n for n in self.notification_log if n["stage"] == filter_stage]
        return self.notification_log

    def _render_preview_html(self, emp_name: str, task_title: str, complexity: str, skills: List[str], reason: str) -> str:
        skills_pills = "".join([f"<span style='display:inline-block;background:#e0e7ff;color:#3730a3;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600;margin-right:6px;margin-bottom:6px;'>{s}</span>" for s in skills])
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
            .header {{ background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; padding: 24px; }}
            .badge {{ display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 8px; }}
            .content {{ padding: 24px; }}
            .box {{ background: #f1f5f9; border-left: 4px solid #6366f1; padding: 14px; border-radius: 4px; margin: 16px 0; }}
            .footer {{ background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin:0;font-size:20px;">SmartAllocate AI Notification</h2>
              <p style="margin:4px 0 0 0;font-size:13px;opacity:0.9;">Candidate Recommendation Preview</p>
              <div class="badge">Stage 1 — Pending Manager Approval</div>
            </div>
            <div class="content">
              <p>Hello <strong>{emp_name}</strong>,</p>
              <p>You have been identified by <strong>SmartAllocate AI</strong> as a high-affinity match for an upcoming initiative based on your verified skill matrix and performance history.</p>
              
              <div class="box">
                <div style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;">Task Opportunity</div>
                <div style="font-size:16px;font-weight:700;color:#0f172a;margin:4px 0;">{task_title}</div>
                <div style="font-size:13px;color:#475569;">Complexity Level: <strong>{complexity}</strong></div>
              </div>

              <div style="margin: 16px 0;">
                <div style="font-size:13px;font-weight:600;margin-bottom:8px;color:#334155;">Key Required Skills:</div>
                {skills_pills}
              </div>

              <div style="background:#ecfdf5;border-left:4px solid:#10b981;padding:12px;border-radius:4px;margin:16px 0;">
                <strong style="color:#065f46;font-size:13px;">AI Match Rationalization:</strong>
                <p style="color:#047857;font-size:13px;margin:4px 0 0 0;">{reason}</p>
              </div>

              <p style="font-size:13px;color:#64748b;"><em>Note: This is an automated advisory notification. Your engineering manager is reviewing the proposed team composition. You will receive a final confirmation once approved.</em></p>
            </div>
            <div class="footer">
              SmartAllocate AI • Autonomous Workforce Intelligence System
            </div>
          </div>
        </body>
        </html>
        """

    def _render_confirmation_html(self, emp_name: str, task_title: str, complexity: str, role: str, deadline: str, team_members: List[Dict[str, Any]]) -> str:
        team_rows = "".join([
            f"<li style='margin-bottom:6px;font-size:13px;'><strong>{m.get('name')}</strong> &mdash; <span style='color:#6366f1;font-weight:600;'>{m.get('role', 'Contributor')}</span> ({m.get('category', 'Member')})</li>"
            for m in team_members
        ])
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
            .header {{ background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; padding: 24px; }}
            .badge {{ display: inline-block; background: #dcfce7; color: #14532d; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 8px; }}
            .content {{ padding: 24px; }}
            .box {{ background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 16px 0; }}
            .footer {{ background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin:0;font-size:20px;">Task Assignment Confirmed! 🎉</h2>
              <p style="margin:4px 0 0 0;font-size:13px;opacity:0.9;">Official Team Allocation & Kickoff Brief</p>
              <div class="badge">Stage 2 — Official Confirmation</div>
            </div>
            <div class="content">
              <p>Hi <strong>{emp_name}</strong>,</p>
              <p>Your assignment to <strong>{task_title}</strong> has been officially confirmed and authorized by management.</p>
              
              <div class="box">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                  <span style="color:#64748b;font-size:13px;">Assigned Role:</span>
                  <span style="font-weight:700;color:#059669;font-size:14px;">{role}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                  <span style="color:#64748b;font-size:13px;">Complexity:</span>
                  <span style="font-weight:600;font-size:13px;">{complexity}</span>
                </div>
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:#64748b;font-size:13px;">Target Sprint / Timeline:</span>
                  <span style="font-weight:600;font-size:13px;">{deadline}</span>
                </div>
              </div>

              <div style="margin: 18px 0;">
                <h4 style="margin:0 0 10px 0;font-size:14px;color:#1e293b;">Assigned Team & Mentorship Roster:</h4>
                <ul style="padding-left:20px;margin:0;">
                  {team_rows}
                </ul>
              </div>

              <p style="font-size:13px;color:#475569;background:#f1f5f9;padding:12px;border-radius:6px;">
                🚀 <strong>Next Steps:</strong> The project repository and Jira sprint board have been populated. Please attend the synchronized sprint kickoff.
              </p>
            </div>
            <div class="footer">
              SmartAllocate AI • Autonomous Workforce Intelligence System
            </div>
          </div>
        </body>
        </html>
        """

email_service = EmailNotificationService()
