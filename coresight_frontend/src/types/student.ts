
export type StudentStatus = "active" | "inactive" | "graduated";

export type FaceEnrollmentStatus =
  | "not_enrolled"
  | "pending"
  | "enrolled"
  | "failed"
  | "re_enrollment_required";

export type AttendanceStatus = "present" | "absent";

export type StudentAcademicInfo = {
  department: string;
  departmentCode: string;
  academicSession: string;
  admissionYear: number;
  batch: string;
  semester: number;
  section: string;
  assignedMentor: string;
};

export type StudentProfile = {
  id: string;
  enrollmentNumber: string;
  fullName: string;
  email: string;
  contactNumber: string;
  profilePhoto?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  status: StudentStatus;
  academic: StudentAcademicInfo;
};

export type StudentSubject = {
  id: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  department: string;
  academicSession: string;
  batch: string;
  section: string;
  facultyName: string;
  facultyEmail?: string;
  credits?: number;
};

export type TimetableEntry = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room?: string;
};

export type SubjectAttendance = {
  subjectCode: string;
  subjectName: string;
  classesConducted: number;
  classesAttended: number;
  classesMissed: number;
  percentage: number;
};

export type StudentAttendanceRecord = {
  id: string;
  date: string;
  subjectCode: string;
  subjectName: string;
  sessionTopic?: string;
  startTime?: string;
  status: AttendanceStatus;
};

export type StudentAttendanceSummary = {
  totalClasses: number;
  classesAttended: number;
  classesMissed: number;
  percentage: number;
  subjectAttendance: SubjectAttendance[];
};

export type StudentNotificationCategory =
  | "academic"
  | "attendance"
  | "registration"
  | "department"
  | "timetable";

export type StudentNotification = {
  id: string;
  title: string;
  description: string;
  category: StudentNotificationCategory;
  date: string;
  isRead: boolean;
};

export type StudentPendingAction = {
  id: string;
  title: string;
  description: string;
  href: string;
  priority: "normal" | "important";
};

export type FaceEnrollmentRecord = {
  status: FaceEnrollmentStatus;
  enrolledAt?: string;
  lastUpdated?: string;
  message?: string;
};
