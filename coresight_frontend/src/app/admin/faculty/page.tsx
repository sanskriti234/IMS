
'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/navigation/AdminNavbar';

import {
  Users,
  Plus,
  Mail,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Eye,
} from 'lucide-react';

import {
  facultyApi,
  institutionApi,
  type Faculty,
  type Department,
} from '@/lib/api';

import { FacultyAssignments } from '@/components/admin/FacultyAssignments';

type FacultyTab = 'directory' | 'add' | 'assignments';

interface FacultyForm {
  full_name: string;
  email: string;
  employee_code: string;
  designation: string;
  department_id: string;
}

const initialForm: FacultyForm = {
  full_name: '',
  email: '',
  employee_code: '',
  designation: 'Assistant Professor',
  department_id: '',
};

export default function FacultyPage() {
  const [activeTab, setActiveTab] = useState<FacultyTab>('directory');

  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [form, setForm] = useState<FacultyForm>(initialForm);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const loadFaculty = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await facultyApi.getFaculty();
      setFaculty(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load faculty directory.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDepartments = useCallback(async () => {
    try {
      const data = await institutionApi.getDepartments();

      setDepartments(
        data.filter((department) => department.is_active !== false)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load departments.'
      );
    }
  }, []);

  useEffect(() => {
    void loadFaculty();
    void loadDepartments();
  }, [loadFaculty, loadDepartments]);

  const updateField = (
    field: keyof FacultyForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCreateFaculty = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!form.department_id) {
      setError('Please select a department.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        employee_code: form.employee_code.trim().toUpperCase(),
        designation: form.designation,
        department_id: form.department_id,
      };

      const createdFaculty = await facultyApi.createFaculty(payload);

      setFaculty((previous) => [
        createdFaculty,
        ...previous,
      ]);

      setForm(initialForm);

      setSuccess(
        `Faculty account created successfully for ${createdFaculty.full_name}. Credentials email has been queued for delivery.`
      );

      setActiveTab('directory');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Faculty registration failed.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Faculty search and filtering
  const filteredFaculty = faculty.filter((member) => {
    const query = search.toLowerCase().trim();

    return (
      member.full_name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.employee_code.toLowerCase().includes(query) ||
      member.designation.toLowerCase().includes(query)
    );
  });

  const getDepartmentName = (departmentId: string) => {
    return (
      departments.find(
        (department) => department.id === departmentId
      )?.name ?? 'Department unavailable'
    );
  };

  const inputClass =
    'w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-[#176B52]';

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">

        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-color)] pb-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Department Faculty
            </h1>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage faculty accounts, institutional details and teaching assignments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError('');
              setSuccess('');
              setActiveTab('add');
            }}
            className="flex items-center gap-2 rounded-xl bg-[#176B52] px-4 py-2 text-xs font-medium text-white shadow transition-all hover:bg-[#125440]"
          >
            <Plus className="h-4 w-4" />
            Add Department Faculty
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50 p-4 text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto border-b border-[var(--border-color)]">
          {(
            [
              ['directory', 'Faculty Directory'],
              ['add', 'Add New Faculty'],
              ['assignments', 'Assignments'],
            ] as const
          ).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setError('');
                setSuccess('');
                setActiveTab(tab);
              }}
              className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? 'border-[#176B52] text-[#176B52]'
                  : 'border-transparent text-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Faculty Directory */}
        {activeTab === 'directory' && (
          <section className="space-y-5">

            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Total Faculty</p>
                  <Users className="h-5 w-5 text-[#176B52]" />
                </div>
                <h2 className="mt-2 text-3xl font-bold">
                  {faculty.length}
                </h2>
              </div>

              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Departments Represented
                  </p>
                  <GraduationCap className="h-5 w-5 text-[#176B52]" />
                </div>
                <h2 className="mt-2 text-3xl font-bold">
                  {new Set(
                    faculty.map((item) => item.department_id)
                  ).size}
                </h2>
              </div>
            </div>

            {/* Search and Refresh */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search faculty by name, email or employee code..."
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#176B52]"
                />
              </div>

              <button
                type="button"
                onClick={() => void loadFaculty()}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 text-sm hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>
            </div>

            {/* Faculty Table */}
            {loading ? (
              <div className="py-16 text-center text-sm text-slate-500">
                Loading faculty directory...
              </div>
            ) : filteredFaculty.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border-color)] py-16 text-center">
                <Users className="mx-auto mb-3 h-10 w-10 text-slate-400" />

                <h3 className="font-semibold">
                  No faculty records found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add a faculty member or change your search.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-slate-50 text-xs text-slate-500 dark:bg-slate-900/50">
                      <th className="px-5 py-4">Faculty</th>
                      <th className="px-5 py-4">Employee Code</th>
                      <th className="px-5 py-4">Department</th>
                      <th className="px-5 py-4">Designation</th>
                      <th className="px-5 py-4">Email</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredFaculty.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-[var(--border-color)] last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#176B52]/10 font-bold uppercase text-[#176B52]">
                              {member.full_name.charAt(0)}
                            </div>

                            <span className="font-semibold">
                              {member.full_name}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 font-mono text-xs">
                          {member.employee_code}
                        </td>

                        <td className="px-5 py-4">
                          {getDepartmentName(member.department_id)}
                        </td>

                        <td className="px-5 py-4">
                          {member.designation}
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {member.email}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/faculty/${member.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#176B52] px-3 py-2 text-xs font-semibold text-[#176B52] transition-colors hover:bg-[#176B52] hover:text-white"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Add Faculty */}
        {activeTab === 'add' && (
          <section className="mx-auto max-w-2xl">
            <form
              onSubmit={handleCreateFaculty}
              className="space-y-6 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-7 shadow-sm md:p-8"
            >
              <div>
                <h2 className="font-display text-xl font-bold">
                  Register New Faculty
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Create a faculty account and send login credentials to their institutional email.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  Full Name *
                </label>
                <input
                  required
                  minLength={2}
                  maxLength={255}
                  value={form.full_name}
                  onChange={(event) =>
                    updateField('full_name', event.target.value)
                  }
                  placeholder="Enter faculty full name"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  Institutional Email *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField('email', event.target.value)
                  }
                  placeholder="faculty@institution.edu"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">
                    Employee Code *
                  </label>
                  <input
                    required
                    maxLength={50}
                    value={form.employee_code}
                    onChange={(event) =>
                      updateField('employee_code', event.target.value)
                    }
                    placeholder="e.g. FAC001"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold">
                    Designation *
                  </label>
                  <select
                    required
                    value={form.designation}
                    onChange={(event) =>
                      updateField('designation', event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Professor">Professor</option>
                    <option value="Head of Department">Head of Department</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  Department *
                </label>
                <select
                  required
                  value={form.department_id}
                  onChange={(event) =>
                    updateField('department_id', event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select department</option>

                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.code})
                    </option>
                  ))}
                </select>

                {departments.length === 0 && (
                  <p className="text-xs text-rose-500">
                    No departments available. Check the institution API.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-[#176B52]" />

                  <div>
                    <p className="text-sm font-semibold text-[#176B52] dark:text-emerald-300">
                      Automatic Login Credentials
                    </p>

                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      CoreSight will generate a temporary password, create the faculty login account and send the credentials to the registered email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setForm(initialForm);
                    setError('');
                  }}
                  disabled={submitting}
                  className="flex-1 rounded-xl border border-[var(--border-color)] py-3 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
                >
                  Reset Form
                </button>

                <button
                  type="submit"
                  disabled={submitting || departments.length === 0}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#176B52] py-3 font-semibold text-white transition-colors hover:bg-[#125440] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Faculty Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Assignments */}
        {activeTab === 'assignments' && (
          <FacultyAssignments />
        )}

      </main>
    </div>
  );
}
