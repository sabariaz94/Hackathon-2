"""Email service using Resend API for task reminders."""

import resend
from typing import Optional
from datetime import datetime
from pathlib import Path

from config import settings


class EmailService:
    """Service for sending emails via Resend API."""

    def __init__(self):
        """Initialize the email service with Resend API key."""
        resend.api_key = settings.RESEND_API_KEY
        self.from_email = settings.EMAIL_FROM_ADDRESS or "noreply@obsidianlist.com"
        self.template_dir = Path(__file__).parent.parent / "templates"

    def _load_template(self, template_name: str) -> str:
        """Load an HTML template from the templates directory."""
        template_path = self.template_dir / template_name
        if template_path.exists():
            return template_path.read_text()
        return ""

    def _render_reminder_email(
        self,
        task_title: str,
        task_description: Optional[str],
        reminder_time: str,
        reminder_date: str,
        user_name: str,
    ) -> str:
        """Render the reminder email template with task details."""
        template = self._load_template("reminder_email.html")

        if not template:
            # Fallback to inline template
            template = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Reminder - ObsidianList</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #18181b; border-radius: 16px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 32px 40px; background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                                ObsidianList
                            </h1>
                            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">
                                Task Reminder
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 24px; color: #a1a1aa; font-size: 16px;">
                                Hi {{USER_NAME}},
                            </p>
                            <p style="margin: 0 0 24px; color: #a1a1aa; font-size: 16px;">
                                This is a friendly reminder about your upcoming task:
                            </p>

                            <!-- Task Card -->
                            <div style="background-color: #27272a; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #7c3aed;">
                                <h2 style="margin: 0 0 12px; color: #ffffff; font-size: 20px; font-weight: 600;">
                                    {{TASK_TITLE}}
                                </h2>
                                {{TASK_DESCRIPTION_BLOCK}}
                                <div style="display: flex; gap: 16px; margin-top: 16px;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span style="color: #7c3aed;">&#128197;</span>
                                        <span style="color: #a1a1aa; font-size: 14px;">{{REMINDER_DATE}}</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span style="color: #7c3aed;">&#128336;</span>
                                        <span style="color: #a1a1aa; font-size: 14px;">{{REMINDER_TIME}}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="{{APP_URL}}/dashboard" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
                                            View Task
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #0f0f0f; border-top: 1px solid #27272a;">
                            <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
                                You're receiving this email because you set a reminder on ObsidianList.
                            </p>
                            <p style="margin: 8px 0 0; color: #71717a; font-size: 12px; text-align: center;">
                                &copy; {{YEAR}} ObsidianList. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""

        # Replace placeholders
        description_block = ""
        if task_description:
            description_block = f'<p style="margin: 0; color: #a1a1aa; font-size: 14px;">{task_description}</p>'

        html = template.replace("{{USER_NAME}}", user_name)
        html = html.replace("{{TASK_TITLE}}", task_title)
        html = html.replace("{{TASK_DESCRIPTION_BLOCK}}", description_block)
        html = html.replace("{{REMINDER_DATE}}", reminder_date)
        html = html.replace("{{REMINDER_TIME}}", reminder_time)
        html = html.replace("{{APP_URL}}", settings.FRONTEND_URL or "https://obsidianlist.vercel.app")
        html = html.replace("{{YEAR}}", str(datetime.now().year))

        return html

    async def send_reminder(
        self,
        to_email: str,
        user_name: str,
        task_title: str,
        task_description: Optional[str],
        reminder_time: str,
        reminder_date: str,
        max_retries: int = 3,
    ) -> dict:
        """
        Send a task reminder email.

        Args:
            to_email: Recipient email address
            user_name: User's name for personalization
            task_title: Title of the task
            task_description: Optional task description
            reminder_time: Formatted reminder time
            reminder_date: Formatted reminder date
            max_retries: Maximum number of retry attempts

        Returns:
            Dict with 'success' boolean and 'message' or 'error'
        """
        if not settings.RESEND_API_KEY:
            return {"success": False, "error": "Email service not configured"}

        html_content = self._render_reminder_email(
            task_title=task_title,
            task_description=task_description,
            reminder_time=reminder_time,
            reminder_date=reminder_date,
            user_name=user_name,
        )

        # Retry logic
        last_error = None
        for attempt in range(max_retries):
            try:
                params: resend.Emails.SendParams = {
                    "from": f"ObsidianList <{self.from_email}>",
                    "to": [to_email],
                    "subject": f"Reminder: {task_title}",
                    "html": html_content,
                }

                result = resend.Emails.send(params)

                if result.get("id"):
                    return {"success": True, "message_id": result["id"]}

            except Exception as e:
                last_error = str(e)
                if attempt < max_retries - 1:
                    # Wait before retry (exponential backoff)
                    import asyncio
                    await asyncio.sleep(2 ** attempt)
                continue

        return {"success": False, "error": last_error or "Failed to send email"}


# Global email service instance
email_service = EmailService()
