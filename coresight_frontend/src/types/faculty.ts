
export type FacultyWorkspace = "teaching" | "mentor";

export type FacultyAssignment = {
  teachingActive: boolean;
  mentorshipActive: boolean;
  registrationPermission: boolean;
};

export type AcademicContext = {
  department: string;
  academicSession: string;
  batch: string;
  section: string;
  semester: number;
};

export type TeachingOffering = AcademicContext & {
  id: string;
  subjectCode: string;
  subjectName: string;
  studentCount: number;
};

export type StudentStatus = "active" | "inactive" | "graduated";

export type FacultyStudent = AcademicContext & {
  id: string;
  enrollmentNumber: string;
  name: string;
  email: string;
  status: StudentStatus;
};

export type AttendanceStatus = "present" | "absent";

export type AttendanceRecord = {
  studentId: string;
  status: AttendanceStatus;
};

export type AttendanceSessionStatus =
  | "draft"
  | "submitted"
  | "locked";

export type AttendanceSession = {
  id: string;
  offeringId: string;
  date: string;
  topic: string;
  status: AttendanceSessionStatus;
  records: AttendanceRecord[];
};

export type RegistrationStatus =
  | "pending"
  | "registered"
  | "failed"
  | "requires_correction";

export type RegistrationSubmission = {
  id: string;
  studentName: string;
  enrollmentNumber?: string;
  batch: string;
  section: string;
  submittedAt: string;
  status: RegistrationStatus;
};

export type AttentionLevel = "normal" | "medium" | "high";

export type SubjectAttendance = {
  subjectCode: string;
  subjectName: string;
  conducted: number;
  attended: number;
  percentage: number;
};

export type Mentee = AcademicContext & {
  id: string;
  enrollmentNumber: string;
  name: string;
  email: string;
  academicStatus: "good" | "needs_attention";
  attendancePercentage: number;
  attentionLevel: AttentionLevel;
  subjectAttendance: SubjectAttendance[];
  concerns: string[];
};

export type MentorshipRecord = {
  id: string;
  menteeId: string;
  date: string;
  discussionSummary: string;
  concern: string;
  recommendation: string;
  followUpDate?: string;
};

export type FollowUpStatus = "pending" | "completed" | "overdue";

export type MentorshipFollowUp = {
  id: string;
  menteeId: string;
  title: string;
  dueDate: string;
  status: FollowUpStatus;
};
