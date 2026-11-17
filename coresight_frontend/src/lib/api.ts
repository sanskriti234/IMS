
import { getSupabaseBrowserClient } from '@/lib/supabase';

// ============================================================
// BASE API CONFIGURATION
// ============================================================

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
).replace(/\/+$/, '');

interface FetchOptions extends RequestInit {
  token?: string;
}

interface ApiErrorResponse {
  detail?: string | Array<{
    msg?: string;
    loc?: (string | number)[];
  }>;
}

// ============================================================
// BASE API CLIENT
// ============================================================

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers, ...customOptions } = options;

  const requestHeaders = new Headers(headers);

  if (
    customOptions.body &&
    !requestHeaders.has('Content-Type')
  ) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  let accessToken = token;

  if (!accessToken && typeof window !== 'undefined') {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error('Unable to retrieve your authentication session.');
    }

    accessToken = data.session?.access_token;
  }

  if (accessToken) {
    requestHeaders.set(
      'Authorization',
      `Bearer ${accessToken}`
    );
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...customOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    const errorBody: ApiErrorResponse = await response
      .json()
      .catch(() => ({}));

    let message = `API Error: ${response.status} ${response.statusText}`;

    if (typeof errorBody.detail === 'string') {
      message = errorBody.detail;
    } else if (Array.isArray(errorBody.detail)) {
      message = errorBody.detail
        .map((item) => {
          const location = item.loc?.join('.');
          return location
            ? `${location}: ${item.msg || 'Validation error'}`
            : item.msg || 'Validation error';
        })
        .join(', ');
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ============================================================
// INSTITUTION TYPES
// ============================================================

export interface Subject {
  id: string;
  department_id: string;
  code: string;
  name: string;
  credits: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubjectCreatePayload {
  department_id: string;
  code: string;
  name: string;
  credits: number;
}

export interface SubjectUpdatePayload {
  code?: string;
  name?: string;
  credits?: number;
}

export const subjectApi = {
  getSubjects: (departmentId?: string) => {
    const query = departmentId
      ? `?department_id=${encodeURIComponent(departmentId)}`
      : '';

    return apiClient<Subject[]>(`/assignments/subjects${query}`, {
      cache: 'no-store',
    });
  },

  createSubject: (payload: SubjectCreatePayload) =>
    apiClient<Subject>('/assignments/subjects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateSubject: (
    subjectId: string,
    payload: SubjectUpdatePayload
  ) =>
    apiClient<Subject>(
      `/assignments/subjects/${encodeURIComponent(subjectId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }
    ),

  deleteSubject: (subjectId: string) =>
    apiClient<{
      success: boolean;
      action: 'deleted' | 'archived';
      message: string;
      subject_id: string;
    }>(`/assignments/subjects/${encodeURIComponent(subjectId)}`, {
      method: 'DELETE',
    }),
};

export interface Department {
  id: string;
  code: string;
  name: string;
  is_active?: boolean;
}

export interface Program {
  id: string;
  department_id: string;
  code: string;
  name: string;
  total_semesters: number;
}

export interface Batch {
  id: string;
  program_id: string;
  name: string;
  start_year: number;
  end_year: number;
}

export interface Section {
  id: string;
  batch_id: string;
  name: string;
  capacity_informational: number;
}

export interface SectionCreatePayload {
  batch_id: string;
  name: string;
  capacity_informational: number;
}

export interface SectionUpdatePayload {
  name?: string;
  capacity_informational?: number;
}

// ============================================================
// ACADEMIC YEAR TYPES
// ============================================================

export type AcademicYearStatus =
  | 'planned'
  | 'active'
  | 'completed';

export interface AcademicYearOption {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: AcademicYearStatus;
  academic_session_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface AcademicYearCreatePayload {
  name: string;
  start_date: string;
  end_date: string;
  status: AcademicYearStatus;
}

// ============================================================
// ACADEMIC SESSION TYPES
// ============================================================

export type AcademicSessionStatus =
  | 'planned'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface AcademicSession {
  id: string;
  academic_year_id: string;
  batch_id: string;
  semester_number: number;
  start_date: string;
  end_date: string;
  status: AcademicSessionStatus;
}

export interface AcademicSessionCreatePayload {
  department_id: string;
  academic_year_id: string;
  semester_number: number;
  start_date: string;
  end_date: string;
  status: AcademicSessionStatus;
}

// ============================================================
// INSTITUTION API
// ============================================================

export const institutionApi = {
  getDepartments: (token?: string) =>
    apiClient<Department[]>('/institution/departments', {
      token,
      cache: 'no-store',
    }),

  getPrograms: (departmentId?: string, token?: string) => {
    const query = departmentId
      ? `?department_id=${encodeURIComponent(departmentId)}`
      : '';

    return apiClient<Program[]>(
      `/institution/programs${query}`,
      {
        token,
        cache: 'no-store',
      }
    );
  },

  getBatches: (token?: string) =>
    apiClient<Batch[]>('/institution/batches', {
      token,
      cache: 'no-store',
    }),

  getSections: (batchId?: string, token?: string) =>
    apiClient<Section[]>(
      batchId
        ? `/institution/sections?batch_id=${encodeURIComponent(batchId)}`
        : '/institution/sections',
      {
        token,
        cache: 'no-store',
      }
    ),

  createSection: (payload: SectionCreatePayload, token?: string) =>
    apiClient<Section>('/institution/sections', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  updateSection: (
    sectionId: string,
    payload: SectionUpdatePayload,
    token?: string
  ) =>
    apiClient<Section>(
      `/institution/sections/${encodeURIComponent(sectionId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
        token,
      }
    ),

  getAcademicYears: (token?: string) =>
    apiClient<AcademicYearOption[]>('/institution/academic-years', {
      token,
      cache: 'no-store',
    }),

  createAcademicYear: (
    payload: AcademicYearCreatePayload,
    token?: string
  ) =>
    apiClient<AcademicYearOption>('/institution/academic-years', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  getAcademicSessions: (token?: string) =>
    apiClient<AcademicSession[]>('/institution/academic-sessions', {
      token,
      cache: 'no-store',
    }),

  createAcademicSession: (
    payload: AcademicSessionCreatePayload,
    token?: string
  ) =>
    apiClient<AcademicSession>('/institution/academic-sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
};

// ============================================================
// ASSIGNMENT TYPES
// ============================================================

export interface TeachingAssignment {
  id: string;
  subject_offering_id: string;
  faculty_id: string;
  assigned_by: string;
  is_active: boolean;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeachingAssignmentCreatePayload {
  subject_offering_id: string;
  faculty_id: string;
}

export interface TeachingAssignmentDetail {
  id: string;
  subject_offering_id: string;
  faculty_id: string;
  assigned_by: string;

  subject_id: string;
  subject_code: string;
  subject_name: string;

  section_id: string;
  section_name: string;

  academic_session_id: string;
  semester_number: number;

  is_active: boolean;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubjectOfferingOption {
  id: string;

  subject_id: string;
  subject_code: string;
  subject_name: string;

  section_id: string;
  section_name: string;

  academic_session_id: string;
  semester_number: number;

  status: 'active' | 'completed' | 'cancelled';
}

export interface MentorshipAssignment {
  id: string;
  section_id: string;
  faculty_id: string;
  academic_session_id: string;
  assigned_by: string;
  is_active: boolean;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MentorshipAssignmentCreatePayload {
  section_id: string;
  faculty_id: string;
  academic_session_id: string;
}

// ============================================================
// ASSIGNMENT API
// ============================================================

export const assignmentApi = {
  getTeachingAssignments: () =>
    apiClient<TeachingAssignmentDetail[]>('/assignments/teaching', {
      cache: 'no-store',
    }),

  createTeachingAssignment: (
    payload: TeachingAssignmentCreatePayload
  ) =>
    apiClient<TeachingAssignment>('/assignments/teaching', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  revokeTeachingAssignment: (assignmentId: string) =>
    apiClient<TeachingAssignment>(
      `/assignments/teaching/${encodeURIComponent(assignmentId)}/revoke`,
      {
        method: 'PATCH',
      }
    ),

  getMentorshipAssignments: () =>
    apiClient<MentorshipAssignment[]>('/assignments/mentorship', {
      cache: 'no-store',
    }),

  createMentorshipAssignment: (
    payload: MentorshipAssignmentCreatePayload
  ) =>
    apiClient<MentorshipAssignment>('/assignments/mentorship', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  revokeMentorshipAssignment: (assignmentId: string) =>
    apiClient<MentorshipAssignment>(
      `/assignments/mentorship/${encodeURIComponent(assignmentId)}/revoke`,
      {
        method: 'PATCH',
      }
    ),

  getAvailableSubjectOfferings: () =>
    apiClient<SubjectOfferingOption[]>(
      '/assignments/subject-offerings/available',
      {
        cache: 'no-store',
      }
    ),
};

// ============================================================
// FACULTY TYPES
// ============================================================

export interface Faculty {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  employee_code: string;
  designation: string;
  department_id: string;
}

export interface FacultyCreatePayload {
  full_name: string;
  email: string;
  employee_code: string;
  designation: string;
  department_id: string;
}

// ============================================================
// FACULTY API
// ============================================================

export const facultyApi = {
  getFaculty: (departmentId?: string) => {
    const query = departmentId
      ? `?department_id=${encodeURIComponent(departmentId)}`
      : '';

    return apiClient<Faculty[]>(`/faculty${query}`, {
      cache: 'no-store',
    });
  },

  createFaculty: (payload: FacultyCreatePayload) =>
    apiClient<Faculty>('/faculty', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// ============================================================
// ATTENDANCE API
// ============================================================

export const attendanceApi = {
  createSession: (data: unknown, token?: string) =>
    apiClient<unknown>('/attendance/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  getSessionRecords: (sessionId: string) =>
    apiClient<unknown[]>(
      `/attendance/sessions/${encodeURIComponent(sessionId)}/records`,
      {
        cache: 'no-store',
      }
    ),

  recordAttendance: (data: unknown, token?: string) =>
    apiClient<unknown>('/attendance/records', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  requestCorrection: (data: unknown, token?: string) =>
    apiClient<unknown>('/attendance/corrections', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
};

// ============================================================
// REGISTRATION API
// ============================================================

export const registrationApi = {
  getSubmissions: (formId: string) =>
    apiClient<unknown[]>(
      `/registration/submissions/${encodeURIComponent(formId)}`,
      {
        cache: 'no-store',
      }
    ),

  reviewSubmission: (
    submissionId: string,
    data: unknown,
    token?: string
  ) =>
    apiClient<unknown>(
      `/registration/submissions/${encodeURIComponent(submissionId)}/review`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }
    ),
};

// ============================================================
// ADMIN DASHBOARD TYPES
// ============================================================

export interface DashboardCounts {
  departments: number;
  students: number;
  faculty: number;
}

export interface AcademicStructureSummary {
  departments: number;
  programs: number;
  batches: number;
  sections: number;
  active_semesters: number[];
}

export interface PendingOperation {
  key: 'registration_submissions' | 'section_transfers';
  title: string;
  count: number;
  unit: string;
  requires_attention: boolean;
}

export interface AdminDashboardResponse {
  academic_years: AcademicYearOption[];
  selected_academic_year: AcademicYearOption | null;
  counts: DashboardCounts;
  academic_structure: AcademicStructureSummary;
  pending_operations: PendingOperation[];
}

// ============================================================
// ADMIN DASHBOARD API
// ============================================================

export const adminDashboardApi = {
  getDashboard: (academicYearId?: string) => {
    const query = academicYearId
      ? `?academic_year_id=${encodeURIComponent(academicYearId)}`
      : '';

    return apiClient<AdminDashboardResponse>(
      `/admin/dashboard${query}`,
      {
        cache: 'no-store',
      }
    );
  },
};
