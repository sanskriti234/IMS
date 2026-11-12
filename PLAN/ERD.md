[Supabase Auth Users (auth.users)] 1 <---> 1 [profiles]
[departments] 1 <---> 1 [department_hod_assignments] (via faculty)
[departments] 1 <---> N [programs]
[programs] 1 <---> N [batches]
[batches] 1 <---> N [sections]
[batches] 1 <---> N [batch_semester_schedules]
[sections] 1 <---> N [student_enrollments]
[students] 1 <---> N [student_enrollments]
[student_enrollments] 1 <---> N [section_transfer_requests]
[subjects] 1 <---> N [subject_offerings]
[subject_offerings] 1 <---> 1 [teaching_assignments]
[sections] 1 <---> 1 [section_mentor_assignments]
[subject_offerings] 1 <---> N [attendance_sessions]
[attendance_sessions] 1 <---> N [attendance_records]
[attendance_records] 1 <---> N [attendance_correction_requests]
[registration_forms] 1 <---> N [registration_submissions]
[faculty_profiles] 1 <---> N [faculty_permission_grants]
[Biometric Schema (secure)] <---> [face_embeddings] / [recognition_events] (Restricted access)


Yes. We can use the Supabase Cloud Dashboard as the database creation interface instead of applying tables through Alembic.

But we need to follow the correct order: models first, SQL schema second, Supabase Dashboard third.

### Our workflow

1. Finalize SQLAlchemy models

   Define tables, columns, UUIDs, foreign keys, constraints, indexes and relationships.
2. Generate PostgreSQL SQL scripts

   Convert the approved models into SQL `CREATE TABLE`, `ALTER TABLE`, index and constraint statements.
3. Execute through Supabase Dashboard

   Open Supabase → SQL Editor → New Query → paste the reviewed SQL → Run.
4. Verify database

   Check Table Editor, foreign keys, indexes, constraints and relationships.
5. Connect FastAPI

   Use the Supabase Cloud PostgreSQL connection string through Secrets Manager/environment configuration.

### One important distinction

We should still retain Alembic in the project.

- Supabase Dashboard: initial schema creation and visual inspection.
- SQL scripts: controlled database setup.
- Alembic: future schema versioning and upgrades.
- SQLAlchemy: application-side ORM models.

Do not manually create tables independently of the models. That will cause schema drift.

### What we do now

We will finalize all model files before generating SQL.

Current order:

1. `identity.py`
2. `institution.py`
3. `assignments.py`
4. `attendance.py`
5. `registration.py`
6. `monitoring.py`
7. Verify complete schema
8. Generate one reviewed SQL script for Supabase Dashboard.

We will not execute any SQL until the complete schema is approved.








Order	Module	Functionality
1	Institution	Departments, programs, batches, sections
2	Academic Management	Academic years, sessions, student enrollments, transfers
3	Assignments	HOD, faculty, teaching and mentorship assignments
4	Registration	Forms, student submissions, review and approval
5	Attendance	Sessions, records, corrections
6	Monitoring	Audit logs, notifications, mentorship follow-ups
7	Authentication	Supabase Auth, JWT, permissions
8	Security	RLS, access policies and production hardening