
'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Mail,
  RefreshCw,
  UserCheck,
  AlertCircle,
} from 'lucide-react';

import {
  facultyApi,
  institutionApi,
  assignmentApi,
  type Faculty,
  type TeachingAssignmentDetail,
  type MentorshipAssignment,
  type Section,
  type AcademicSession,
  type Department,
} from '@/lib/api';

function FacultyDetailsContent() {
  const params = useParams<{ facultyId: string }>();
  const router = useRouter();

  const facultyId = params.facultyId;

  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);

  const [teachingAssignments, setTeachingAssignments] = useState<
    TeachingAssignmentDetail[]
  >([]);

  const [mentorshipAssignments, setMentorshipAssignments] = useState<
    MentorshipAssignment[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        facultyData,
        departmentData,
        sectionData,
        sessionData,
        teachingData,
        mentorshipData,
      ] = await Promise.all([
        facultyApi.getFaculty(),
        institutionApi.getDepartments(),
        institutionApi.getSections(),
        institutionApi.getAcademicSessions(),
        assignmentApi.getTeachingAssignments(),
        assignmentApi.getMentorshipAssignments(),
      ]);

      const selectedFaculty = facultyData.find(
        (member) => member.id === facultyId
      );

      if (!selectedFaculty) {
        setFaculty(null);
        setError('Faculty member not found.');
        return;
      }

      setFaculty(selectedFaculty);
      setDepartments(departmentData);
      setSections(sectionData);
      setSessions(sessionData);

      setTeachingAssignments(teachingData);
      setMentorshipAssignments(mentorshipData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load faculty details.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facultyId) {
      void loadData();
    }
    // loadData is intentionally invoked when the route ID changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facultyId]);

  const departmentName =
    departments.find((department) => department.id === faculty?.department_id)
      ?.name ?? 'Not available';

  const facultyTeachingAssignments = useMemo(
    () =>
      teachingAssignments.filter(
        (assignment) => assignment.faculty_id === facultyId
      ),
    [teachingAssignments, facultyId]
  );

  const facultyMentorshipAssignments = useMemo(
    () =>
      mentorshipAssignments.filter(
        (assignment) => assignment.faculty_id === facultyId
      ),
    [mentorshipAssignments, facultyId]
  );

  const getSectionName = (sectionId: string) =>
    sections.find((section) => section.id === sectionId)?.name ??
    'Unknown section';

  const getSessionName = (sessionId: string) => {
    const session = sessions.find((item) => item.id === sessionId);

    return session
      ? `Semester ${session.semester_number}`
      : 'Unknown session';
  };

  const cardClass =
    'rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5';

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center gap-3 text-sm text-slate-500">
        <RefreshCw className="h-5 w-5 animate-spin" />
        Loading faculty details...
      </div>
    );
  }

  if (error || !faculty) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/faculty"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#176B52]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Faculty Directory
        </Link>

        <div className="flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error || 'Faculty member not found.'}
        </div>

        <button
          type="button"
          onClick={() => void loadData()}
          className="rounded-xl bg-[#176B52] px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* BACK AND REFRESH */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/faculty"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#176B52] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Faculty Directory
        </Link>

        <button
          type="button"
          onClick={() => void loadData()}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] px-4 py-2 text-sm font-semibold"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* FACULTY PROFILE */}

      <div className={cardClass}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#176B52]/10 text-[#176B52]">
            <GraduationCap className="h-9 w-9" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">
              {faculty.full_name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {faculty.designation || 'Faculty Member'}
            </p>

            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
              <span>{faculty.employee_code}</span>
              <span>{departmentName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Teaching Assignments
            </p>
            <BookOpen className="h-5 w-5 text-[#176B52]" />
          </div>

          <p className="mt-3 text-3xl font-bold">
            {facultyTeachingAssignments.length}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {facultyTeachingAssignments.filter((item) => item.is_active).length}{' '}
            active
          </p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Mentorship Assignments
            </p>
            <UserCheck className="h-5 w-5 text-[#176B52]" />
          </div>

          <p className="mt-3 text-3xl font-bold">
            {facultyMentorshipAssignments.length}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {facultyMentorshipAssignments.filter((item) => item.is_active).length}{' '}
            active
          </p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Department</p>
            <GraduationCap className="h-5 w-5 text-[#176B52]" />
          </div>

          <p className="mt-3 text-lg font-bold">
            {departmentName}
          </p>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}

      <div className={cardClass}>
        <h2 className="mb-5 text-lg font-bold">
          Faculty Information
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500">Full Name</p>
            <p className="mt-1 font-medium">{faculty.full_name}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Employee Code</p>
            <p className="mt-1 font-medium">
              {faculty.employee_code || 'Not available'}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Email Address</p>
            <p className="mt-1 flex items-center gap-2 font-medium">
              <Mail className="h-4 w-4 text-slate-400" />
              {faculty.email}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Designation</p>
            <p className="mt-1 font-medium">
              {faculty.designation || 'Not available'}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Department</p>
            <p className="mt-1 font-medium">{departmentName}</p>
          </div>
        </div>
      </div>

      {/* TEACHING RESPONSIBILITIES */}

      <div className={cardClass}>
        <div className="mb-4">
          <h2 className="text-lg font-bold">
            Teaching Responsibilities
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Subjects and sections assigned to this faculty member.
          </p>
        </div>

        {facultyTeachingAssignments.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No teaching assignments found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-xs text-slate-500">
                  <th className="px-3 py-3">Subject</th>
                  <th className="px-3 py-3">Section</th>
                  <th className="px-3 py-3">Semester</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Assigned On</th>
                </tr>
              </thead>

              <tbody>
                {facultyTeachingAssignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="border-b border-[var(--border-color)] last:border-0"
                  >
                    <td className="px-3 py-4">
                      <p className="font-medium">
                        {assignment.subject_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {assignment.subject_code}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      {assignment.section_name}
                    </td>

                    <td className="px-3 py-4">
                      Semester {assignment.semester_number}
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          assignment.is_active
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {assignment.is_active ? 'Active' : 'Revoked'}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-xs text-slate-500">
                      {new Date(
                        assignment.created_at
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MENTORSHIP RESPONSIBILITIES */}

      <div className={cardClass}>
        <div className="mb-4">
          <h2 className="text-lg font-bold">
            Mentorship Responsibilities
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Sections for which this faculty member is responsible as mentor.
          </p>
        </div>

        {facultyMentorshipAssignments.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No mentorship assignments found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-xs text-slate-500">
                  <th className="px-3 py-3">Section</th>
                  <th className="px-3 py-3">Academic Session</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Assigned On</th>
                </tr>
              </thead>

              <tbody>
                {facultyMentorshipAssignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="border-b border-[var(--border-color)] last:border-0"
                  >
                    <td className="px-3 py-4 font-medium">
                      {getSectionName(assignment.section_id)}
                    </td>

                    <td className="px-3 py-4">
                      {getSessionName(assignment.academic_session_id)}
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          assignment.is_active
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {assignment.is_active ? 'Active' : 'Revoked'}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-xs text-slate-500">
                      {new Date(
                        assignment.created_at
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/faculty')}
          className="rounded-xl border border-[var(--border-color)] px-5 py-2.5 text-sm font-semibold"
        >
          Back to Faculty Directory
        </button>
      </div>
    </section>
  );
}

export default function FacultyDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[300px] items-center justify-center gap-3 text-sm text-slate-500">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading faculty profile...
        </div>
      }
    >
      <FacultyDetailsContent />
    </Suspense>
  );
}
