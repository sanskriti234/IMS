
import logging
import smtplib

from email.message import EmailMessage
from html import escape

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_faculty_credentials_email(
    *,
    recipient: str,
    faculty_name: str,
    designation: str,
    department: str,
    employee_code: str,
    temporary_password: str,
) -> None:
    frontend_url = settings.FRONTEND_URL.rstrip("/")
    login_url = f"{frontend_url}/login"

    message = EmailMessage()
    message["Subject"] = "Your CoreSight Faculty Account Is Ready"
    message["From"] = settings.SMTP_FROM_EMAIL
    message["To"] = recipient

    message.set_content(
        f"""
Dear {faculty_name},

Your faculty account has been created in CoreSight.

FACULTY DETAILS
Name: {faculty_name}
Designation: {designation}
Department: {department}
Employee Code: {employee_code}

LOGIN CREDENTIALS
Login URL: {login_url}
Email: {recipient}
Temporary Password: {temporary_password}

Please log in and change your temporary password immediately.

Do not share your credentials with anyone.

Regards,
CoreSight Administration
"""
    )

    message.add_alternative(
        f"""
        <html>
          <body style="font-family:Arial,sans-serif;color:#1f2937;">
            <h2>Welcome to CoreSight</h2>
            <p>Dear {escape(faculty_name)},</p>
            <p>Your faculty account has been created successfully.</p>

            <h3>Faculty Details</h3>
            <p>
              <b>Name:</b> {escape(faculty_name)}<br>
              <b>Designation:</b> {escape(designation)}<br>
              <b>Department:</b> {escape(department)}<br>
              <b>Employee Code:</b> {escape(employee_code)}
            </p>

            <h3>Login Credentials</h3>
            <p>
              <b>Login URL:</b>
              <a href="{escape(login_url, quote=True)}">Open CoreSight</a><br>
              <b>Email:</b> {escape(recipient)}<br>
              <b>Temporary Password:</b>
              <code>{escape(temporary_password)}</code>
            </p>

            <p>
              Change your temporary password immediately after your
              first login. Do not share these credentials.
            </p>

            <p>Regards,<br>CoreSight Administration</p>
          </body>
        </html>
        """,
        subtype="html",
    )

    try:
        with smtplib.SMTP(
            settings.SMTP_HOST,
            settings.SMTP_PORT,
            timeout=20,
        ) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()

            server.login(
                settings.SMTP_USERNAME,
                settings.SMTP_PASSWORD,
            )

            server.send_message(message)

        logger.info(
            "Faculty credentials email sent to %s",
            recipient,
        )

    except Exception:
        logger.exception(
            "Failed to send faculty credentials email to %s",
            recipient,
        )
        raise
