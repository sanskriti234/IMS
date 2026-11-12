// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...customOptions } = options;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...customOptions,
    headers: defaultHeaders,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorBody.detail || `API Error: ${response.statusText}`);
  }

  return response.json();
}

// Institutional API wrappers
export const institutionApi = {
  getDepartments: () => apiClient<any[]>('/institution/departments'),
  getPrograms: () => apiClient<any[]>('/institution/programs'),
  getBatches: () => apiClient<any[]>('/institution/batches'),
  getSections: () => apiClient<any[]>('/institution/sections'),
};

// Assignment API wrappers
export const assignmentApi = {
  getTeachingAssignments: () => apiClient<any[]>('/assignments/teaching'),
  getMentorshipAssignments: () => apiClient<any[]>('/assignments/mentorship'),
  getHODAssignments: () => apiClient<any[]>('/assignments/hod'),
};

// Attendance API wrappers
export const attendanceApi = {
  createSession: (data: any, token: string) => apiClient<any>('/attendance/sessions', { method: 'POST', body: JSON.stringify(data), token }),
  getSessionRecords: (sessionId: string) => apiClient<any[]>(`/attendance/sessions/${sessionId}/records`),
  recordAttendance: (data: any, token: string) => apiClient<any>('/attendance/records', { method: 'POST', body: JSON.stringify(data), token }),
  requestCorrection: (data: any, token: string) => apiClient<any>('/attendance/corrections', { method: 'POST', body: JSON.stringify(data), token }),
};

// Registration API wrappers
export const registrationApi = {
  getSubmissions: (formId: string) => apiClient<any[]>(`/registration/submissions/${formId}`),
  reviewSubmission: (submissionId: string, data: any, token: string) => apiClient<any>(`/registration/submissions/${submissionId}/review`, { method: 'PUT', body: JSON.stringify(data), token }),
};