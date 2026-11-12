Phase 0 — Backend and database foundation
First task
- Verify current backend structure.
- Verify Alembic removal.
- Confirm local PostgreSQL connection.
- Inspect existing tables, columns, foreign keys and constraints.
- Confirm SQLAlchemy models match the database.
- Establish reusable error handling and testing conventions.
- Keep Supabase Cloud isolated from development changes.
Completion: Backend can connect to the intended development database without changing existing application records.



Phase 1 — Department Management

Frontend pages:
- /admin/departments
- /admin/departments/[id]
API operations:
Method	Endpoint
POST	/api/v1/institution/departments
GET	/api/v1/institution/departments
GET	/api/v1/institution/departments/{id}
PATCH	/api/v1/institution/departments/{id}
PATCH	/api/v1/institution/departments/{id}/status

Additional requirements:
- Unique department code.
- Search and pagination.
- Activate/deactivate.
- HOD information and faculty/student counts through database queries.
- No permanent deletion.
Completion: Every department operation works through Swagger and persists in PostgreSQL.



Phase 2 — Academic Structure Management

Frontend pages:
- /admin/academics
- /admin/academics/create
- /admin/academics/sections/[id]
Database entities:
- Programs
- Batches
- Academic years
- Academic sessions
- Sections
API operations:
- Create and list programs.
- Create and list batches.
- Create and list academic years.
- Create and list academic sessions.
- Create and list sections.
- Retrieve the complete academic hierarchy.
- Update academic structure where permitted.
Important: Creating a batch and its academic session will be supported through one coordinated workflow. The backend will execute the related inserts in a single transaction.

Completion: Admin can create and view the complete academic hierarchy.



Phase 3 — Faculty Management

Frontend pages:
- /admin/faculty
- /admin/faculty/[id]
Database entities:
- Profiles
- Faculty profiles
- Departments
- Department HOD assignments
API operations:
- Faculty directory.
- Faculty profile details.
- Faculty provisioning.
- Faculty information updates.
- Department association.
- HOD assignment and reassignment.
Completion: Faculty records and their department relationships are consistent.



Phase 4 — Student Management and Registration

Frontend pages:
- /admin/students
- /admin/students/[id]
- /faculty/students
- /faculty/registration
Database entities:
- Student profiles
- Student enrollments
- Registration forms
- Registration submissions
- Section transfers
API operations:
- Student directory and search.
- Student profile details.
- Registration form creation.
- Submission retrieval.
- Submission review.
- Student registration synchronization.
- Enrollment and section transfer.
Completion: A registration submission can be validated, reviewed and converted into a valid student enrollment without duplicating records.



Phase 5 — Teaching and Mentorship Assignments

Frontend pages:
- /admin/teaching-assignments
- /admin/mentorship-assignments
- /faculty/assignments
- /faculty/sections
- /mentor/mentees
Database entities:
- Subjects
- Subject offerings
- Teaching assignments
- Section mentor assignments
Teaching and mentorship will remain separate domains.

Completion: Assignments are correctly associated with faculty, subjects, sections and academic sessions.



Phase 6 — Attendance Management

Frontend pages:
- /faculty/attendance
- /faculty/attendance-history
- /admin/attendance
- /student/attendance
Database entities:
- Attendance sessions
- Attendance records
- Attendance correction requests
API operations:
- Start attendance session.
- Retrieve enrolled students.
- Submit attendance.
- Retrieve attendance history.
- Request corrections.
- Review corrections.
- Lock sessions after their editing window.
Completion: Attendance records are unique per student per session and preserve correction history.



Phase 7 — Mentorship and Follow-ups

Frontend pages:
- /mentor/dashboard
- /mentor/mentees
- /mentor/mentees/[id]
- /mentor/records
- /mentor/follow-ups
Database entities:
- Section mentor assignments
- Mentorship follow-ups
Completion: Mentors can access their assigned students and maintain follow-up records.



Phase 8 — Dashboards, Reports and Notifications

Frontend pages:
- /admin/dashboard
- /admin/reports
- /faculty/dashboard
- /mentor/dashboard
- /student/dashboard
- Notification panels
API operations:
- Institutional summary.
- Department-wise statistics.
- Student and faculty counts.
- Current academic structure.
- Pending registration counts.
- Attendance summaries.
- Notifications and read status.
Completion: Dashboard metrics come from actual database queries, not hardcoded values.



Phase 9 — Authentication, Authorization and Production Hardening

As already decided, authentication comes after the functional modules.
- Supabase authentication integration.
- JWT verification.
- Role-based access control.
- Department and academic-scope permissions.
- PostgreSQL RLS.
- Audit logging.
- Backups and recovery.
- Deployment configuration.
Completion: The system is ready for controlled production deployment.













Database separation: Use separate Supabase development and production environments. Never run experimental schema changes against production.



Schema management: Keep the existing schema and use reviewed, versioned SQL change scripts. No Alembic.



Configuration: Use environment variables and AWS Secrets Manager for production credentials. Never commit secrets.



Database access: Use SQLAlchemy 2.x, connection pooling, transaction boundaries and proper error handling.



Testing: Integration tests must run against an isolated test database, not production.



Deployment: AWS deployment must use environment-specific configuration, health checks, structured logs and controlled releases.



Security: Authentication and authorization remain deferred until functional modules are implemented and tested, as agreed. The API must not be publicly exposed as a production service before that security phase.