
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AdminNavbar } from '@/components/navigation/AdminNavbar';
import {
  subjectApi,
  institutionApi,
  type Subject,
  type Department,
  type SubjectCreatePayload,
} from '@/lib/api';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
} from 'lucide-react';

const emptyForm: SubjectCreatePayload = {
  department_id: '',
  code: '',
  name: '',
  credits: 3,
};

const inputClass =
  'w-full rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 text-sm outline-none focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-60';

type DeleteSubjectResult = {
  success: boolean;
  action: 'deleted' | 'archived';
  message: string;
  subject_id: string;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [form, setForm] = useState<SubjectCreatePayload>(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --------------------------------------------------
  // LOAD SUBJECTS AND DEPARTMENTS
  // --------------------------------------------------

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [subjectData, departmentData] = await Promise.all([
        subjectApi.getSubjects(),
        institutionApi.getDepartments(),
      ]);

      setSubjects(subjectData);
      setDepartments(departmentData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load subjects.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    void loadData();
  }, [loadData]);

  // --------------------------------------------------
  // FILTER SUBJECTS
  // --------------------------------------------------

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSearch =
        !query ||
        subject.name.toLowerCase().includes(query) ||
        subject.code.toLowerCase().includes(query);

      const matchesDepartment =
        departmentFilter === 'all' ||
        subject.department_id === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [subjects, search, departmentFilter]);

  // --------------------------------------------------
  // FORM HANDLERS
  // --------------------------------------------------

  function openCreateForm() {
    setEditingSubject(null);
    setForm({ ...emptyForm });
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function openEditForm(subject: Subject) {
    setEditingSubject(subject);

    setForm({
      department_id: subject.department_id,
      code: subject.code,
      name: subject.name,
      credits: subject.credits,
    });

    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingSubject(null);
    setForm({ ...emptyForm });
    setError('');
  }

  function updateForm<K extends keyof SubjectCreatePayload>(
    field: K,
    value: SubjectCreatePayload[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // --------------------------------------------------
  // CREATE / UPDATE SUBJECT
  // --------------------------------------------------

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setSuccess('');

    const payload = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      credits: Number(form.credits),
    };

    if (!payload.code || !payload.name) {
      setError('Subject code and name are required.');
      return;
    }

    if (!Number.isInteger(payload.credits) || payload.credits <= 0) {
      setError('Credits must be a positive whole number.');
      return;
    }

    if (!editingSubject && !form.department_id) {
      setError('Please select a department.');
      return;
    }

    setSaving(true);

    try {
      if (editingSubject) {
        const updated = await subjectApi.updateSubject(
          editingSubject.id,
          payload
        );

        setSubjects((previous) =>
          previous
            .map((subject) =>
              subject.id === updated.id ? updated : subject
            )
            .sort((a, b) => a.code.localeCompare(b.code))
        );

        setSuccess('Subject updated successfully.');
      } else {
        const created = await subjectApi.createSubject({
          ...payload,
          department_id: form.department_id,
        });

        setSubjects((previous) =>
          [...previous, created].sort((a, b) =>
            a.code.localeCompare(b.code)
          )
        );

        setSuccess('Subject created successfully.');
      }

      setShowForm(false);
      setEditingSubject(null);
      setForm({ ...emptyForm });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save subject.'
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // DELETE / ARCHIVE SUBJECT
  // --------------------------------------------------

  async function handleDelete(subject: Subject) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${subject.name}" (${subject.code})?\n\n` +
      'If this subject is referenced by curriculum or academic offerings, ' +
      'the backend may archive it instead of permanently deleting it.'
    );

    if (!confirmed) return;

    setDeletingId(subject.id);
    setError('');
    setSuccess('');

    try {
      const result = (await subjectApi.deleteSubject(
        subject.id
      )) as DeleteSubjectResult;

      // Remove the subject from the current active catalogue.
      // Both hard-deleted and archived subjects disappear from this list.
      setSubjects((previous) =>
        previous.filter((item) => item.id !== subject.id)
      );

      setSuccess(
        result?.message ||
          (result?.action === 'archived'
            ? `${subject.code} was archived successfully.`
            : `${subject.code} was deleted successfully.`)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete subject.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  function departmentName(departmentId: string) {
    return (
      departments.find((department) => department.id === departmentId)
        ?.name ?? 'Unknown department'
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl space-y-7 px-6 py-9">

        {/* PAGE HEADER */}

        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
              Administration / Academics
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Subject Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create, edit and manage the institutional subject catalogue.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadData()}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] px-4 py-3 text-sm font-semibold hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
            >
              <RefreshCw
                size={16}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateForm}
              className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              <Plus size={17} />
              Add Subject
            </button>
          </div>
        </header>

        {/* NOTIFICATIONS */}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-600"
          >
            {success}
          </div>
        )}

        {/* STATISTICS */}

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
            <p className="text-sm text-slate-500">Total Subjects</p>
            <p className="mt-2 text-3xl font-bold">
              {loading ? '—' : subjects.length}
            </p>
          </div>
        </section>
        {/* SEARCH AND FILTERS */}

        <section className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search subject name or code..."
                className={`${inputClass} pl-10`}
              />
            </div>

          </div>

          {/* SUBJECT TABLE */}

          <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
            {loading ? (
              <div className="p-12 text-center text-sm text-slate-500">
                Loading subjects...
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="p-12 text-center">
                <h3 className="font-semibold">No subjects found</h3>

                <p className="mt-2 text-sm text-slate-500">
                  Add a subject or change your search filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left text-sm">
                  <thead className="border-b border-[var(--border-color)] bg-black/[0.025] dark:bg-white/[0.025]">
                    <tr className="text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-4">Subject Code</th>
                      <th className="px-5 py-4">Subject Name</th>
                      <th className="px-5 py-4">Department</th>
                      <th className="px-5 py-4">Credits</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSubjects.map((subject) => (
                      <tr
                        key={subject.id}
                        className="border-b border-[var(--border-color)] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-4 font-semibold">
                          {subject.code}
                        </td>

                        <td className="px-5 py-4">
                          {subject.name}
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {departmentName(subject.department_id)}
                        </td>

                        <td className="px-5 py-4">
                          {subject.credits}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(subject)}
                              title="Edit subject"
                              aria-label={`Edit ${subject.name}`}
                              className="rounded-lg border border-[var(--border-color)] p-2 hover:bg-cyan-500/10 hover:text-cyan-600"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleDelete(subject)}
                              disabled={deletingId !== null}
                              title="Delete subject"
                              aria-label={`Delete ${subject.name}`}
                              className="rounded-lg border border-red-500/20 p-2 text-red-600 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === subject.id ? (
                                <RefreshCw
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* CREATE / EDIT MODAL */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="subject-form-title"
            className="w-full max-w-xl rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2
                  id="subject-form-title"
                  className="text-xl font-bold"
                >
                  {editingSubject ? 'Edit Subject' : 'Add Subject'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the subject details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close"
                className="rounded-lg p-2 hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-500/10 p-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              {/* DEPARTMENT */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Department *
                </label>

                <select
                  required
                  disabled={Boolean(editingSubject) || saving}
                  value={form.department_id}
                  onChange={(event) =>
                    updateForm('department_id', event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select department</option>

                  {departments.map((department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name} ({department.code})
                    </option>
                  ))}
                </select>

                {editingSubject && (
                  <p className="mt-1 text-xs text-slate-500">
                    Department cannot be changed through the current update API.
                  </p>
                )}
              </div>

              {/* SUBJECT CODE */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Subject Code *
                </label>

                <input
                  required
                  maxLength={30}
                  disabled={saving}
                  value={form.code}
                  onChange={(event) =>
                    updateForm('code', event.target.value)
                  }
                  placeholder="e.g. BAI701"
                  className={inputClass}
                />
              </div>

              {/* SUBJECT NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Subject Name *
                </label>

                <input
                  required
                  maxLength={150}
                  disabled={saving}
                  value={form.name}
                  onChange={(event) =>
                    updateForm('name', event.target.value)
                  }
                  placeholder="e.g. Deep Learning"
                  className={inputClass}
                />
              </div>

              {/* CREDITS */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Credits *
                </label>

                <input
                  required
                  type="number"
                  min={1}
                  step={1}
                  disabled={saving}
                  value={form.credits}
                  onChange={(event) =>
                    updateForm('credits', Number(event.target.value))
                  }
                  className={inputClass}
                />
              </div>

              {/* FORM ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-color)] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-[var(--border-color)] px-5 py-3 text-sm font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingSubject
                      ? 'Update Subject'
                      : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
