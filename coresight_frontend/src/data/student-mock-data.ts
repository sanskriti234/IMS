
import type {
  FaceEnrollmentRecord,
  StudentAttendanceRecord,
  StudentAttendanceSummary,
  StudentNotification,
  StudentPendingAction,
  StudentProfile,
  StudentSubject,
  TimetableEntry,
} from "@/types/student";

// --------------------------------------------------
// STUDENT PROFILE
// --------------------------------------------------

export const studentProfile: StudentProfile = {
  id: "STU-2023-001",
  enrollmentNumber: "BIET/2023/CSAI/001",
  fullName: "Aarav Verma",
  email: "aarav.verma@student.biet.edu.in",
  contactNumber: "+91 9876543210",
  profilePhoto: "",
  dateOfBirth: "2004-08-15",
  gender: "Male",
  address: "Lucknow, Uttar Pradesh",
  status: "active",

  academic: {
    department: "Computer Science & Engineering (AI & ML)",
    departmentCode: "CSE-AIML",
    academicSession: "2026-27",
    admissionYear: 2023,
    batch: "2023-27",
    semester: 7,
    section: "A",
    assignedMentor: "Dr. Ananya Sharma",
  },
};

// --------------------------------------------------
// SUBJECTS
// --------------------------------------------------

export const studentSubjects: StudentSubject[] = [
  {
    id: "SUB-001",
    subjectCode: "AIML701",
    subjectName: "Machine Learning",
    semester: 7,
    department: "CSE-AIML",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    facultyName: "Dr. Ananya Sharma",
    facultyEmail: "ananya.sharma@biet.edu.in",
    credits: 4,
  },
  {
    id: "SUB-002",
    subjectCode: "AIML702",
    subjectName: "Deep Learning",
    semester: 7,
    department: "CSE-AIML",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    facultyName: "Prof. Rahul Singh",
    facultyEmail: "rahul.singh@biet.edu.in",
    credits: 4,
  },
  {
    id: "SUB-003",
    subjectCode: "CSE703",
    subjectName: "Cloud Computing",
    semester: 7,
    department: "CSE-AIML",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    facultyName: "Prof. Neha Gupta",
    facultyEmail: "neha.gupta@biet.edu.in",
    credits: 3,
  },
  {
    id: "SUB-004",
    subjectCode: "AIML704",
    subjectName: "Natural Language Processing",
    semester: 7,
    department: "CSE-AIML",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    facultyName: "Dr. Vikram Patel",
    facultyEmail: "vikram.patel@biet.edu.in",
    credits: 3,
  },
  {
    id: "SUB-005",
    subjectCode: "CSE705",
    subjectName: "Software Project Management",
    semester: 7,
    department: "CSE-AIML",
    academicSession: "2026-27",
    batch: "2023-27",
    section: "A",
    facultyName: "Prof. Priya Mishra",
    facultyEmail: "priya.mishra@biet.edu.in",
    credits: 3,
  },
];

// --------------------------------------------------
// WEEKLY TIMETABLE
// --------------------------------------------------

export const studentTimetable: TimetableEntry[] = [
  {
    id: "TT-001",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    subjectCode: "AIML701",
    subjectName: "Machine Learning",
    facultyName: "Dr. Ananya Sharma",
    room: "Room 301",
  },
  {
    id: "TT-002",
    day: "Monday",
    startTime: "10:00",
    endTime: "11:00",
    subjectCode: "AIML702",
    subjectName: "Deep Learning",
    facultyName: "Prof. Rahul Singh",
    room: "Lab 204",
  },
  {
    id: "TT-003",
    day: "Monday",
    startTime: "12:00",
    endTime: "13:00",
    subjectCode: "CSE703",
    subjectName: "Cloud Computing",
    facultyName: "Prof. Neha Gupta",
    room: "Room 302",
  },
  {
    id: "TT-004",
    day: "Tuesday",
    startTime: "09:00",
    endTime: "10:00",
    subjectCode: "AIML704",
    subjectName: "Natural Language Processing",
    facultyName: "Dr. Vikram Patel",
    room: "Room 301",
  },
  {
    id: "TT-005",
    day: "Tuesday",
    startTime: "10:00",
    endTime: "11:00",
    subjectCode: "CSE705",
    subjectName: "Software Project Management",
    facultyName: "Prof. Priya Mishra",
    room: "Room 303",
  },
  {
    id: "TT-006",
    day: "Tuesday",
    startTime: "11:00",
    endTime: "12:00",
    subjectCode: "AIML701",
    subjectName: "Machine Learning",
    facultyName: "Dr. Ananya Sharma",
    room: "Room 301",
  },
  {
    id: "TT-007",
    day: "Wednesday",
    startTime: "09:00",
    endTime: "10:00",
    subjectCode: "AIML702",
    subjectName: "Deep Learning",
    facultyName: "Prof. Rahul Singh",
    room: "Lab 204",
  },
  {
    id: "TT-008",
    day: "Wednesday",
    startTime: "10:00",
    endTime: "11:00",
    subjectCode: "CSE703",
    subjectName: "Cloud Computing",
    facultyName: "Prof. Neha Gupta",
    room: "Room 302",
  },
  {
    id: "TT-009",
    day: "Wednesday",
    startTime: "12:00",
    endTime: "13:00",
    subjectCode: "AIML704",
    subjectName: "Natural Language Processing",
    facultyName: "Dr. Vikram Patel",
    room: "Room 301",
  },
  {
    id: "TT-010",
    day: "Thursday",
    startTime: "09:00",
    endTime: "10:00",
    subjectCode: "CSE705",
    subjectName: "Software Project Management",
    facultyName: "Prof. Priya Mishra",
    room: "Room 303",
  },
  {
    id: "TT-011",
    day: "Thursday",
    startTime: "10:00",
    endTime: "11:00",
    subjectCode: "AIML701",
    subjectName: "Machine Learning",
    facultyName: "Dr. Ananya Sharma",
    room: "Room 301",
  },
  {
    id: "TT-012",
    day: "Thursday",
    startTime: "11:00",
    endTime: "12:00",
    subjectCode: "AIML702",
    subjectName: "Deep Learning",
    facultyName: "Prof. Rahul Singh",
    room: "Lab 204",
  },
  {
    id: "TT-013",
    day: "Friday",
    startTime: "09:00",
    endTime: "10:00",
    subjectCode: "CSE703",
    subjectName: "Cloud Computing",
    facultyName: "Prof. Neha Gupta",
    room: "Room 302",
  },
  {
    id: "TT-014",
    day: "Friday",
    startTime: "10:00",
    endTime: "11:00",
    subjectCode: "AIML704",
    subjectName: "Natural Language Processing",
    facultyName: "Dr. Vikram Patel",
    room: "Room 301",
  },
  {
    id: "TT-015",
    day: "Friday",
    startTime: "12:00",
    endTime: "13:00",
    subjectCode: "CSE705",
    subjectName: "Software Project Management",
    facultyName: "Prof. Priya Mishra",
    room: "Room 303",
  },
];

// --------------------------------------------------
// SUBJECT-WISE ATTENDANCE
// --------------------------------------------------

export const studentAttendanceSummary: StudentAttendanceSummary = {
  totalClasses: 100,
  classesAttended: 84,
  classesMissed: 16,
  percentage: 84,

  subjectAttendance: [
    {
      subjectCode: "AIML701",
      subjectName: "Machine Learning",
      classesConducted: 22,
      classesAttended: 20,
      classesMissed: 2,
      percentage: 90.91,
    },
    {
      subjectCode: "AIML702",
      subjectName: "Deep Learning",
      classesConducted: 20,
      classesAttended: 17,
      classesMissed: 3,
      percentage: 85,
    },
    {
      subjectCode: "CSE703",
      subjectName: "Cloud Computing",
      classesConducted: 20,
      classesAttended: 16,
      classesMissed: 4,
      percentage: 80,
    },
    {
      subjectCode: "AIML704",
      subjectName: "Natural Language Processing",
      classesConducted: 18,
      classesAttended: 15,
      classesMissed: 3,
      percentage: 83.33,
    },
    {
      subjectCode: "CSE705",
      subjectName: "Software Project Management",
      classesConducted: 20,
      classesAttended: 16,
      classesMissed: 4,
      percentage: 80,
    },
  ],
};

// --------------------------------------------------
// ATTENDANCE HISTORY
// --------------------------------------------------

export const studentAttendanceRecords: StudentAttendanceRecord[] = [
  {
    id: "ATT-001",
    date: "2026-11-10",
    subjectCode: "AIML701",
    subjectName: "Machine Learning",
    sessionTopic: "Decision Trees",
    startTime: "09:00",
    status: "present",
  },
  {
    id: "ATT-002",
    date: "2026-11-10",
    subjectCode: "AIML702",
    subjectName: "Deep Learning",
    sessionTopic: "Convolutional Neural Networks",
    startTime: "10:00",
    status: "present",
  },
  {
    id: "ATT-003",
    date: "2026-11-09",
    subjectCode: "CSE703",
    subjectName: "Cloud Computing",
    sessionTopic: "Cloud Service Models",
    startTime: "09:00",
    status: "absent",
  },
  {
    id: "ATT-004",
    date: "2026-11-09",
    subjectCode: "AIML704",
    subjectName: "Natural Language Processing",
    sessionTopic: "Text Preprocessing",
    startTime: "10:00",
    status: "present",
  },
  {
    id: "ATT-005",
    date: "2026-11-06",
    subjectCode: "CSE705",
    subjectName: "Software Project Management",
    sessionTopic: "Project Scheduling",
    startTime: "12:00",
    status: "present",
  },
  {
    id: "ATT-006",
    date: "2026-11-06",
    subjectCode: "AIML701",
    subjectName: "Machine Learning",
    sessionTopic: "Random Forest",
    startTime: "09:00",
    status: "present",
  },
  {
    id: "ATT-007",
    date: "2026-11-05",
    subjectCode: "AIML702",
    subjectName: "Deep Learning",
    sessionTopic: "Backpropagation",
    startTime: "11:00",
    status: "absent",
  },
  {
    id: "ATT-008",
    date: "2026-11-05",
    subjectCode: "CSE703",
    subjectName: "Cloud Computing",
    sessionTopic: "Virtualization",
    startTime: "10:00",
    status: "present",
  },
  {
    id: "ATT-009",
    date: "2026-11-04",
    subjectCode: "AIML704",
    subjectName: "Natural Language Processing",
    sessionTopic: "Tokenization",
    startTime: "09:00",
    status: "present",
  },
  {
    id: "ATT-010",
    date: "2026-11-04",
    subjectCode: "CSE705",
    subjectName: "Software Project Management",
    sessionTopic: "Risk Management",
    startTime: "10:00",
    status: "absent",
  },
];

// --------------------------------------------------
// FACE ENROLLMENT
// --------------------------------------------------

export const studentFaceEnrollment: FaceEnrollmentRecord = {
  status: "not_enrolled",
  message: "Complete face enrollment to enable face-based attendance verification.",
};

// --------------------------------------------------
// PENDING STUDENT ACTIONS
// --------------------------------------------------

export const studentPendingActions: StudentPendingAction[] = [
  {
    id: "ACT-001",
    title: "Complete face enrollment",
    description:
      "Enroll your face to prepare your account for face-based attendance verification.",
    href: "/student/face-enrollment",
    priority: "important",
  },
];

// --------------------------------------------------
// NOTIFICATIONS
// --------------------------------------------------

export const studentNotifications: StudentNotification[] = [
  {
    id: "NOT-001",
    title: "Face enrollment pending",
    description:
      "Complete your face enrollment for the upcoming face-based attendance process.",
    category: "attendance",
    date: "2026-11-11",
    isRead: false,
  },
  {
    id: "NOT-002",
    title: "Machine Learning class update",
    description:
      "The Machine Learning class will take place in Room 301.",
    category: "timetable",
    date: "2026-11-10",
    isRead: false,
  },
  {
    id: "NOT-003",
    title: "Semester 7 academic notice",
    description:
      "Check the department notice board for the latest semester-related information.",
    category: "academic",
    date: "2026-11-08",
    isRead: true,
  },
  {
    id: "NOT-004",
    title: "Registration completed",
    description:
      "Your student registration is marked as completed in this demo account.",
    category: "registration",
    date: "2026-11-05",
    isRead: true,
  },
  {
    id: "NOT-005",
    title: "Department announcement",
    description:
      "Students are advised to follow their assigned academic timetable.",
    category: "department",
    date: "2026-11-03",
    isRead: true,
  },
];
