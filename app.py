"""MishGa contact enquiry API and secure admin-session server."""
import os
import sqlite3
import smtplib
from datetime import datetime, timezone
from email.message import EmailMessage
from functools import wraps
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory, session
from dotenv import load_dotenv
from werkzeug.security import check_password_hash, generate_password_hash

ROOT = Path(__file__).parent
DATABASE = ROOT / "data" / "mishga.db"
load_dotenv(ROOT / ".env")
app = Flask(__name__, static_folder=None)
app.config.update(
    SECRET_KEY=os.environ.get("MISHGA_SECRET_KEY", "change-this-secret-before-production"),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)
# Set this environment variable before production. The fallback is development-only.
ADMIN_PASSWORD_HASH = os.environ.get("MISHGA_ADMIN_PASSWORD_HASH") or generate_password_hash(os.environ.get("MISHGA_ADMIN_PASSWORD", "mishga2026"))
NOTIFICATION_EMAIL = os.environ.get("MISHGA_NOTIFICATION_EMAIL", "mishgaonline@gmail.com")
SMTP_HOST = os.environ.get("MISHGA_SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("MISHGA_SMTP_PORT", "465"))
SMTP_USER = os.environ.get("MISHGA_SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("MISHGA_SMTP_PASSWORD", "")

def get_db():
    DATABASE.parent.mkdir(exist_ok=True)
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection

def initialize_database():
    with get_db() as db:
        db.execute("""CREATE TABLE IF NOT EXISTS enquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
            phone TEXT, service TEXT, message TEXT NOT NULL, created_at TEXT NOT NULL)""")
        db.execute("""CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL,
            technologies TEXT, live_url TEXT, case_study_url TEXT, published INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL, updated_at TEXT NOT NULL)""")

def send_enquiry_notification(enquiry):
    """Email the MishGa inbox after a successful contact-form submission."""
    if not SMTP_USER or not SMTP_PASSWORD:
        app.logger.warning("Enquiry saved, but email notification is not configured.")
        return False
    message = EmailMessage()
    message["Subject"] = f"New MishGa enquiry from {enquiry['name']}"
    message["From"] = SMTP_USER
    message["To"] = NOTIFICATION_EMAIL
    message["Reply-To"] = enquiry["email"]
    message.set_content(f"""A new enquiry was submitted on the MishGa website.

Name: {enquiry['name']}
Email: {enquiry['email']}
Phone: {enquiry['phone'] or 'Not provided'}
Service: {enquiry['service'] or 'General enquiry'}
Received: {enquiry['created_at']}

Message:
{enquiry['message']}
""")
    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=15) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(message)
        return True
    except (OSError, smtplib.SMTPException) as error:
        app.logger.error("Could not send enquiry notification: %s", error)
        return False

def admin_required(handler):
    @wraps(handler)
    def wrapped(*args, **kwargs):
        if not session.get("is_admin"):
            return jsonify({"error": "Unauthorized"}), 401
        return handler(*args, **kwargs)
    return wrapped

@app.get("/")
def home(): return send_from_directory(ROOT, "index.html")

@app.get("/admin")
def admin(): return send_from_directory(ROOT, "admin.html")

@app.get("/dashboard")
def dashboard(): return send_from_directory(ROOT, "dashboard.html")

@app.get("/projects")
def projects_page(): return send_from_directory(ROOT, "projects.html")

@app.get("/<path:filename>")
def static_files(filename): return send_from_directory(ROOT, filename)

@app.post("/api/enquiries")
def create_enquiry():
    payload = request.get_json(silent=True) or {}
    required = [field for field in ("name", "email", "message") if not str(payload.get(field, "")).strip()]
    if required: return jsonify({"error": "Missing required fields"}), 400
    enquiry = {
        "name": payload["name"].strip(), "email": payload["email"].strip(),
        "phone": payload.get("phone", "").strip(), "service": payload.get("service", "").strip(),
        "message": payload["message"].strip(), "created_at": datetime.now(timezone.utc).isoformat(),
    }
    with get_db() as db:
        db.execute("INSERT INTO enquiries (name,email,phone,service,message,created_at) VALUES (?,?,?,?,?,?)", tuple(enquiry.values()))
    send_enquiry_notification(enquiry)
    return jsonify({"success": True}), 201

@app.get("/api/enquiries")
@admin_required
def list_enquiries():
    with get_db() as db: rows = db.execute("SELECT * FROM enquiries ORDER BY id DESC").fetchall()
    return jsonify([dict(row) for row in rows])

@app.delete("/api/enquiries")
@admin_required
def delete_all_enquiries():
    with get_db() as db: db.execute("DELETE FROM enquiries")
    return "", 204

@app.delete("/api/enquiries/<int:enquiry_id>")
@admin_required
def delete_enquiry(enquiry_id):
    with get_db() as db: db.execute("DELETE FROM enquiries WHERE id = ?", (enquiry_id,))
    return "", 204

@app.get("/api/projects")
def list_projects():
    with get_db() as db:
        rows = db.execute("SELECT * FROM projects ORDER BY updated_at DESC").fetchall()
    if not session.get("is_admin"):
        rows = [row for row in rows if row["published"]]
    return jsonify([dict(row) for row in rows])

def project_payload():
    payload = request.get_json(silent=True) or {}
    if not str(payload.get("title", "")).strip() or not str(payload.get("description", "")).strip():
        return None
    return {
        "title": payload["title"].strip(), "description": payload["description"].strip(),
        "technologies": payload.get("technologies", "").strip(), "live_url": payload.get("live_url", "").strip(),
        "case_study_url": payload.get("case_study_url", "").strip(), "published": 1 if payload.get("published", True) else 0,
    }

@app.post("/api/projects")
@admin_required
def create_project():
    project = project_payload()
    if not project: return jsonify({"error": "Title and description are required"}), 400
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as db:
        cursor = db.execute("INSERT INTO projects (title,description,technologies,live_url,case_study_url,published,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)", (*project.values(), now, now))
    return jsonify({"id": cursor.lastrowid, "success": True}), 201

@app.put("/api/projects/<int:project_id>")
@admin_required
def update_project(project_id):
    project = project_payload()
    if not project: return jsonify({"error": "Title and description are required"}), 400
    with get_db() as db:
        db.execute("UPDATE projects SET title=?,description=?,technologies=?,live_url=?,case_study_url=?,published=?,updated_at=? WHERE id=?", (*project.values(), datetime.now(timezone.utc).isoformat(), project_id))
    return jsonify({"success": True})

@app.delete("/api/projects/<int:project_id>")
@admin_required
def delete_project(project_id):
    with get_db() as db: db.execute("DELETE FROM projects WHERE id = ?", (project_id,))
    return "", 204

@app.post("/api/login")
def login():
    password = (request.get_json(silent=True) or {}).get("password", "")
    if not check_password_hash(ADMIN_PASSWORD_HASH, password): return jsonify({"error": "Invalid credentials"}), 401
    session.clear(); session["is_admin"] = True
    return jsonify({"success": True})

@app.post("/api/logout")
def logout(): session.clear(); return "", 204

@app.get("/api/session")
def current_session(): return jsonify({"authenticated": bool(session.get("is_admin"))})

# Create the table for both `python app.py` and WSGI production servers.
initialize_database()

if __name__ == "__main__":
    app.run(debug=True)
