
'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  RefreshCw,
  UserCheck,
  XCircle,
} from 'lucide-react';

import {
  assignmentApi,
  facultyApi,
  institutionApi,
  type TeachingAssignmentDetail,
  type MentorshipAssignment,
  type Faculty,
  type Section,
  type AcademicSession,
  type SubjectOfferingOption,
} from '@/lib/api';

type AssignmentTab = 'teaching' | 'mentorship';

export function FacultyAssignments() {
  const [activeTab, setActiveTab] = useState<AssignmentTab>('teaching');

  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);

  const [teachingAssignments, setTeachingAssignments] = useState<
    TeachingAssignmentDetail[]
  >([]);

  const [mentorshipAssignments, setMentorshipAssignments] = useState<
    MentorshipAssignment[]
  >([]);
  const [availableOfferings, setAvailableOfferings] = useState<
    SubjectOfferingOption[]
    >([]);
  const [offeringId, setOfferingId] = useState('');
  const [teachingFacultyId, setTeachingFacultyId] = useState('');

  const [mentorshipFacultyId, setMentorshipFacultyId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sessionId, setSessionId] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [revokingId, setRevokingId] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ------------------------------------------------------------
  // LOAD DATA
  // ------------------------------------------------------------

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [
        facultyData,
        sectionData,
        sessionData,
        teachingData,
        mentorshipData,
        offeringData,
      ] = await Promise.all([
        facultyApi.getFaculty(),
        institutionApi.getSections(),
        institutionApi.getAcademicSessions(),
        assignmentApi.getTeachingAssignments(),
        assignmentApi.getMentorshipAssignments(),
        assignmentApi.getAvailableSubjectOfferings(),
      ]);

      setFaculty(facultyData);
      setSections(sectionData);
      setSessions(sessionData);
      setTeachingAssignments(teachingData);
      setMentorshipAssignments(mentorshipData);
      setAvailableOfferings(offeringData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load assignment information.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // ------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------

  const facultyName = (id: string) =>
    faculty.find((item) => item.id === id)?.full_name ?? 'Unknown faculty';

  const sectionName = (id: string) =>
    sections.find((item) => item.id === id)?.name ?? 'Unknown section';

  const sessionName = (id: string) => {
    const session = sessions.find((item) => item.id === id);

    return session
      ? `Semester ${session.semester_number} · ${session.status}`
      : 'Unknown session';
  };

  const activeTeaching = useMemo(
    () => teachingAssignments.filter((item) => item.is_active),
    [teachingAssignments]
  );

  const activeMentorship = useMemo(
    () => mentorshipAssignments.filter((item) => item.is_active),
    [mentorshipAssignments]
  );

  const inputClass =
    'w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-[#176B52]';

  const cardClass =
    'rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5';

  const renderStatus = (active: boolean) => (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      {active ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      {active ? 'Active' : 'Revoked'}
    </span>
  );

  // ------------------------------------------------------------
  // CREATE TEACHING ASSIGNMENT
  // ------------------------------------------------------------

  const handleTeachingAssignment = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!offeringId.trim() || !teachingFacultyId) {
      setError('Select a faculty member and enter a subject offering ID.');
      return;
    }

    try {
      setSubmitting(true);

      await assignmentApi.createTeachingAssignment({
        subject_offering_id: offeringId.trim(),
        faculty_id: teachingFacultyId,
      });

      // Fetch enriched records containing subject and section names.
      const updatedTeachingAssignments =
        await assignmentApi.getTeachingAssignments();

      setTeachingAssignments(updatedTeachingAssignments);

      setOfferingId('');
      setTeachingFacultyId('');

      setSuccess('Teaching assignment created successfully.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create teaching assignment.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------------------------------------
  // CREATE MENTORSHIP ASSIGNMENT
  // ------------------------------------------------------------

  const handleMentorshipAssignment = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!mentorshipFacultyId || !sectionId || !sessionId) {
      setError('Select faculty, section and academic session.');
      return;
    }

    try {
      setSubmitting(true);

      const created = await assignmentApi.createMentorshipAssignment({
        faculty_id: mentorshipFacultyId,
        section_id: sectionId,
        academic_session_id: sessionId,
      });

      setMentorshipAssignments((previous) => [created, ...previous]);

      setMentorshipFacultyId('');
      setSectionId('');
      setSessionId('');

      setSuccess('Mentorship assignment created successfully.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create mentorship assignment.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------------------------------------
  // REVOKE ASSIGNMENT
  // ------------------------------------------------------------

  const handleRevoke = async (type: AssignmentTab, id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to revoke this assignment? The assignment history will be preserved.'
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');
    setRevokingId(id);

    try {
      if (type === 'teaching') {
        await assignmentApi.revokeTeachingAssignment(id);

        // Preserve the enriched subject and section information.
        setTeachingAssignments((previous) =>
          previous.map((item) =>
            item.id === id
              ? {
                  ...item,
                  is_active: false,
                  ended_at: new Date().toISOString(),
                }
              : item
          )
        );
      } else {
        const updated = await assignmentApi.revokeMentorshipAssignment(id);

        setMentorshipAssignments((previous) =>
          previous.map((item) => (item.id === id ? updated : item))
        );
      }

      setSuccess('Assignment revoked. Its history has been retained.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to revoke assignment.'
      );
    } finally {
      setRevokingId('');
    }
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <section className="space-y-6">
      {/* SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Faculty</p>
            <GraduationCap className="h-5 w-5 text-[#176B52]" />
          </div>

          <p className="mt-3 text-3xl font-bold">{faculty.length}</p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Active Teaching</p>
            <BookOpen className="h-5 w-5 text-[#176B52]" />
          </div>

          <p className="mt-3 text-3xl font-bold">
            {activeTeaching.length}
          </p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Active Mentorship</p>
            <UserCheck className="h-5 w-5 text-[#176B52]" />
          </div>

          <p className="mt-3 text-3xl font-bold">
            {activeMentorship.length}
          </p>
        </div>
      </div>

      {/* NOTIFICATIONS */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {success}
        </div>
      )}

      {/* TABS AND REFRESH */}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)]">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('teaching');
              setError('');
              setSuccess('');
            }}
            className={`border-b-2 px-1 pb-3 text-sm font-semibold ${
              activeTab === 'teaching'
                ? 'border-[#176B52] text-[#176B52]'
                : 'border-transparent text-slate-500'
            }`}
          >
            Teaching Assignments
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('mentorship');
              setError('');
              setSuccess('');
            }}
            className={`border-b-2 px-1 pb-3 text-sm font-semibold ${
              activeTab === 'mentorship'
                ? 'border-[#176B52] text-[#176B52]'
                : 'border-transparent text-slate-500'
            }`}
          >
            Mentorship Assignments
          </button>
        </div>

        <button
          type="button"
          onClick={() => void loadData()}
          disabled={loading}
          className="mb-2 inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] px-3 py-2 text-xs font-semibold disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">
          Loading assignment data...
        </div>
      ) : (
        <>
          {/* ================================================== */}
          {/* TEACHING ASSIGNMENTS */}
          {/* ================================================== */}

          {activeTab === 'teaching' && (
            <>
              <form
                onSubmit={handleTeachingAssignment}
                className={`${cardClass} space-y-5`}
              >
                <div>
                  <h3 className="text-lg font-bold">
                    Assign Faculty to Subject Offering
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Assign a faculty member to an existing active subject
                    offering.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Faculty *
                    </label>

                    <select
                      required
                      value={teachingFacultyId}
                      onChange={(event) =>
                        setTeachingFacultyId(event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select faculty</option>

                      {faculty.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.full_name} · {member.employee_code}
                        </option>
                      ))}
                    </select>
                  </div>

             <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Subject Offering *
                    </label>

                    <select
                      required
                      value={offeringId}
                      onChange={(event) => setOfferingId(event.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select subject offering</option>

                      {availableOfferings.map((offering) => (
                        <option key={offering.id} value={offering.id}>
                          {offering.subject_code} — {offering.subject_name}
                          {' | Section '}
                          {offering.section_name}
                          {' | Semester '}
                          {offering.semester_number}
                        </option>
                      ))}
                    </select>

                    {availableOfferings.length === 0 && (
                      <p className="text-xs text-amber-600">
                        No active subject offerings are currently available.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || faculty.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B52] px-5 py-3 text-sm font-semibold text-white hover:bg-[#125440] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}
                  Create Teaching Assignment
                </button>
              </form>

              {/* TEACHING RECORDS */}

              <div className={cardClass}>
                <div className="mb-4">
                  <h3 className="font-bold">
                    Teaching Assignment Records
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Faculty teaching responsibilities by subject, section and
                    semester.
                  </p>
                </div>

                {teachingAssignments.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No teaching assignments found.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-[var(--border-color)] text-xs text-slate-500">
                          <th className="px-3 py-3">Faculty</th>
                          <th className="px-3 py-3">Subject</th>
                          <th className="px-3 py-3">Section</th>
                          <th className="px-3 py-3">Semester</th>
                          <th className="px-3 py-3">Status</th>
                          <th className="px-3 py-3">Assigned On</th>
                          <th className="px-3 py-3">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {teachingAssignments.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-[var(--border-color)] last:border-0"
                          >
                            <td className="px-3 py-4 font-medium">
                              {facultyName(item.faculty_id)}
                            </td>

                            <td className="px-3 py-4">
                              <div className="font-medium">
                                {item.subject_name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {item.subject_code}
                              </div>
                            </td>

                            <td className="px-3 py-4">
                              {item.section_name}
                            </td>

                            <td className="px-3 py-4">
                              Semester {item.semester_number}
                            </td>

                            <td className="px-3 py-4">
                              {renderStatus(item.is_active)}
                            </td>

                            <td className="px-3 py-4 text-xs text-slate-500">
                              {new Date(item.created_at).toLocaleDateString()}
                            </td>

                            <td className="px-3 py-4">
                              {item.is_active && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void handleRevoke('teaching', item.id)
                                  }
                                  disabled={revokingId === item.id}
                                  className="text-xs font-semibold text-rose-600 hover:underline disabled:opacity-50"
                                >
                                  {revokingId === item.id
                                    ? 'Revoking...'
                                    : 'Revoke'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================================================== */}
          {/* MENTORSHIP ASSIGNMENTS */}
          {/* ================================================== */}

          {activeTab === 'mentorship' && (
            <>
              <form
                onSubmit={handleMentorshipAssignment}
                className={`${cardClass} space-y-5`}
              >
                <div>
                  <h3 className="text-lg font-bold">
                    Assign Section Mentor
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Assign one faculty member as the mentor for a section
                    during an academic session.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Faculty *
                    </label>

                    <select
                      required
                      value={mentorshipFacultyId}
                      onChange={(event) =>
                        setMentorshipFacultyId(event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select faculty</option>

                      {faculty.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.full_name} · {member.employee_code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Section *
                    </label>

                    <select
                      required
                      value={sectionId}
                      onChange={(event) => setSectionId(event.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select section</option>

                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">
                      Academic Session *
                    </label>

                    <select
                      required
                      value={sessionId}
                      onChange={(event) => setSessionId(event.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select academic session</option>

                      {sessions
                        .filter(
                          (session) =>
                            session.status === 'planned' ||
                            session.status === 'active'
                        )
                        .map((session) => (
                          <option key={session.id} value={session.id}>
                            Semester {session.semester_number} ·{' '}
                            {session.status}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    faculty.length === 0 ||
                    sections.length === 0 ||
                    sessions.length === 0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B52] px-5 py-3 text-sm font-semibold text-white hover:bg-[#125440] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}
                  Create Mentorship Assignment
                </button>
              </form>

              {/* MENTORSHIP RECORDS */}

              <div className={cardClass}>
                <h3 className="mb-4 font-bold">
                  Mentorship Assignment Records
                </h3>

                {mentorshipAssignments.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No mentorship assignments found.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-[var(--border-color)] text-xs text-slate-500">
                          <th className="px-3 py-3">Faculty</th>
                          <th className="px-3 py-3">Section</th>
                          <th className="px-3 py-3">Academic Session</th>
                          <th className="px-3 py-3">Status</th>
                          <th className="px-3 py-3">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {mentorshipAssignments.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-[var(--border-color)] last:border-0"
                          >
                            <td className="px-3 py-4 font-medium">
                              {facultyName(item.faculty_id)}
                            </td>

                            <td className="px-3 py-4">
                              {sectionName(item.section_id)}
                            </td>

                            <td className="px-3 py-4 text-xs">
                              {sessionName(item.academic_session_id)}
                            </td>

                            <td className="px-3 py-4">
                              {renderStatus(item.is_active)}
                            </td>

                            <td className="px-3 py-4">
                              {item.is_active && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void handleRevoke('mentorship', item.id)
                                  }
                                  disabled={revokingId === item.id}
                                  className="text-xs font-semibold text-rose-600 hover:underline disabled:opacity-50"
                                >
                                  {revokingId === item.id
                                    ? 'Revoking...'
                                    : 'Revoke'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
