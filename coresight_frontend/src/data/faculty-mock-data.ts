
import type {
  FacultyAssignment,
  TeachingOffering,
  FacultyStudent,
  AttendanceSession,
  RegistrationSubmission,
  Mentee,
  MentorshipRecord,
  MentorshipFollowUp,
} from "../types/faculty";

// --------------------------------------------------
// FACULTY PROFILE
// --------------------------------------------------

export const facultyProfile = {
  id: "FAC-001",
  name: "Dr. Ananya Sharma",
  employeeId: "EMP-2021-042",
  email: "ananya.sharma@coresight.edu",
  designation: "Assistant Professor",
  department: "Computer Science & Engineering (AIML)",
  avatar: "",
};

// --------------------------------------------------
// ASSIGNMENT CONFIGURATION
// Change these values to test workspace visibility.
// --------------------------------------------------

export const facultyAssignment: FacultyAssignment = {
  teachingActive: true,
  mentorshipActive: true,
  registrationPermission: true,
};

// --------------------------------------------------
// TEACHING ASSIGNMENTS
// --------------------------------------------------

export const teachingOfferings: TeachingOffering[] = [
  {
    id: "OFF-001",
    subjectCode: "CS401",
    subjectName: "Machine Learning",
    department: "Computer Science & Engineering (AIML)",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    semester: 7,
    studentCount: 32,
  },
  {
    id: "OFF-002",
    subjectCode: "CS403",
    subjectName: "Deep Learning",
    department: "Computer Science & Engineering (AIML)",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    semester: 7,
    studentCount: 32,
  },
  {
    id: "OFF-003",
    subjectCode: "CS405",
    subjectName: "Artificial Intelligence",
    department: "Computer Science & Engineering (AIML)",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "B",
    semester: 7,
    studentCount: 28,
  },
];

// --------------------------------------------------
// STUDENTS
// --------------------------------------------------

export const facultyStudents: FacultyStudent[] = [
  {
    id: "STU-001",
    enrollmentNumber: "23010101001",
    name: "Aarav Verma",
    email: "aarav@example.edu",
    department: "Computer Science & Engineering (AIML)",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    semester: 7,
    status: "active",
  },
  {
    id: "STU-002",
    enrollmentNumber: "23010101002",
    name: "Aditi Singh",
    email: "aditi@example.edu",
    department: "Computer Science & Engineering (AIML)",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    semester: 7,
    status: "active",
  },
  {
    id: "STU-003",
    enrollmentNumber: "23010101003",
    name: "Rohan Mishra",
    email: "rohan@example.edu",
    department: "Computer Science & Engineering (AIML)",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    semester: 7,
    status: "active",
  },
  {
    id: "STU-004",
    enrollmentNumber: "23010101004",
    name: "Priya Gupta",
    email: "priya@example.edu",
    department: "Computer Science & Engineering (AIML)",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "B",
    semester: 7,
    status: "active",
  },
  {
    id: "STU-005",
    enrollmentNumber: "23010101005",
    name: "Karan Yadav",
    email: "karan@example.edu",
    department: "Computer Science & Engineering (AIML)",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "B",
    semester: 7,
    status: "active",
  },
];

// --------------------------------------------------
// ATTENDANCE SESSIONS
// --------------------------------------------------

export const attendanceSessions: AttendanceSession[] = [
  {
    id: "ATT-001",
    offeringId: "OFF-001",
    date: "2026-11-10",
    topic: "Supervised Learning",
    status: "submitted",
    records: [
      { studentId: "STU-001", status: "present" },
      { studentId: "STU-002", status: "present" },
      { studentId: "STU-003", status: "absent" },
    ],
  },
  {
    id: "ATT-002",
    offeringId: "OFF-002",
    date: "2026-11-11",
    topic: "Neural Networks",
    status: "draft",
    records: [
      { studentId: "STU-001", status: "present" },
      { studentId: "STU-002", status: "absent" },
      { studentId: "STU-003", status: "present" },
    ],
  },
];

// --------------------------------------------------
// REGISTRATION SUBMISSIONS
// --------------------------------------------------

export const registrationSubmissions: RegistrationSubmission[] = [
  {
    id: "REG-001",
    studentName: "Aarav Verma",
    enrollmentNumber: "23010101001",
    batch: "2023-27",
    section: "A",
    submittedAt: "2026-11-09",
    status: "registered",
  },
  {
    id: "REG-002",
    studentName: "Aditi Singh",
    batch: "2023-27",
    section: "A",
    submittedAt: "2026-11-10",
    status: "pending",
  },
  {
    id: "REG-003",
    studentName: "Rohan Mishra",
    batch: "2023-27",
    section: "A",
    submittedAt: "2026-11-10",
    status: "requires_correction",
  },
];

// --------------------------------------------------
// MENTEES
// --------------------------------------------------

export const assignedMentees: Mentee[] = [
  {
    id: "MEN-001",
    enrollmentNumber: "23010101001",
    name: "Aarav Verma",
    email: "aarav@example.edu",
    department: "Computer Science & Engineering (AIML)",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    semester: 7,
    academicStatus: "good",
    attendancePercentage: 86,
    attentionLevel: "normal",
    subjectAttendance: [
      {
        subjectCode: "CS401",
        subjectName: "Machine Learning",
        conducted: 30,
        attended: 27,
        percentage: 90,
      },
      {
        subjectCode: "CS403",
        subjectName: "Deep Learning",
        conducted: 28,
        attended: 23,
        percentage: 82,
      },
    ],
    concerns: [],
  },
  {
    id: "MEN-002",
    enrollmentNumber: "23010101002",
    name: "Aditi Singh",
    email: "aditi@example.edu",
    department: "Computer Science & Engineering (AIML)",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    semester: 7,
    academicStatus: "needs_attention",
    attendancePercentage: 63,
    attentionLevel: "high",
    subjectAttendance: [
      {
        subjectCode: "CS401",
        subjectName: "Machine Learning",
        conducted: 30,
        attended: 18,
        percentage: 60,
      },
      {
        subjectCode: "CS403",
        subjectName: "Deep Learning",
        conducted: 28,
        attended: 19,
        percentage: 68,
      },
    ],
    concerns: ["Low attendance", "Academic follow-up required"],
  },
  {
    id: "MEN-003",
    enrollmentNumber: "23010101003",
    name: "Rohan Mishra",
    email: "rohan@example.edu",
    department: "Computer Science & Engineering (AIML)",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    semester: 7,
    academicStatus: "needs_attention",
    attendancePercentage: 72,
    attentionLevel: "medium",
    subjectAttendance: [
      {
        subjectCode: "CS401",
        subjectName: "Machine Learning",
        conducted: 30,
        attended: 22,
        percentage: 73,
      },
      {
        subjectCode: "CS403",
        subjectName: "Deep Learning",
        conducted: 28,
        attended: 20,
        percentage: 71,
      },
    ],
    concerns: ["Academic progress needs review"],
  },
];

// --------------------------------------------------
// MENTORSHIP RECORDS
// --------------------------------------------------

export const mentorshipRecords: MentorshipRecord[] = [
  {
    id: "MR-001",
    menteeId: "MEN-002",
    date: "2026-11-08",
    discussionSummary: "Discussed attendance and academic participation.",
    concern: "Low attendance in core subjects.",
    recommendation: "Attend scheduled classes regularly.",
    followUpDate: "2026-11-15",
  },
  {
    id: "MR-002",
    menteeId: "MEN-003",
    date: "2026-11-09",
    discussionSummary: "Reviewed current semester academic progress.",
    concern: "Difficulty maintaining academic consistency.",
    recommendation: "Review subject progress and pending coursework.",
    followUpDate: "2026-11-16",
  },
];

// --------------------------------------------------
// MENTOR FOLLOW-UPS
// --------------------------------------------------

export const mentorshipFollowUps: MentorshipFollowUp[] = [
  {
    id: "FU-001",
    menteeId: "MEN-002",
    title: "Review attendance improvement",
    dueDate: "2026-11-15",
    status: "pending",
  },
  {
    id: "FU-002",
    menteeId: "MEN-003",
    title: "Review academic progress",
    dueDate: "2026-11-16",
    status: "pending",
  },
];
