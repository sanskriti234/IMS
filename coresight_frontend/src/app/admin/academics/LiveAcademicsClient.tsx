
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  institutionApi,
  type Department,
  type AcademicYearOption,
  type AcademicYearCreatePayload,
  type AcademicSession,
  type AcademicSessionCreatePayload,
  type AcademicSessionStatus,
  type AcademicYearStatus,
  type Batch,
  type Section,
} from '@/lib/api';

// ============================================================
// TYPES
// ============================================================

type Tab = 'structure' | 'sessions' | 'sections';

interface SessionForm {
  department_id: string;
  academic_year_id: string;
  semester_number: string;
  start_date: string;
  end_date: string;
  status: AcademicSessionStatus;
}

interface SectionForm {
  name: string;
  capacity_informational: string;
}

const emptyYearForm: AcademicYearCreatePayload = {
  name: '',
  start_date: '',
  end_date: '',
  status: 'planned',
};

const emptySessionForm: SessionForm = {
  department_id: '',
  academic_year_id: '',
  semester_number: '',
  start_date: '',
  end_date: '',
  status: 'planned',
};

const emptySectionForm: SectionForm = {
  name: '',
  capacity_informational: '60',
};

const inputClass =
  'w-full rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50';

// ============================================================
// HELPERS
// ============================================================

function formatDate(value?: string) {
  if (!value) return '—';

  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
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

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function Field({
  label,
  hint,
  example,
  children,
}: {
  label: string;
  hint?: string;
  example?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 text-xs leading-5 text-slate-500">
          {hint}
        </p>
      )}

      {example && (
        <p className="mt-1 text-xs text-cyan-600">
          Example: {example}
        </p>
      )}
    </div>
  );
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

function FormError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600"
    >
      {message}
    </div>
  );
}

function InfoBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
      <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
        {title}
      </p>

      <div className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
        {children}
      </div>
    </div>
  );
}

function Modal({
  title,
  description,
  onClose,
  submitting,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  submitting: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !submitting
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg px-2 py-1 text-xl text-slate-500 hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function ModalActions({
  onCancel,
  submitting,
  submitLabel,
}: {
  onCancel: () => void;
  submitting: boolean;
  submitLabel: string;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-color)] pt-5 sm:flex-row sm:justify-end">
      <button
        type="button"
        disabled={submitting}
        onClick={onCancel}
        className="rounded-xl border border-[var(--border-color)] px-5 py-3 text-sm font-semibold hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function LiveAcademicsClient() {
  // ----------------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------------
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('structure');

  // ----------------------------------------------------------
  // DATABASE DATA
  // ----------------------------------------------------------

  const [departments, setDepartments] = useState<Department[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  // ----------------------------------------------------------
  // PAGE SELECTIONS
  // ----------------------------------------------------------

  const [selectedYearId, setSelectedYearId] = useState('');
  const [sessionYearFilter, setSessionYearFilter] = useState('all');
  const [selectedBatchId, setSelectedBatchId] = useState('');

  // ----------------------------------------------------------
  // PAGE STATES
  // ----------------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [pageError, setPageError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ----------------------------------------------------------
  // MODAL STATES
  // ----------------------------------------------------------

  const [showYearForm, setShowYearForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);

  // ----------------------------------------------------------
  // SUBMISSION STATES
  // ----------------------------------------------------------

  const [submitting, setSubmitting] = useState(false);
  const [sectionSubmitting, setSectionSubmitting] = useState(false);

  const [formError, setFormError] = useState('');
  const [sectionError, setSectionError] = useState('');

  // ----------------------------------------------------------
  // FORM STATES
  // ----------------------------------------------------------

  const [yearForm, setYearForm] =
    useState<AcademicYearCreatePayload>(emptyYearForm);

  const [sessionForm, setSessionForm] =
    useState<SessionForm>(emptySessionForm);

  const [sectionForm, setSectionForm] =
    useState<SectionForm>(emptySectionForm);

  const [editingSection, setEditingSection] =
    useState<Section | null>(null);

  // ----------------------------------------------------------
  // DERIVED RECORDS
  // ----------------------------------------------------------

  const selectedYear = academicYears.find(
    (year) => year.id === selectedYearId
  );

  const sessionYear = academicYears.find(
    (year) => year.id === sessionForm.academic_year_id
  );

  const selectedDepartment = departments.find(
    (department) => department.id === sessionForm.department_id
  );

  const selectedBatch = batches.find(
    (batch) => batch.id === selectedBatchId
  );

  const batchSections = useMemo(
    () =>
      sections.filter(
        (section) => section.batch_id === selectedBatchId
      ),
    [sections, selectedBatchId]
  );

  // ----------------------------------------------------------
  // LOAD ALL DATA
  // ----------------------------------------------------------

  const loadData = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setPageError('');

    try {
      const [
        departmentData,
        yearData,
        batchData,
        sessionData,
        sectionData,
      ] = await Promise.all([
        institutionApi.getDepartments(),
        institutionApi.getAcademicYears(),
        institutionApi.getBatches(),
        institutionApi.getAcademicSessions(),
        institutionApi.getSections(),
      ]);

      setDepartments(departmentData);
      setAcademicYears(yearData);
      setBatches(batchData);
      setSessions(sessionData);
      setSections(sectionData);

      setSelectedYearId((current) => {
        if (current && yearData.some((year) => year.id === current)) {
          return current;
        }

        return yearData[0]?.id ?? '';
      });

      setSelectedBatchId((current) => {
        if (current && batchData.some((batch) => batch.id === current)) {
          return current;
        }

        return batchData[0]?.id ?? '';
      });

      setSessionYearFilter((current) => {
        if (
          current !== 'all' &&
          !yearData.some((year) => year.id === current)
        ) {
          return 'all';
        }

        return current;
      });
    } catch (error) {
      setPageError(
        getErrorMessage(error, 'Unable to load academic records.')
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ----------------------------------------------------------
  // INITIAL LOAD
  // ----------------------------------------------------------

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // ----------------------------------------------------------
  // SESSION FILTERS
  // ----------------------------------------------------------

  const filteredSessions = useMemo(() => {
    if (sessionYearFilter === 'all') return sessions;

    return sessions.filter(
      (session) => session.academic_year_id === sessionYearFilter
    );
  }, [sessions, sessionYearFilter]);

  const activeSessions = sessions.filter(
    (session) => session.status === 'active'
  ).length;

  const plannedSessions = sessions.filter(
    (session) => session.status === 'planned'
  ).length;

  const completedSessions = sessions.filter(
    (session) => session.status === 'completed'
  ).length;

  const cancelledSessions = sessions.filter(
    (session) => session.status === 'cancelled'
  ).length;

  // ----------------------------------------------------------
  // BATCH PREVIEW
  // ----------------------------------------------------------

  const batchPreview =
    selectedDepartment && sessionYear
      ? `${selectedDepartment.code} ${sessionYear.start_date.slice(0, 4)}-${sessionYear.end_date.slice(2, 4)}`
      : '';

  const matchingBatch = batches.find(
    (batch) => batch.name === batchPreview
  );

  // ----------------------------------------------------------
  // SEMESTER PROGRESSION
  // ----------------------------------------------------------

  // Only consider history belonging to the exact batch and
  // academic year currently selected in the form.
  const semesterHistory = matchingBatch
    ? sessions.filter(
        (session) =>
          session.academic_year_id === sessionForm.academic_year_id &&
          session.batch_id === matchingBatch.id
      )
    : [];

  const latestConfiguredSemester = [...semesterHistory].sort(
    (a, b) =>
      b.semester_number - a.semester_number ||
      new Date(b.start_date).getTime() -
        new Date(a.start_date).getTime()
  )[0];

  // First import: admin can select any valid starting semester.
  const isInitialBatchSetup = semesterHistory.length === 0;

  // After initialization, only the immediate next semester
  // is eligible, and only after the latest one is completed.
  const nextEligibleSemester =
    latestConfiguredSemester &&
    latestConfiguredSemester.status === 'completed' &&
    latestConfiguredSemester.semester_number < 8
      ? latestConfiguredSemester.semester_number + 1
      : null;

  const semesterAlreadyExists = (semester: number) =>
    semesterHistory.some(
      (session) => session.semester_number === semester
    );

  const isSemesterSelectable = (semester: number) => {
    if (semesterAlreadyExists(semester)) {
      return false;
    }

    if (isInitialBatchSetup) {
      return semester >= 1 && semester <= 8;
    }

    return nextEligibleSemester === semester;
  };

  const canCreateSelectedSemester =
    Number.isInteger(Number(sessionForm.semester_number)) &&
    isSemesterSelectable(Number(sessionForm.semester_number));
  // ----------------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------------

  function notify(message: string) {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(''), 4500);
  }

  // ----------------------------------------------------------
  // MODAL CONTROLS
  // ----------------------------------------------------------

  function closeForms() {
    if (submitting) return;

    setShowYearForm(false);
    setShowSessionForm(false);
    setFormError('');
  }

  function openYearForm() {
    setYearForm(emptyYearForm);
    setFormError('');
    setShowYearForm(true);
  }

  function openSessionForm() {
    setSessionForm({
      ...emptySessionForm,
      academic_year_id: selectedYearId,
    });

    setFormError('');
    setShowSessionForm(true);
  }

  // ----------------------------------------------------------
  // CREATE ACADEMIC YEAR
  // ----------------------------------------------------------

  async function handleCreateYear(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setFormError('');

    const name = yearForm.name.trim();

    if (!/^\d{4}-(\d{2}|\d{4})$/.test(name)) {
      setFormError(
        'Use the format YYYY-YY or YYYY-YYYY. Example: 2023-27.'
      );
      return;
    }

    if (
      !yearForm.start_date ||
      !yearForm.end_date ||
      yearForm.end_date <= yearForm.start_date
    ) {
      setFormError('End date must be later than start date.');
      return;
    }

    setSubmitting(true);

    try {
      const created = await institutionApi.createAcademicYear({
        ...yearForm,
        name,
      });

      await loadData(true);

      setSelectedYearId(created.id);
      setYearForm(emptyYearForm);
      setShowYearForm(false);
      setActiveTab('structure');

      notify(`Academic year ${created.name} created successfully.`);
    } catch (error) {
      setFormError(
        getErrorMessage(error, 'Unable to create academic year.')
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ----------------------------------------------------------
  // CREATE SEMESTER SESSION
  // ----------------------------------------------------------

  async function handleCreateSession(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setFormError('');

    if (!sessionForm.department_id) {
      setFormError('Select a department.');
      return;
    }

    if (!sessionYear) {
      setFormError('Select an academic year.');
      return;
    }

    const semesterNumber = Number(sessionForm.semester_number);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 8
    ) {
      setFormError('Select a valid semester number.');
      return;
    }

    if (!isSemesterSelectable(semesterNumber)) {
      if (semesterAlreadyExists(semesterNumber)) {
        setFormError(
          `Semester ${semesterNumber} already exists for this batch and academic year.`
        );
      } else if (isInitialBatchSetup) {
        setFormError('Select a valid initial semester.');
      } else if (
        latestConfiguredSemester &&
        latestConfiguredSemester.status !== 'completed'
      ) {
        setFormError(
          `Semester ${latestConfiguredSemester.semester_number} must be marked COMPLETED before creating the next semester.`
        );
      } else if (nextEligibleSemester === null) {
        setFormError(
          'The programme has reached its maximum semester limit.'
        );
      } else {
        setFormError(
          `Only Semester ${nextEligibleSemester} can be created next.`
        );
      }

      return;
    }

    if (semesterAlreadyExists(semesterNumber)) {
      setFormError(
        `Semester ${semesterNumber} already exists for this batch and academic year.`
      );
      return;
    }

    if (
      !sessionForm.start_date ||
      !sessionForm.end_date ||
      sessionForm.end_date <= sessionForm.start_date
    ) {
      setFormError('Enter valid semester session dates.');
      return;
    }

    if (
      sessionForm.start_date < sessionYear.start_date ||
      sessionForm.end_date > sessionYear.end_date
    ) {
      setFormError(
        'Semester dates must fall within the selected academic year.'
      );
      return;
    }

    const payload: AcademicSessionCreatePayload = {
      department_id: sessionForm.department_id,
      academic_year_id: sessionYear.id,
      semester_number: semesterNumber,
      start_date: sessionForm.start_date,
      end_date: sessionForm.end_date,
      status: sessionForm.status,
    };

    setSubmitting(true);

    try {
      await institutionApi.createAcademicSession(payload);

      setShowSessionForm(false);
      setSessionForm(emptySessionForm);

      await loadData(true);

      notify(
        `Semester ${semesterNumber} session created successfully.`
      );
    } catch (error) {
      setFormError(
        getErrorMessage(error, 'Unable to create semester session.')
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ----------------------------------------------------------
  // SECTION MANAGEMENT
  // ----------------------------------------------------------

  function openCreateSectionForm() {
    if (!selectedBatchId) {
      notify('Select a batch first.');
      return;
    }

    setEditingSection(null);
    setSectionForm(emptySectionForm);
    setSectionError('');
    setShowSectionForm(true);
  }

  function openEditSectionForm(section: Section) {
    setEditingSection(section);

    setSectionForm({
      name: section.name,
      capacity_informational: String(
        section.capacity_informational
      ),
    });

    setSectionError('');
    setShowSectionForm(true);
  }

  function closeSectionForm() {
    if (sectionSubmitting) return;

    setShowSectionForm(false);
    setEditingSection(null);
    setSectionForm(emptySectionForm);
    setSectionError('');
  }

  async function handleSaveSection(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSectionError('');

    const name = sectionForm.name.trim().toUpperCase();
    const capacity = Number(sectionForm.capacity_informational);

    if (!name) {
      setSectionError('Section name is required.');
      return;
    }

    if (!Number.isInteger(capacity) || capacity < 1) {
      setSectionError('Capacity must be a positive whole number.');
      return;
    }

    if (!editingSection && !selectedBatchId) {
      setSectionError('Select a batch before creating a section.');
      return;
    }

    setSectionSubmitting(true);

    try {
      if (editingSection) {
        const updated = await institutionApi.updateSection(
          editingSection.id,
          {
            name,
            capacity_informational: capacity,
          }
        );

        setSections((previous) =>
          previous.map((section) =>
            section.id === updated.id ? updated : section
          )
        );

        notify(`Section ${updated.name} updated successfully.`);
      } else {
        const created = await institutionApi.createSection({
          batch_id: selectedBatchId,
          name,
          capacity_informational: capacity,
        });

        setSections((previous) =>
          [...previous, created].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );

        notify(`Section ${created.name} created successfully.`);
      }

      setShowSectionForm(false);
      setEditingSection(null);
      setSectionForm(emptySectionForm);
    } catch (error) {
      setSectionError(
        getErrorMessage(error, 'Unable to save section.')
      );
    } finally {
      setSectionSubmitting(false);
    }
  }

  // ----------------------------------------------------------
  // DISPLAY HELPERS
  // ----------------------------------------------------------

  function getBatchName(batchId: string) {
    return batches.find((batch) => batch.id === batchId)?.name
      ?? 'Unknown batch';
  }

  function getYearName(yearId: string) {
    return academicYears.find((year) => year.id === yearId)?.name
      ?? 'Unknown year';
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'structure', label: 'Academic Structure' },
    { id: 'sessions', label: 'Semester Sessions' },
    { id: 'sections', label: 'Sections' },
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-7 text-[var(--foreground)]">

      {/* HEADER */}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Institution / Administration
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Academic Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage academic years, semester sessions and batch-wise sections.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadData(true)}
            disabled={refreshing}
            className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            type="button"
            onClick={openYearForm}
            className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            + Create Academic Year
          </button>
        </div>
      </header>

      {/* NOTIFICATIONS */}

      {successMessage && (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600"
        >
          {successMessage}
        </div>
      )}

      {pageError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm font-semibold text-red-600">
            Unable to load academic data
          </p>

          <p className="mt-1 text-sm text-red-600">{pageError}</p>

          <button
            type="button"
            onClick={() => void loadData()}
            className="mt-3 text-sm font-semibold text-red-600 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Academic Years', academicYears.length],
          ['Batches', batches.length],
          ['Semester Sessions', sessions.length],
          ['Active Sessions', activeSessions],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5"
          >
            <p className="text-sm text-slate-500">{label}</p>

            <p className="mt-3 text-3xl font-bold">
              {loading ? '—' : value}
            </p>
          </div>
        ))}
      </div>

      {/* TABS */}

      <div className="flex gap-6 overflow-x-auto border-b border-[var(--border-color)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap border-b-2 pb-3 text-sm font-semibold ${
              activeTab === tab.id
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-slate-500 hover:text-[var(--foreground)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-12 text-center text-sm text-slate-500">
          Loading academic records...
        </div>
      ) : (
        <>
          {/* ==================================================
              ACADEMIC STRUCTURE
          ================================================== */}

          {activeTab === 'structure' && (
            <section className="space-y-5">

              <div>
                <h2 className="text-lg font-bold">Academic Years</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Each academic year represents the complete duration of a student cohort.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
                <Field
                  label="Select Academic Year"
                  hint="Choose the cohort for which you want to create or view semester sessions."
                >
                  <select
                    value={selectedYearId}
                    onChange={(event) => setSelectedYearId(event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select academic year</option>

                    {academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.name}
                      </option>
                    ))}
                  </select>
                </Field>

                {!academicYears.length && (
                  <p className="mt-4 text-sm text-amber-600">
                    No academic years found. Create one to begin.
                  </p>
                )}

                {selectedYear && (
                  <div className="mt-5 grid gap-4 border-t border-[var(--border-color)] pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-500">Academic Year</p>
                      <p className="mt-1 font-semibold">{selectedYear.name}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Duration</p>
                      <p className="mt-1 font-semibold">
                        {formatDate(selectedYear.start_date)} – {formatDate(selectedYear.end_date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Status</p>
                      <div className="mt-1">
                        <StatusBadge status={selectedYear.status} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedYear && (
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-bold">Semester Sessions</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Sessions created under {selectedYear.name}.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={openSessionForm}
                      className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
                    >
                      + Create Semester Session
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 8 }, (_, index) => index + 1).map(
                      (semester) => {
                        const session = sessions.find(
                          (item) =>
                            item.academic_year_id === selectedYear.id &&
                            item.semester_number === semester
                        );

                        return (
                          <div
                            key={semester}
                            className="rounded-xl border border-[var(--border-color)] p-4"
                          >
                            <p className="font-semibold">
                              Semester {semester}
                            </p>

                            {session ? (
                              <div className="mt-2 space-y-2">
                                <StatusBadge status={session.status} />
                                <p className="text-xs text-slate-500">
                                  {formatDate(session.start_date)} – {formatDate(session.end_date)}
                                </p>
                              </div>
                            ) : (
                              <p className="mt-2 text-xs text-slate-500">
                                Not created
                              </p>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
              {selectedYear && (
                <InfoBox title="Semester progression">
                  When a batch is first imported into CoreSight, the admin
                  can choose any valid starting semester. For example, an
                  existing 2023–27 batch can begin with Semester 5.
                  After initialization, only the next semester can be
                  created, and the latest configured semester must be
                  marked COMPLETED first.
                </InfoBox>
              )}
            </section>
          )}

          {/* ==================================================
              SEMESTER SESSIONS
          ================================================== */}

          {activeTab === 'sessions' && (
            <section className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">Semester Sessions</h2>

                  <p className="mt-1 text-sm text-slate-500">
                    View semester sessions and their generated batches.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={sessionYearFilter}
                    onChange={(event) => setSessionYearFilter(event.target.value)}
                    className={`${inputClass} sm:max-w-xs`}
                  >
                    <option value="all">All Academic Years</option>

                    {academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={openSessionForm}
                    disabled={!academicYears.length}
                    className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    + Create Session
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
                {filteredSessions.length === 0 ? (
                  <div className="p-12 text-center">
                    <h3 className="font-semibold">
                      No semester sessions found
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Create the first semester session for an academic year.
                    </p>

                    <button
                      type="button"
                      onClick={openSessionForm}
                      disabled={!academicYears.length}
                      className="mt-4 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                    >
                      Create First Session
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                      <thead className="border-b border-[var(--border-color)] bg-black/[0.025] dark:bg-white/[0.025]">
                        <tr className="text-xs uppercase tracking-wider text-slate-500">
                          <th className="px-5 py-4">Semester</th>
                          <th className="px-5 py-4">Academic Year</th>
                          <th className="px-5 py-4">Batch</th>
                          <th className="px-5 py-4">Start Date</th>
                          <th className="px-5 py-4">End Date</th>
                          <th className="px-5 py-4">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredSessions.map((session) => (
                         <tr
                          key={session.id}
                          role="link"
                          tabIndex={0}
                          aria-label={`View Semester ${session.semester_number} information`}
                          onClick={() =>
                            router.push(`/admin/academics/sessions/${session.id}`)
                          }
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              router.push(`/admin/academics/sessions/${session.id}`);
                            }
                          }}
                          className="cursor-pointer border-b border-[var(--border-color)] last:border-0 transition-colors hover:bg-cyan-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500"
                        >
                            <td className="px-5 py-4 font-semibold">
                              Semester {session.semester_number}
                            </td>

                            <td className="px-5 py-4">
                              {getYearName(session.academic_year_id)}
                            </td>

                            <td className="px-5 py-4">
                              {getBatchName(session.batch_id)}
                            </td>

                            <td className="px-5 py-4 text-slate-500">
                              {formatDate(session.start_date)}
                            </td>

                            <td className="px-5 py-4 text-slate-500">
                              {formatDate(session.end_date)}
                            </td>

                            <td className="px-5 py-4">
                              <StatusBadge status={session.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span>Planned: {plannedSessions}</span>
                <span>Active: {activeSessions}</span>
                <span>Completed: {completedSessions}</span>
                <span>Cancelled: {cancelledSessions}</span>
              </div>
            </section>
          )}

          {/* ==================================================
              BATCH-WISE SECTION MANAGEMENT
          ================================================== */}

          {activeTab === 'sections' && (
            <section className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">Batch-wise Sections</h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage sections independently for each batch.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openCreateSectionForm}
                  disabled={!selectedBatchId}
                  className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  + Create Section
                </button>
              </div>

              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
                <Field
                  label="Select Batch"
                  hint="Sections belong to a batch, not to an individual semester."
                >
                  <select
                    value={selectedBatchId}
                    onChange={(event) => setSelectedBatchId(event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select a batch</option>

                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </Field>

                {selectedBatch && (
                  <div className="mt-4 border-t border-[var(--border-color)] pt-4">
                    <p className="text-xs text-slate-500">Selected Batch</p>
                    <p className="mt-1 font-semibold">{selectedBatch.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {batchSections.length} section(s) configured
                    </p>
                  </div>
                )}
              </div>

              {!batches.length ? (
                <div className="rounded-2xl border border-dashed border-[var(--border-color)] p-10 text-center">
                  <h3 className="font-semibold">No batches available</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Create an academic session first. The backend will resolve its batch.
                  </p>
                </div>
              ) : !selectedBatchId ? (
                <div className="rounded-2xl border border-dashed border-[var(--border-color)] p-10 text-center text-sm text-slate-500">
                  Select a batch to view its sections.
                </div>
              ) : batchSections.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border-color)] p-10 text-center">
                  <h3 className="font-semibold">
                    No sections in this batch
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Create the first section for {selectedBatch?.name}.
                  </p>

                  <button
                    type="button"
                    onClick={openCreateSectionForm}
                    className="mt-4 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Create First Section
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {batchSections.map((section) => (
                    <div
                      key={section.id}
                      className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold">
                            {section.name}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {selectedBatch?.name}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => openEditSectionForm(section)}
                          className="rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="mt-5 border-t border-[var(--border-color)] pt-4">
                        <p className="text-xs text-slate-500">
                          Informational Capacity
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          {section.capacity_informational}
                          <span className="ml-1 text-xs font-normal text-slate-500">
                            students
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}

      {/* ======================================================
          CREATE ACADEMIC YEAR MODAL
      ====================================================== */}

      {showYearForm && (
        <Modal
          title="Create Academic Year"
          description="Create the complete cohort duration for your institution."
          onClose={closeForms}
          submitting={submitting}
        >
          <form onSubmit={handleCreateYear} className="space-y-5">
            {formError && <FormError message={formError} />}

            <InfoBox title="Academic Year">
              An academic year represents the complete duration of a student
              cohort. For example, a four-year B.Tech cohort can use
              2023-27. Individual semester sessions are created inside it.
            </InfoBox>

            <Field
              label="Academic Year Name *"
              hint="Enter a unique cohort name."
              example="2023-27"
            >
              <input
                required
                maxLength={20}
                placeholder="YYYY-YY or YYYY-YYYY"
                value={yearForm.name}
                onChange={(event) =>
                  setYearForm({
                    ...yearForm,
                    name: event.target.value,
                  })
                }
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start Date *" example="2023-06-17">
                <input
                  required
                  type="date"
                  value={yearForm.start_date}
                  onChange={(event) =>
                    setYearForm({
                      ...yearForm,
                      start_date: event.target.value,
                    })
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="End Date *" example="2027-07-31">
                <input
                  required
                  type="date"
                  min={yearForm.start_date || undefined}
                  value={yearForm.end_date}
                  onChange={(event) =>
                    setYearForm({
                      ...yearForm,
                      end_date: event.target.value,
                    })
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Status *">
              <select
                value={yearForm.status}
                onChange={(event) =>
                  setYearForm({
                    ...yearForm,
                    status: event.target.value as AcademicYearStatus,
                  })
                }
                className={inputClass}
              >
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </Field>

            <ModalActions
              onCancel={closeForms}
              submitting={submitting}
              submitLabel="Save Academic Year"
            />
          </form>
        </Modal>
      )}

      {/* ======================================================
          CREATE SEMESTER SESSION MODAL
      ====================================================== */}

      {showSessionForm && (
        <Modal
          title="Create Semester Session"
          description="Create a semester directly under the selected academic year."
          onClose={closeForms}
          submitting={submitting}
        >
          <form onSubmit={handleCreateSession} className="space-y-5">
            {formError && <FormError message={formError} />}

            <InfoBox title="Automatic Batch Generation">
              You do not need to create or select a batch here.
              The backend finds the department's default B.Tech programme
              and creates or reuses its batch using the selected academic year.
            </InfoBox>

            <Field label="Department *" example="CSE AIML">
              <select
                required
                value={sessionForm.department_id}
                onChange={(event) =>
                  setSessionForm({
                    ...sessionForm,
                    department_id: event.target.value,
                    semester_number: '',
                  })
                }
                className={inputClass}
              >
                <option value="">Select department</option>

                {departments
                  .filter((department) => department.is_active !== false)
                  .map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.code})
                    </option>
                  ))}
              </select>
            </Field>

            <Field label="Academic Year *" example="2023-27">
              <select
                required
                value={sessionForm.academic_year_id}
                onChange={(event) =>
                  setSessionForm({
                    ...sessionForm,
                    academic_year_id: event.target.value,
                    semester_number: '',
                    start_date: '',
                    end_date: '',
                  })
                }
                className={inputClass}
              >
                <option value="">Select academic year</option>

                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </Field>

            {batchPreview && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Automatically resolved batch
                </p>

                <p className="mt-2 text-lg font-bold">{batchPreview}</p>

                <p className="mt-1 text-xs text-slate-500">
                  The backend creates or reuses this batch when the session is saved.
                </p>
              </div>
            )}

              <Field
                label="Semester Number *"
                hint={
                  isInitialBatchSetup
                    ? 'Initial batch setup: choose the semester currently in progress or the appropriate starting semester from the imported college records.'
                    : latestConfiguredSemester?.status === 'completed'
                      ? `Only Semester ${nextEligibleSemester ?? '—'} can be created next.`
                      : `Semester ${latestConfiguredSemester?.semester_number ?? '—'} must be marked COMPLETED before progression.`
                }
              >
              <select
                required
                disabled={!sessionForm.academic_year_id || !sessionForm.department_id}
                value={sessionForm.semester_number}
                onChange={(event) =>
                  setSessionForm({
                    ...sessionForm,
                    semester_number: event.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="">Select semester</option>

                {Array.from({ length: 8 }, (_, index) => index + 1).map(
                  (semester) => {
                    const exists = semesterAlreadyExists(semester);
                    const selectable = isSemesterSelectable(semester);

                    let suffix = ' — Not available';

                    if (exists) {
                      suffix = ' — Already created';
                    } else if (selectable && isInitialBatchSetup) {
                      suffix = ' — Available for initial setup';
                    } else if (selectable) {
                      suffix = ' — Next available';
                    } else if (
                      latestConfiguredSemester &&
                      latestConfiguredSemester.status !== 'completed'
                    ) {
                      suffix = ' — Complete current semester first';
                    } else if (
                      nextEligibleSemester === null &&
                      !isInitialBatchSetup
                    ) {
                      suffix = ' — Programme limit reached';
                    }

                    return (
                      <option
                        key={semester}
                        value={semester}
                        disabled={!selectable}
                      >
                        Semester {semester}{suffix}
                      </option>
                    );
                  }
                )}
              </select>

              {sessionForm.academic_year_id && (
                <p className="mt-2 text-xs text-cyan-600">
                  {isInitialBatchSetup
                    ? 'Initial setup: admin may select any semester from 1 to 8.'
                    : latestConfiguredSemester?.status === 'completed'
                      ? nextEligibleSemester
                        ? `Next eligible semester: Semester ${nextEligibleSemester}.`
                        : 'All programme semesters have been configured.'
                      : `Current latest semester: Semester ${latestConfiguredSemester?.semester_number}. Mark it COMPLETED to unlock the next semester.`}
                </p>
              )}
            </Field>

            <Field label="Session Status *">
              <select
                value={sessionForm.status}
                onChange={(event) =>
                  setSessionForm({
                    ...sessionForm,
                    status: event.target.value as AcademicSessionStatus,
                  })
                }
                className={inputClass}
              >
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <p className="mt-1.5 text-xs text-slate-500">
                New sessions cannot be created directly as completed.
              </p>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Semester Start Date *">
                <input
                  required
                  type="date"
                  disabled={!sessionYear}
                  min={sessionYear?.start_date}
                  max={sessionYear?.end_date}
                  value={sessionForm.start_date}
                  onChange={(event) =>
                    setSessionForm({
                      ...sessionForm,
                      start_date: event.target.value,
                      end_date: '',
                    })
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Semester End Date *">
                <input
                  required
                  type="date"
                  disabled={!sessionYear}
                  min={sessionForm.start_date || sessionYear?.start_date}
                  max={sessionYear?.end_date}
                  value={sessionForm.end_date}
                  onChange={(event) =>
                    setSessionForm({
                      ...sessionForm,
                      end_date: event.target.value,
                    })
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <ModalActions
              onCancel={closeForms}
              submitting={submitting}
              submitLabel="Create Semester Session"
            />
          </form>
        </Modal>
      )}

      {/* ======================================================
          CREATE / EDIT SECTION MODAL
      ====================================================== */}

      {showSectionForm && (
        <Modal
          title={editingSection ? 'Edit Section' : 'Create Section'}
          description={
            editingSection
              ? 'Update the section name or informational capacity.'
              : `Create a section under ${selectedBatch?.name ?? 'the selected batch'}.`
          }
          onClose={closeSectionForm}
          submitting={sectionSubmitting}
        >
          <form onSubmit={handleSaveSection} className="space-y-5">
            {sectionError && <FormError message={sectionError} />}

            <InfoBox title="Batch-wise Section Management">
              A section belongs to a batch, not to an individual semester.
              The same section can be used across the batch's academic sessions.
            </InfoBox>

            <Field label="Section Name *" example="A">
              <input
                required
                maxLength={50}
                placeholder="Enter section name"
                value={sectionForm.name}
                onChange={(event) =>
                  setSectionForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </Field>

            <Field
              label="Informational Capacity *"
              hint="This is informational only. It does not enforce an enrollment limit."
            >
              <input
                required
                type="number"
                min={1}
                step={1}
                value={sectionForm.capacity_informational}
                onChange={(event) =>
                  setSectionForm((previous) => ({
                    ...previous,
                    capacity_informational: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </Field>

            <ModalActions
              onCancel={closeSectionForm}
              submitting={sectionSubmitting}
              submitLabel={
                editingSection ? 'Update Section' : 'Create Section'
              }
            />
          </form>
        </Modal>
      )}
    </div>
  );
}
