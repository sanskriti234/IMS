-- CoreSight SIS PostgreSQL Schema
-- Generated from SQLAlchemy ORM metadata.
-- Review this file before executing it in Supabase SQL Editor.
-- This script does not create or connect to a database.

SET search_path TO public;

CREATE TYPE role_type AS ENUM ('admin', 'faculty', 'student');

CREATE TYPE academic_year_status AS ENUM ('planned', 'active', 'completed');

CREATE TYPE academic_session_status AS ENUM ('planned', 'active', 'completed', 'cancelled');

CREATE TYPE enrollment_status AS ENUM ('active', 'transferred', 'completed', 'withdrawn');

CREATE TYPE transfer_request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE offering_status AS ENUM ('active', 'completed', 'cancelled');

CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

CREATE TYPE correction_request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected', 'changes_requested');

CREATE TABLE profiles (
	id UUID NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	full_name VARCHAR(255) NOT NULL, 
	role_type role_type NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (email)
);

CREATE TABLE departments (
	id UUID NOT NULL, 
	code VARCHAR(50) NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (code)
);

CREATE TABLE academic_years (
	id UUID NOT NULL, 
	name VARCHAR(20) NOT NULL, 
	start_date DATE NOT NULL, 
	end_date DATE NOT NULL, 
	status academic_year_status NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT ck_academic_year_valid_dates CHECK (end_date > start_date), 
	UNIQUE (name)
);

CREATE TABLE faculty_profiles (
	id UUID NOT NULL, 
	profile_id UUID NOT NULL, 
	employee_code VARCHAR(50) NOT NULL, 
	designation VARCHAR(100) NOT NULL, 
	department_id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (profile_id), 
	FOREIGN KEY(profile_id) REFERENCES profiles (id) ON DELETE RESTRICT, 
	UNIQUE (employee_code), 
	FOREIGN KEY(department_id) REFERENCES departments (id) ON DELETE RESTRICT
);

CREATE TABLE programs (
	id UUID NOT NULL, 
	department_id UUID NOT NULL, 
	code VARCHAR(50) NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	total_semesters INTEGER NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_program_department_code UNIQUE (department_id, code), 
	CONSTRAINT ck_program_total_semesters_positive CHECK (total_semesters > 0), 
	FOREIGN KEY(department_id) REFERENCES departments (id) ON DELETE RESTRICT
);

CREATE TABLE subjects (
	id UUID NOT NULL, 
	department_id UUID NOT NULL, 
	code VARCHAR(50) NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	credits INTEGER NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_subject_department_code UNIQUE (department_id, code), 
	CONSTRAINT ck_subject_credits_positive CHECK (credits > 0), 
	FOREIGN KEY(department_id) REFERENCES departments (id) ON DELETE RESTRICT
);

CREATE TABLE audit_logs (
	id UUID NOT NULL, 
	user_id UUID, 
	action VARCHAR(100) NOT NULL, 
	target_table VARCHAR(100) NOT NULL, 
	target_id UUID, 
	changes JSON, 
	ip_address VARCHAR(45), 
	timestamp TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES profiles (id) ON DELETE SET NULL
);

CREATE INDEX ix_audit_log_user_timestamp ON audit_logs (user_id, timestamp);

CREATE INDEX ix_audit_log_target ON audit_logs (target_table, target_id);

CREATE TABLE notifications (
	id UUID NOT NULL, 
	recipient_id UUID NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	message TEXT NOT NULL, 
	is_read BOOLEAN NOT NULL, 
	read_at TIMESTAMP WITH TIME ZONE, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(recipient_id) REFERENCES profiles (id) ON DELETE CASCADE
);

CREATE INDEX ix_notification_recipient_read ON notifications (recipient_id, is_read);

CREATE TABLE department_hod_assignments (
	id UUID NOT NULL, 
	department_id UUID NOT NULL, 
	faculty_id UUID NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	assigned_by UUID NOT NULL, 
	ended_at TIMESTAMP WITH TIME ZONE, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT ck_hod_assignment_active_ended_at CHECK (
            (is_active IS TRUE AND ended_at IS NULL)
            OR
            (is_active IS FALSE AND ended_at IS NOT NULL)
            ), 
	FOREIGN KEY(department_id) REFERENCES departments (id) ON DELETE RESTRICT, 
	FOREIGN KEY(faculty_id) REFERENCES faculty_profiles (id) ON DELETE RESTRICT, 
	FOREIGN KEY(assigned_by) REFERENCES profiles (id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX uq_one_active_hod_per_department ON department_hod_assignments (department_id) WHERE is_active IS TRUE;

CREATE TABLE batches (
	id UUID NOT NULL, 
	program_id UUID NOT NULL, 
	start_year INTEGER NOT NULL, 
	end_year INTEGER NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_batch_program_years UNIQUE (program_id, start_year, end_year), 
	CONSTRAINT ck_batch_valid_year_range CHECK (end_year > start_year), 
	FOREIGN KEY(program_id) REFERENCES programs (id) ON DELETE RESTRICT
);

CREATE TABLE student_profiles (
	id UUID NOT NULL, 
	profile_id UUID NOT NULL, 
	enrollment_number VARCHAR(50) NOT NULL, 
	current_batch_id UUID NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (profile_id), 
	FOREIGN KEY(profile_id) REFERENCES profiles (id) ON DELETE RESTRICT, 
	FOREIGN KEY(current_batch_id) REFERENCES batches (id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX ix_student_profiles_enrollment_number ON student_profiles (enrollment_number);

CREATE TABLE sections (
	id UUID NOT NULL, 
	batch_id UUID NOT NULL, 
	name VARCHAR(50) NOT NULL, 
	capacity_informational INTEGER NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_section_batch_name UNIQUE (batch_id, name), 
	CONSTRAINT ck_section_capacity_positive CHECK (capacity_informational > 0), 
	FOREIGN KEY(batch_id) REFERENCES batches (id) ON DELETE RESTRICT
);

CREATE TABLE academic_sessions (
	id UUID NOT NULL, 
	academic_year_id UUID NOT NULL, 
	batch_id UUID NOT NULL, 
	semester_number INTEGER NOT NULL, 
	start_date DATE NOT NULL, 
	end_date DATE NOT NULL, 
	status academic_session_status NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_batch_academic_year_semester UNIQUE (batch_id, academic_year_id, semester_number), 
	CONSTRAINT ck_academic_sessions_semester_number CHECK (semester_number > 0), 
	CONSTRAINT ck_academic_session_valid_dates CHECK (end_date > start_date), 
	FOREIGN KEY(academic_year_id) REFERENCES academic_years (id) ON DELETE RESTRICT, 
	FOREIGN KEY(batch_id) REFERENCES batches (id) ON DELETE RESTRICT
);

CREATE INDEX ix_academic_session_batch_status ON academic_sessions (batch_id, status);

CREATE TABLE student_enrollments (
	id UUID NOT NULL, 
	student_id UUID NOT NULL, 
	academic_session_id UUID NOT NULL, 
	section_id UUID NOT NULL, 
	status enrollment_status NOT NULL, 
	enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	ended_at TIMESTAMP WITH TIME ZONE, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT ck_enrollment_status_dates CHECK (
            (status = 'active' AND ended_at IS NULL)
            OR
            (status != 'active' AND ended_at IS NOT NULL)
            ), 
	FOREIGN KEY(student_id) REFERENCES student_profiles (id) ON DELETE RESTRICT, 
	FOREIGN KEY(academic_session_id) REFERENCES academic_sessions (id) ON DELETE RESTRICT, 
	FOREIGN KEY(section_id) REFERENCES sections (id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX uq_active_student_enrollment_per_session ON student_enrollments (student_id, academic_session_id) WHERE status = 'active';

CREATE INDEX ix_enrollment_section_session ON student_enrollments (section_id, academic_session_id);

CREATE TABLE subject_offerings (
	id UUID NOT NULL, 
	subject_id UUID NOT NULL, 
	section_id UUID NOT NULL, 
	academic_session_id UUID NOT NULL, 
	semester_number INTEGER NOT NULL, 
	status offering_status NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_subject_offering_section_session UNIQUE (subject_id, section_id, academic_session_id), 
	CONSTRAINT ck_offering_semester_positive CHECK (semester_number > 0), 
	FOREIGN KEY(subject_id) REFERENCES subjects (id) ON DELETE RESTRICT, 
	FOREIGN KEY(section_id) REFERENCES sections (id) ON DELETE RESTRICT, 
	FOREIGN KEY(academic_session_id) REFERENCES academic_sessions (id) ON DELETE RESTRICT
);

CREATE TABLE section_mentor_assignments (
	id UUID NOT NULL, 
	section_id UUID NOT NULL, 
	faculty_id UUID NOT NULL, 
	academic_session_id UUID NOT NULL, 
	assigned_by UUID NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	ended_at TIMESTAMP WITH TIME ZONE, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT ck_mentor_assignment_active_ended_at CHECK (
            (is_active IS TRUE AND ended_at IS NULL)
            OR
            (is_active IS FALSE AND ended_at IS NOT NULL)
            ), 
	FOREIGN KEY(section_id) REFERENCES sections (id) ON DELETE RESTRICT, 
	FOREIGN KEY(faculty_id) REFERENCES faculty_profiles (id) ON DELETE RESTRICT, 
	FOREIGN KEY(academic_session_id) REFERENCES academic_sessions (id) ON DELETE RESTRICT, 
	FOREIGN KEY(assigned_by) REFERENCES profiles (id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX uq_active_section_mentor_per_session ON section_mentor_assignments (section_id, academic_session_id) WHERE is_active IS TRUE;

CREATE TABLE registration_forms (
	id UUID NOT NULL, 
	academic_session_id UUID NOT NULL, 
	batch_id UUID NOT NULL, 
	created_by UUID NOT NULL, 
	title TEXT NOT NULL, 
	form_schema JSON NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(academic_session_id) REFERENCES academic_sessions (id) ON DELETE RESTRICT, 
	FOREIGN KEY(batch_id) REFERENCES batches (id) ON DELETE RESTRICT, 
	FOREIGN KEY(created_by) REFERENCES profiles (id) ON DELETE RESTRICT
);

CREATE INDEX ix_registration_form_session_batch ON registration_forms (academic_session_id, batch_id);

CREATE TABLE section_transfer_requests (
	id UUID NOT NULL, 
	enrollment_id UUID NOT NULL, 
	target_section_id UUID NOT NULL, 
	requested_by UUID NOT NULL, 
	reason VARCHAR(1000) NOT NULL, 
	status transfer_request_status NOT NULL, 
	reviewed_by UUID, 
	reviewed_at TIMESTAMP WITH TIME ZONE, 
	review_notes VARCHAR(1000), 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT ck_transfer_request_review_consistency CHECK (
            (status = 'pending' AND reviewed_by IS NULL AND reviewed_at IS NULL)
            OR
            (status IN ('approved', 'rejected')
                AND reviewed_by IS NOT NULL
                AND reviewed_at IS NOT NULL)
            ), 
	FOREIGN KEY(enrollment_id) REFERENCES student_enrollments (id) ON DELETE RESTRICT, 
	FOREIGN KEY(target_section_id) REFERENCES sections (id) ON DELETE RESTRICT, 
	FOREIGN KEY(requested_by) REFERENCES profiles (id) ON DELETE RESTRICT, 
	FOREIGN KEY(reviewed_by) REFERENCES profiles (id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX uq_pending_transfer_per_enrollment ON section_transfer_requests (enrollment_id) WHERE status = 'pending';

CREATE TABLE teaching_assignments (
	id UUID NOT NULL, 
	subject_offering_id UUID NOT NULL, 
	faculty_id UUID NOT NULL, 
	assigned_by UUID NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	ended_at TIMESTAMP WITH TIME ZONE, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT ck_teaching_assignment_active_ended_at CHECK (
            (is_active IS TRUE AND ended_at IS NULL)
            OR
            (is_active IS FALSE AND ended_at IS NOT NULL)
            ), 
	FOREIGN KEY(subject_offering_id) REFERENCES subject_offerings (id) ON DELETE RESTRICT, 
	FOREIGN KEY(faculty_id) REFERENCES faculty_profiles (id) ON DELETE RESTRICT, 
	FOREIGN KEY(assigned_by) REFERENCES profiles (id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX uq_active_teaching_assignment_per_offering ON teaching_assignments (subject_offering_id) WHERE is_active IS TRUE;

CREATE TABLE attendance_sessions (
	id UUID NOT NULL, 
	subject_offering_id UUID NOT NULL, 
	faculty_id UUID NOT NULL, 
	session_date TIMESTAMP WITH TIME ZONE NOT NULL, 
	editing_window_closes_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	is_locked BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT ck_attendance_editing_window CHECK (editing_window_closes_at >= session_date), 
	FOREIGN KEY(subject_offering_id) REFERENCES subject_offerings (id) ON DELETE RESTRICT, 
	FOREIGN KEY(faculty_id) REFERENCES faculty_profiles (id) ON DELETE RESTRICT
);

CREATE INDEX ix_attendance_offering_date ON attendance_sessions (subject_offering_id, session_date);

CREATE TABLE registration_submissions (
	id UUID NOT NULL, 
	registration_form_id UUID NOT NULL, 
	student_id UUID NOT NULL, 
	submission_data JSON NOT NULL, 
	reviewed_at TIMESTAMP WITH TIME ZONE, 
	status submission_status NOT NULL, 
	reviewed_by UUID, 
	review_notes TEXT, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_registration_form_student UNIQUE (registration_form_id, student_id), 
	CONSTRAINT ck_registration_review_consistency CHECK (
            (status = 'pending' AND reviewed_by IS NULL AND reviewed_at IS NULL)
            OR
            (status IN ('approved', 'rejected', 'changes_requested')
                AND reviewed_by IS NOT NULL
                AND reviewed_at IS NOT NULL)
            ), 
	FOREIGN KEY(registration_form_id) REFERENCES registration_forms (id) ON DELETE RESTRICT, 
	FOREIGN KEY(student_id) REFERENCES student_profiles (id) ON DELETE RESTRICT, 
	FOREIGN KEY(reviewed_by) REFERENCES profiles (id) ON DELETE RESTRICT
);

CREATE INDEX ix_registration_submission_status ON registration_submissions (status);

CREATE TABLE mentorship_follow_ups (
	id UUID NOT NULL, 
	student_id UUID NOT NULL, 
	mentor_assignment_id UUID NOT NULL, 
	concern_notes TEXT NOT NULL, 
	is_escalated_to_hod BOOLEAN NOT NULL, 
	escalated_at TIMESTAMP WITH TIME ZONE, 
	escalated_to UUID, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(student_id) REFERENCES student_profiles (id) ON DELETE RESTRICT, 
	FOREIGN KEY(mentor_assignment_id) REFERENCES section_mentor_assignments (id) ON DELETE RESTRICT, 
	FOREIGN KEY(escalated_to) REFERENCES profiles (id) ON DELETE RESTRICT
);

CREATE INDEX ix_mentorship_followup_student ON mentorship_follow_ups (student_id);

CREATE TABLE attendance_records (
	id UUID NOT NULL, 
	attendance_session_id UUID NOT NULL, 
	student_id UUID NOT NULL, 
	status attendance_status NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_session_student_attendance UNIQUE (attendance_session_id, student_id), 
	FOREIGN KEY(attendance_session_id) REFERENCES attendance_sessions (id) ON DELETE RESTRICT, 
	FOREIGN KEY(student_id) REFERENCES student_profiles (id) ON DELETE RESTRICT
);

CREATE INDEX ix_attendance_student ON attendance_records (student_id);

CREATE TABLE attendance_correction_requests (
	id UUID NOT NULL, 
	attendance_record_id UUID NOT NULL, 
	requested_by UUID NOT NULL, 
	reason TEXT NOT NULL, 
	requested_status attendance_status NOT NULL, 
	status correction_request_status NOT NULL, 
	reviewed_by UUID, 
	reviewed_at TIMESTAMP WITH TIME ZONE, 
	review_notes TEXT, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT ck_correction_review_consistency CHECK (
            (status = 'pending' AND reviewed_by IS NULL AND reviewed_at IS NULL)
            OR
            (status IN ('approved', 'rejected')
                AND reviewed_by IS NOT NULL
                AND reviewed_at IS NOT NULL)
            ), 
	FOREIGN KEY(attendance_record_id) REFERENCES attendance_records (id) ON DELETE RESTRICT, 
	FOREIGN KEY(requested_by) REFERENCES faculty_profiles (id) ON DELETE RESTRICT, 
	FOREIGN KEY(reviewed_by) REFERENCES profiles (id) ON DELETE RESTRICT
);

-- Supabase Auth foreign key
ALTER TABLE public.profiles
ADD CONSTRAINT fk_profiles_auth_user
FOREIGN KEY (id)
REFERENCES auth.users (id)
ON DELETE RESTRICT;
