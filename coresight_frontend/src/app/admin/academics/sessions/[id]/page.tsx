
'use client';

import {
  Suspense,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {  useRouter } from 'next/navigation';
import {
  apiClient,
  institutionApi,
  subjectApi,
  assignmentApi,
  facultyApi,
  type AcademicSession,
  type AcademicYearOption,
  type Batch,
  type Section,
  type Subject,
  type SubjectOfferingOption,
  type TeachingAssignmentDetail,
  type MentorshipAssignment,
  type Faculty,
} from '@/lib/api';

// ============================================================
// TYPES
// ============================================================

interface AcademicSessionSubjectLink {
  id: string;
  academic_session_id: string;
  subject_id: string;
  created_at?: string;
  updated_at?: string;
}

type OfferingStatus = 'active' | 'completed' | 'cancelled';

interface OfferingRecord {
  id: string;
  subject_id: string;
  subject_code: string;
  subject_name: string;
  section_id: string;
  section_name: string;
  academic_session_id: string;
  semester_number: number;
  status: OfferingStatus;
}

type Tab = 'overview' | 'curriculum' | 'teaching' | 'mentorship';

// ============================================================
// HELPERS
// ============================================================

const cardClass =
  'rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5';

const mutedClass = 'text-sm text-slate-500';

function formatDate(value?: string) {
  if (!value) return '—';

  return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );
}

function statusClass(status: string) {
  switch (status) {
    case 'active':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600';
    case 'completed':
      return 'border-blue-500/20 bg-blue-500/10 text-blue-600';
    case 'cancelled':
      return 'border-red-500/20 bg-red-500/10 text-red-600';
    default:
      return 'border-amber-500/20 bg-amber-500/10 text-amber-600';
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClass(status)}`}
    >
      {status}
    </span>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Unable to load semester information.';
}

// ============================================================
// SMALL COMPONENTS
// ============================================================

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="mt-2 break-words text-sm font-semibold">
        {value || '—'}
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border-color)] p-10 text-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

interface SemesterDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function SemesterDetailsPage({
  params,
}: SemesterDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-12 text-center text-sm text-slate-500">
          Loading semester information...
        </div>
      }
    >
      <SemesterDetailsContent params={params} />
    </Suspense>
  );
}

function SemesterDetailsContent({
  params,
}: SemesterDetailsPageProps) {
  const { id: sessionId } = use(params);
  const router = useRouter();

  const [session, setSession] = useState<AcademicSession | null>(null);
  const [academicYear, setAcademicYear] =
    useState<AcademicYearOption | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);

  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [curriculumLinks, setCurriculumLinks] =
    useState<AcademicSessionSubjectLink[]>([]);

  const [offerings, setOfferings] = useState<OfferingRecord[]>([]);
  const [teachingAssignments, setTeachingAssignments] =
    useState<TeachingAssignmentDetail[]>([]);
  const [mentorshipAssignments, setMentorshipAssignments] =
    useState<MentorshipAssignment[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [allocatingSubjects, setAllocatingSubjects] = useState(false);
  const [allocationMessage, setAllocationMessage] = useState('');
  const [allocationError, setAllocationError] = useState('');
  const [deletingSubjectId, setDeletingSubjectId] = useState<string | null>(null);
  const [deletionMessage, setDeletionMessage] = useState('');
const [deletionError, setDeletionError] = useState('');
// ----------------------------------------------------------
  // LOAD DATA
  // ----------------------------------------------------------

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [
        sessionsData,
        yearsData,
        batchesData,
        sectionsData,
        subjectsData,
        curriculumData,
        availableOfferingsData,
        teachingData,
        mentorshipData,
        facultyData,
      ] = await Promise.all([
        institutionApi.getAcademicSessions(),
        institutionApi.getAcademicYears(),
        institutionApi.getBatches(),
        institutionApi.getSections(),
        subjectApi.getSubjects(),

        apiClient<AcademicSessionSubjectLink[]>(
          `/assignments/sessions/${encodeURIComponent(sessionId)}/subjects`,
          { cache: 'no-store' }
        ),

        assignmentApi.getAvailableSubjectOfferings(),
        assignmentApi.getTeachingAssignments(),
        assignmentApi.getMentorshipAssignments(),
        facultyApi.getFaculty(),
      ]);

      const selectedSession =
        sessionsData.find((item) => item.id === sessionId) ?? null;

      if (!selectedSession) {
        setSession(null);
        setError('The requested semester session was not found.');
        return;
      }

      const selectedYear =
        yearsData.find(
          (item) => item.id === selectedSession.academic_year_id
        ) ?? null;

      const selectedBatch =
        batchesData.find(
          (item) => item.id === selectedSession.batch_id
        ) ?? null;

      const selectedSections = sectionsData.filter(
        (section) => section.batch_id === selectedSession.batch_id
      );

      const sessionTeaching = teachingData.filter(
        (item) => item.academic_session_id === sessionId
      );

      const sessionMentorship = mentorshipData.filter(
        (item) =>
          item.academic_session_id === sessionId
      );

      // Available offerings + offerings already represented by
      // teaching assignments. Deduplicate by offering ID.
      const offeringMap = new Map<string, OfferingRecord>();

      const sessionAvailableOfferings =
        availableOfferingsData.filter(
          (item) => item.academic_session_id === sessionId
        );

      for (const item of sessionAvailableOfferings) {
        offeringMap.set(item.id, {
          id: item.id,
          subject_id: item.subject_id,
          subject_code: item.subject_code,
          subject_name: item.subject_name,
          section_id: item.section_id,
          section_name: item.section_name,
          academic_session_id: item.academic_session_id,
          semester_number: item.semester_number,
          status: item.status,
        });
      }

      for (const item of sessionTeaching) {
        if (!offeringMap.has(item.subject_offering_id)) {
          offeringMap.set(item.subject_offering_id, {
            id: item.subject_offering_id,
            subject_id: item.subject_id,
            subject_code: item.subject_code,
            subject_name: item.subject_name,
            section_id: item.section_id,
            section_name: item.section_name,
            academic_session_id: item.academic_session_id,
            semester_number: item.semester_number,
            status: 'active',
          });
        }
      }

      setSession(selectedSession);
      setAcademicYear(selectedYear);
      setBatch(selectedBatch);
      setSections(selectedSections);
      setSubjects(subjectsData);
      setCurriculumLinks(curriculumData);
      setOfferings(Array.from(offeringMap.values()));
      setTeachingAssignments(sessionTeaching);
      setMentorshipAssignments(sessionMentorship);
      setFaculty(facultyData);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleAllocateSubjects = async () => {
  if (selectedSubjectIds.length === 0) {
    setAllocationError('Select at least one subject.');
    return;
  }

  if (!['planned', 'active'].includes(session?.status?.toLowerCase() ?? '')) {
    setAllocationError(
      'Subjects can only be allocated to planned or active semesters.'
    );
    return;
  }

  setAllocatingSubjects(true);
  setAllocationError('');
  setAllocationMessage('');

  try {
    const result = await apiClient<{
      academic_session_id: string;
      subjects_added: number;
      offerings_created: number;
      offerings_existing: number;
    }>(
      `/assignments/sessions/${encodeURIComponent(sessionId)}/subjects`,
      {
        method: 'POST',
        body: JSON.stringify({
          subject_ids: selectedSubjectIds,
        }),
      }
    );

    setAllocationMessage(
      `${result.subjects_added} subject(s) allocated. ` +
      `${result.offerings_created} section offering(s) created. ` +
      `${result.offerings_existing} offering(s) already existed.`
    );

    setSelectedSubjectIds([]);

    await loadData();
  } catch (allocationFailure) {
    setAllocationError(getErrorMessage(allocationFailure));
  } finally {
    setAllocatingSubjects(false);
  }
};

const handleDeleteSemesterSubject = async (
  subjectId: string,
  subjectName: string,
  subjectCode: string
) => {
  const confirmed = window.confirm(
    `Are you sure you want to remove ${subjectName} (${subjectCode}) from Semester ${session?.semester_number}?\n\n` +
    `This will remove its allocation and associated section offerings from this semester only.\n\n` +
    `The subject will remain in the subject catalogue and other semesters will not be affected.`
  );

  if (!confirmed) return;

  setDeletingSubjectId(subjectId);
  setDeletionError('');
  setDeletionMessage('');

  try {
    await apiClient(
      `/assignments/sessions/${encodeURIComponent(sessionId)}/subjects/${encodeURIComponent(subjectId)}`,
      {
        method: 'DELETE',
      }
    );

    setDeletionMessage(
        `${subjectName} (${subjectCode}) has been removed from Semester ${session?.semester_number ?? ''}.`    );

    setSelectedSubjectIds((current) =>
      current.filter((id) => id !== subjectId)
    );

    await loadData();
  } catch (deleteError) {
    setDeletionError(getErrorMessage(deleteError));
  } finally {
    setDeletingSubjectId(null);
  }
};

  // ----------------------------------------------------------
  // DERIVED DATA
  // ----------------------------------------------------------

  const curriculumSubjects = useMemo(() => {
    return curriculumLinks
      .map((link) =>
        subjects.find((subject) => subject.id === link.subject_id)
      )
      .filter((subject): subject is Subject => Boolean(subject));
  }, [curriculumLinks, subjects]);

  const availableSubjects = useMemo(() => {
  const allocatedIds = new Set(
    curriculumLinks.map((link) => link.subject_id)
  );

  return subjects.filter(
    (subject) =>
      subject.is_active && !allocatedIds.has(subject.id)
  );
}, [subjects, curriculumLinks]);

  const activeTeachingAssignments = teachingAssignments.filter(
    (assignment) => assignment.is_active
  );

  const activeMentors = mentorshipAssignments.filter(
    (assignment) => assignment.is_active
  );

  const getFacultyName = (facultyId: string) =>
    faculty.find((item) => item.id === facultyId)?.full_name ??
    'Faculty details unavailable';

  const getSectionMentor = (sectionId: string) =>
    activeMentors.find((item) => item.section_id === sectionId);

  const getOfferingAssignments = (offeringId: string) =>
    teachingAssignments.filter(
      (item) => item.subject_offering_id === offeringId
    );

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum & Offerings' },
    { id: 'teaching', label: 'Teaching Faculty' },
    { id: 'mentorship', label: 'Section Mentors' },
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-12 text-center text-sm text-slate-500">
        Loading semester information...
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.push('/admin/academics')}
          className="text-sm font-semibold text-cyan-600 hover:underline"
        >
          ← Back to Academic Management
        </button>

        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
          <h2 className="font-semibold text-red-600">
            Unable to display semester
          </h2>
          <p className="mt-2 text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => void loadData()}
            className="mt-4 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 text-[var(--foreground)]">

      {/* HEADER */}

      <header className="space-y-4">
        <button
          type="button"
          onClick={() => router.push('/admin/academics')}
          className="text-sm font-semibold text-cyan-600 hover:underline"
        >
          ← Academic Management
        </button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Institution / Academics / Semester Details
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Semester {session.semester_number}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {batch?.name ?? 'Batch unavailable'}
              {' · '}
              {academicYear?.name ?? 'Academic year unavailable'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={session.status} />

            <button
              type="button"
              onClick={() => void loadData()}
              className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* SEMESTER SUMMARY */}

      <section className={cardClass}>
        <div className="mb-5">
          <h2 className="font-bold">Semester Information</h2>
          <p className={`mt-1 ${mutedClass}`}>
            Academic details associated with this semester.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            label="Semester"
            value={`Semester ${session.semester_number}`}
          />

          <InfoItem
            label="Academic Year"
            value={academicYear?.name ?? '—'}
          />

          <InfoItem
            label="Batch"
            value={batch?.name ?? '—'}
          />

          <InfoItem
            label="Start Date"
            value={formatDate(session.start_date)}
          />

          <InfoItem
            label="End Date"
            value={formatDate(session.end_date)}
          />

          <InfoItem
            label="Status"
            value={<StatusBadge status={session.status} />}
          />
        </div>
      </section>

      {/* QUICK COUNTS */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Curriculum Subjects',
            value: curriculumSubjects.length,
          },
          {
            label: 'Subject Offerings',
            value: offerings.length,
          },
          {
            label: 'Active Teaching Assignments',
            value: activeTeachingAssignments.length,
          },
          {
            label: 'Assigned Section Mentors',
            value: activeMentors.length,
          },
        ].map((item) => (
          <div key={item.label} className={cardClass}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-bold tabular-nums">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      {/* TABS */}

      <nav className="flex gap-6 overflow-x-auto border-b border-[var(--border-color)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition ${
              activeTab === tab.id
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-slate-500 hover:text-[var(--foreground)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* OVERVIEW */}

      {activeTab === 'overview' && (
        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-bold">Academic Overview</h2>
            <p className={`mt-1 ${mutedClass}`}>
              Summary of curriculum, sections and academic responsibilities.
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="font-bold">Sections in this Batch</h3>

            {sections.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  title="No sections configured"
                  description="No sections are currently associated with this batch."
                />
              </div>
            ) : (
              <div className="mt-4 divide-y divide-[var(--border-color)]">
                {sections.map((section) => {
                  const mentor = getSectionMentor(section.id);

                  const sectionOfferings = offerings.filter(
                    (offering) => offering.section_id === section.id
                  );

                  return (
                    <div
                      key={section.id}
                      className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-semibold">{section.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {sectionOfferings.length} subject offering(s)
                        </p>
                      </div>

                      <div className="text-sm sm:text-right">
                        <p className="text-xs text-slate-500">Section Mentor</p>
                        <p className="mt-1 font-medium">
                          {mentor
                            ? getFacultyName(mentor.faculty_id)
                            : 'Not assigned'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className={cardClass}>
            <h3 className="font-bold">Curriculum Summary</h3>

            {curriculumSubjects.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No curriculum subjects have been allocated to this semester.
              </p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {curriculumSubjects.map((subject) => (
                  <span
                    key={subject.id}
                    className="rounded-lg border border-[var(--border-color)] px-3 py-2 text-sm"
                  >
                    <span className="font-semibold">{subject.code}</span>
                    <span className="ml-2 text-slate-500">
                      {subject.name}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CURRICULUM AND OFFERINGS */}

      {activeTab === 'curriculum' && (
        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-bold">Curriculum & Subject Offerings</h2>
            <p className={`mt-1 ${mutedClass}`}>
              Curriculum allocation and section-wise delivery of subjects.
            </p>
          </div>


<div className={cardClass}>
  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
    <div>
      <h3 className="font-bold">Allocate Subjects to Semester</h3>
      <p className={`mt-1 ${mutedClass}`}>
        Select subjects from the catalogue. Each selected subject will
        be allocated to this semester and offered to its sections.
      </p>
    </div>

    <span className="text-sm text-slate-500">
      {selectedSubjectIds.length} selected
    </span>
  </div>

  {allocationMessage && (
    <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600">
      {allocationMessage}
    </div>
  )}

  {allocationError && (
    <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600">
      {allocationError}
    </div>
  )}

  <div className="mt-5">
    {availableSubjects.length === 0 ? (
      <EmptyState
        title="No available subjects"
        description="All active catalogue subjects are already allocated, or no active subjects exist."
      />
    ) : (
      <div className="max-h-80 space-y-2 overflow-y-auto">
        {availableSubjects.map((subject) => {
          const checked = selectedSubjectIds.includes(subject.id);

          return (
            <label
              key={subject.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                checked
                  ? 'border-cyan-500 bg-cyan-500/5'
                  : 'border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={
                  allocatingSubjects ||
                  !['planned', 'active'].includes(
                    session.status.toLowerCase()
                  )
                }
                onChange={(event) => {
                  setSelectedSubjectIds((current) =>
                    event.target.checked
                      ? [...current, subject.id]
                      : current.filter((id) => id !== subject.id)
                  );
                  setAllocationError('');
                  setAllocationMessage('');
                }}
                className="h-4 w-4 accent-cyan-600"
              />

              <div className="min-w-0 flex-1">
                <p className="font-semibold">{subject.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {subject.code} · {subject.credits} Credits
                </p>
              </div>

              <span className="text-xs text-slate-500">
                {checked ? 'Selected' : 'Select'}
              </span>
            </label>
          );
        })}
      </div>
    )}
  </div>

  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
    <button
      type="button"
      disabled={allocatingSubjects || selectedSubjectIds.length === 0}
      onClick={() => setSelectedSubjectIds([])}
      className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
    >
      Clear Selection
    </button>

    <button
      type="button"
      disabled={
        allocatingSubjects ||
        selectedSubjectIds.length === 0 ||
        !['planned', 'active'].includes(session.status.toLowerCase())
      }
      onClick={() => void handleAllocateSubjects()}
      className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {allocatingSubjects
        ? 'Allocating Subjects...'
        : `Allocate ${selectedSubjectIds.length || ''} Subject(s)`}
    </button>
  </div>
</div>



<div className={cardClass}>
  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
    <div>
      <h3 className="font-bold">Semester Subject Offerings</h3>
      <p className={`mt-1 ${mutedClass}`}>
        Subjects allocated to Semester {session.semester_number}.
        Removing a subject will remove its allocation from this semester only.
      </p>
    </div>

    <span className="text-sm text-slate-500">
      {curriculumSubjects.length} subject(s)
    </span>
  </div>

  {deletionMessage && (
    <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600">
      {deletionMessage}
    </div>
  )}

  {deletionError && (
    <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600">
      {deletionError}
    </div>
  )}

  {curriculumSubjects.length === 0 ? (
    <div className="mt-4">
      <EmptyState
        title="No subjects allocated"
        description="No subjects are currently allocated to this semester."
      />
    </div>
  ) : (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="border-b border-[var(--border-color)] text-xs uppercase text-slate-500">
          <tr>
            <th className="px-3 py-3">Subject Code</th>
            <th className="px-3 py-3">Subject Name</th>
            <th className="px-3 py-3">Credits</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {curriculumSubjects.map((subject) => {
            const isDeleting = deletingSubjectId === subject.id;

            return (
              <tr
                key={subject.id}
                className="border-b border-[var(--border-color)] last:border-0"
              >
                <td className="px-3 py-4 font-semibold">
                  {subject.code}
                </td>

                <td className="px-3 py-4">
                  {subject.name}
                </td>

                <td className="px-3 py-4">
                  {subject.credits}
                </td>

                <td className="px-3 py-4">
                  <StatusBadge
                    status={subject.is_active ? 'active' : 'archived'}
                  />
                </td>

                <td className="px-3 py-4 text-right">
                  <button
                    type="button"
                    disabled={
                      deletingSubjectId !== null ||
                      !['planned', 'active'].includes(
                        session.status.toLowerCase()
                      )
                    }
                    onClick={() =>
                      void handleDeleteSemesterSubject(
                        subject.id,
                        subject.name,
                        subject.code
                      )
                    }
                    className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? 'Removing...' : 'Delete'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>


          <div className={cardClass}>
            <h3 className="font-bold">Section-wise Subject Offerings</h3>

            <div className="mt-4 space-y-5">
              {sections.map((section) => {
                const sectionOfferings = offerings.filter(
                  (offering) => offering.section_id === section.id
                );

                return (
                  <div
                    key={section.id}
                    className="rounded-xl border border-[var(--border-color)] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-bold">{section.name}</h4>
                      <span className="text-xs text-slate-500">
                        {sectionOfferings.length} offering(s)
                      </span>
                    </div>

                    {sectionOfferings.length === 0 ? (
                      <p className="mt-3 text-sm text-slate-500">
                        No offerings returned for this section.
                      </p>
                    ) : (
                      <div className="mt-3 divide-y divide-[var(--border-color)]">
                        {sectionOfferings.map((offering) => {
                          const assignments = getOfferingAssignments(
                            offering.id
                          );

                          const activeAssignment = assignments.find(
                            (assignment) => assignment.is_active
                          );

                          return (
                            <div
                              key={offering.id}
                              className="flex flex-col justify-between gap-3 py-3 sm:flex-row sm:items-center"
                            >
                              <div>
                                <p className="font-semibold">
                                  {offering.subject_name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {offering.subject_code}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {activeAssignment
                                    ? getFacultyName(activeAssignment.faculty_id)
                                    : 'No active teaching assignment'}
                                </p>
                              </div>

                              <StatusBadge status={offering.status} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {sections.length === 0 && (
                <EmptyState
                  title="No sections found"
                  description="This batch has no configured sections."
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* TEACHING FACULTY */}

      {activeTab === 'teaching' && (
        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-bold">Teaching Assignments</h2>
            <p className={`mt-1 ${mutedClass}`}>
              Faculty responsible for teaching individual subject offerings.
            </p>
          </div>

          <div className={cardClass}>
            {teachingAssignments.length === 0 ? (
              <EmptyState
                title="No teaching assignments"
                description="No teaching assignments are currently recorded for this semester."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b border-[var(--border-color)] text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-3">Faculty</th>
                      <th className="px-3 py-3">Subject</th>
                      <th className="px-3 py-3">Section</th>
                      <th className="px-3 py-3">Assignment Status</th>
                      <th className="px-3 py-3">Assigned On</th>
                    </tr>
                  </thead>

                  <tbody>
                    {teachingAssignments.map((assignment) => (
                      <tr
                        key={assignment.id}
                        className="border-b border-[var(--border-color)] last:border-0"
                      >
                        <td className="px-3 py-4 font-semibold">
                          {getFacultyName(assignment.faculty_id)}
                        </td>
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
                          <StatusBadge
                            status={assignment.is_active ? 'active' : 'revoked'}
                          />
                        </td>
                        <td className="px-3 py-4 text-slate-500">
                          {formatDate(assignment.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION MENTORS */}

      {activeTab === 'mentorship' && (
        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-bold">Section Mentors</h2>
            <p className={`mt-1 ${mutedClass}`}>
              Mentorship responsibility is independent of subject teaching.
            </p>
          </div>

          <div className={cardClass}>
            {sections.length === 0 ? (
              <EmptyState
                title="No sections found"
                description="No sections are configured for this batch."
              />
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {sections.map((section) => {
                  const mentor = getSectionMentor(section.id);

                  const historicalAssignments =
                    mentorshipAssignments.filter(
                      (item) => item.section_id === section.id
                    );

                  return (
                    <div
                      key={section.id}
                      className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-semibold">{section.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {batch?.name}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs text-slate-500">
                          Current Section Mentor
                        </p>

                        <p className="mt-1 font-semibold">
                          {mentor
                            ? getFacultyName(mentor.faculty_id)
                            : 'Not assigned'}
                        </p>

                        {historicalAssignments.length > 0 && (
                          <p className="mt-1 text-xs text-slate-500">
                            {historicalAssignments.length} assignment record(s)
                          </p>
                        )}
                      </div>

                      <StatusBadge
                        status={mentor ? 'active' : 'not assigned'}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
}
