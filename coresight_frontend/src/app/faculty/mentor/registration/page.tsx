
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  ExternalLink,
  FileText,
  GraduationCap,
  Link2,
  RefreshCw,
  Search,
  Users,
  AlertCircle,
  Clock3,
} from "lucide-react";

import {
  assignedMentees,
  facultyStudents,
  registrationSubmissions,
  teachingOfferings,
} from "@/data/faculty-mock-data";

import type { RegistrationStatus } from "@/types/faculty";

const academicScopes = Array.from(
  new Map(
    teachingOfferings.map((offering) => {
      const key = `${offering.academicSession}::${offering.batch}::${offering.section}`;

      return [
        key,
        {
          key,
          academicSession: offering.academicSession,
          batch: offering.batch,
          section: offering.section,
        },
      ];
    })
  ).values()
);

const statusStyles: Record<RegistrationStatus, string> = {
  pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  registered:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  failed:
    "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  requires_correction:
    "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
};

const statusLabels: Record<RegistrationStatus, string> = {
  pending: "Pending",
  registered: "Registered",
  failed: "Failed",
  requires_correction: "Correction Required",
};

export default function MentorRegistrationPage() {
  const [selectedScopeKey, setSelectedScopeKey] = useState(
    academicScopes[0]?.key ?? ""
  );

  const [generatedLink, setGeneratedLink] = useState("");
  const [generatedScopeKey, setGeneratedScopeKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [lastSyncTime, setLastSyncTime] = useState("");

  const selectedScope = academicScopes.find(
    (scope) => scope.key === selectedScopeKey
  );

  const scopedStudents = useMemo(() => {
    if (!selectedScope) return [];

    return facultyStudents.filter(
      (student) =>
        student.academicSession === selectedScope.academicSession &&
        student.batch === selectedScope.batch &&
        student.section === selectedScope.section &&
        student.status === "active"
    );
  }, [selectedScope]);

  const generatedScope = academicScopes.find(
    (scope) => scope.key === generatedScopeKey
  );

  const scopedSubmissions = useMemo(() => {
    if (!selectedScope) return [];

    return registrationSubmissions.filter(
      (submission) =>
        submission.batch === selectedScope.batch &&
        submission.section === selectedScope.section
    );
  }, [selectedScope]);

  const filteredSubmissions = scopedSubmissions.filter((submission) => {
    const query = search.toLowerCase();

    return (
      submission.studentName.toLowerCase().includes(query) ||
      (submission.enrollmentNumber ?? "").toLowerCase().includes(query)
    );
  });

  const submissionCounts = {
    total: scopedSubmissions.length,
    registered: scopedSubmissions.filter(
      (item) => item.status === "registered"
    ).length,
    pending: scopedSubmissions.filter(
      (item) => item.status === "pending"
    ).length,
    issues: scopedSubmissions.filter(
      (item) =>
        item.status === "failed" ||
        item.status === "requires_correction"
    ).length,
  };

  const handleGenerateForm = () => {
    if (!selectedScope) return;

    const token = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const demoLink = `coresight-demo://registration/${token}`;

    setGeneratedLink(demoLink);
    setGeneratedScopeKey(selectedScope.key);
    setCopied(false);
    setSyncMessage("");
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
    } catch {
      setCopied(false);
      setSyncMessage(
        "Clipboard access is unavailable. Select and copy the displayed link manually."
      );
    }
  };

  const handleSimulateSync = () => {
    setLastSyncTime(new Date().toLocaleString("en-IN"));
    setSyncMessage(
      "Demo sync completed. No external Google Form responses were fetched or modified."
    );
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-8 text-[var(--text-main)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div>
          <Link
            href="/faculty/mentor/dashboard"
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#176B52] dark:hover:text-[#81D3AD]"
          >
            <ArrowLeft size={16} />
            Mentor Dashboard
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#176B52] dark:text-[#81D3AD]">
            Mentor Workspace
          </p>

          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Student Registration
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Generate registration forms for a specific academic session,
            batch and section. Share the form with students and monitor
            registration progress.
          </p>
        </div>

        {/* Workflow explanation */}
        <div className="grid gap-3 md:grid-cols-3">
          <WorkflowStep
            number="01"
            title="Select Academic Scope"
            description="Choose the session, batch and section."
          />
          <WorkflowStep
            number="02"
            title="Generate & Share"
            description="Create a form for the selected student group."
          />
          <WorkflowStep
            number="03"
            title="Monitor Responses"
            description="Review submissions and registration issues."
          />
        </div>

        {/* Academic scope */}
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]">
              <GraduationCap size={21} />
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold">
                Academic Scope
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select the group for which registration is required.
              </p>
            </div>
          </div>

          {academicScopes.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-[var(--border-color)] p-6 text-center">
              <AlertCircle className="mx-auto text-slate-400" size={25} />
              <p className="mt-2 text-sm text-slate-500">
                No academic scopes are available in the mock data.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <ScopeField
                  label="Academic Session"
                  value={selectedScopeKey}
                  options={academicScopes.map((scope) => ({
                    value: scope.key,
                    label: scope.academicSession,
                  }))}
                  onChange={setSelectedScopeKey}
                />

                <ScopeField
                  label="Batch"
                  value={selectedScopeKey}
                  options={academicScopes
                    .filter(
                      (scope) =>
                        scope.academicSession ===
                        selectedScope?.academicSession
                    )
                    .map((scope) => ({
                      value: scope.key,
                      label: scope.batch,
                    }))
                    .filter(
                      (option, index, array) =>
                        array.findIndex(
                          (item) => item.label === option.label
                        ) === index
                    )}
                  onChange={setSelectedScopeKey}
                />

                <ScopeField
                  label="Section"
                  value={selectedScopeKey}
                  options={academicScopes
                    .filter(
                      (scope) =>
                        scope.academicSession ===
                          selectedScope?.academicSession &&
                        scope.batch === selectedScope?.batch
                    )
                    .map((scope) => ({
                      value: scope.key,
                      label: scope.section,
                    }))}
                  onChange={setSelectedScopeKey}
                />
              </div>

              <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl bg-[var(--bg-main)] p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <Users
                    size={21}
                    className="text-[#176B52] dark:text-[#81D3AD]"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {scopedStudents.length} active students found
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Based on the selected academic scope.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateForm}
                  disabled={!selectedScope || scopedStudents.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125440] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#81D3AD] dark:text-[#10231C]"
                >
                  <FileText size={17} />
                  Generate Registration Form
                </button>
              </div>
            </>
          )}
        </section>

        {/* Generated form */}
        {generatedLink && generatedScope && (
          <section className="overflow-hidden rounded-2xl border border-emerald-300 bg-[var(--card-bg)] dark:border-emerald-900">
            <div className="flex flex-col justify-between gap-3 bg-emerald-50/70 p-5 dark:bg-emerald-950/30 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-2.5 text-emerald-700 dark:bg-[#162622] dark:text-[#81D3AD]">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h2 className="font-semibold">Form generated</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Registration form prepared for the selected group.
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                Prototype
              </span>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <ScopeSummary
                  label="Academic Session"
                  value={generatedScope.academicSession}
                />
                <ScopeSummary
                  label="Batch"
                  value={generatedScope.batch}
                />
                <ScopeSummary
                  label="Section"
                  value={generatedScope.section}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Generated Demo Link
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    readOnly
                    value={generatedLink}
                    className="min-w-0 flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm"
                  />

                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125440] dark:bg-[#81D3AD] dark:text-[#10231C]"
                  >
                    {copied ? (
                      <ClipboardCheck size={17} />
                    ) : (
                      <Clipboard size={17} />
                    )}
                    {copied ? "Copied" : "Copy Link"}
                  </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-amber-700 dark:text-amber-300">
                  This is a simulated CoreSight demo link, not a live Google
                  Form URL. Actual Google Forms creation and email sharing
                  require backend integration.
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border-color)] p-4">
                <h3 className="text-sm font-semibold">
                  Intended Recipients
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {generatedScope.batch} · Section {generatedScope.section}
                  {" · "}
                  {scopedStudents.length} active students
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {scopedStudents.map((student) => (
                    <span
                      key={student.id}
                      className="rounded-lg bg-[var(--bg-main)] px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300"
                    >
                      {student.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Submission monitoring */}
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Registration Monitoring
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Track student submissions for the currently selected batch
                and section.
              </p>
            </div>

            <button
              onClick={handleSimulateSync}
              disabled={!selectedScope}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--bg-main)] disabled:opacity-40"
            >
              <RefreshCw size={16} />
              Simulate Response Sync
            </button>
          </div>

          {syncMessage && (
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 text-sm">
              <p>{syncMessage}</p>
              {lastSyncTime && (
                <p className="mt-1 text-xs text-slate-500">
                  Simulated sync time: {lastSyncTime}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Submissions"
              value={submissionCounts.total}
              icon={FileText}
            />
            <SummaryCard
              label="Registered"
              value={submissionCounts.registered}
              icon={CheckCircle2}
            />
            <SummaryCard
              label="Pending"
              value={submissionCounts.pending}
              icon={Clock3}
            />
            <SummaryCard
              label="Needs Attention"
              value={submissionCounts.issues}
              icon={AlertCircle}
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
            <div className="flex flex-col justify-between gap-3 border-b border-[var(--border-color)] p-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-semibold">Student Submissions</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Mock registration response records.
                </p>
              </div>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search student..."
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#176B52] sm:w-64 dark:focus:border-[#81D3AD]"
                />
              </div>
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <FileText
                  size={30}
                  className="mx-auto text-slate-400"
                />
                <p className="mt-3 font-medium">
                  No submission records found
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  There are no matching mock submissions for this scope.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--bg-main)] text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Student</th>
                        <th className="px-5 py-4 font-semibold">
                          Enrollment
                        </th>
                        <th className="px-5 py-4 font-semibold">
                          Submitted At
                        </th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredSubmissions.map((submission) => (
                        <tr
                          key={submission.id}
                          className="border-t border-[var(--border-color)]"
                        >
                          <td className="px-5 py-4 font-medium">
                            {submission.studentName}
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {submission.enrollmentNumber ?? "—"}
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {formatDate(submission.submittedAt)}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={submission.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="divide-y divide-[var(--border-color)] md:hidden">
                  {filteredSubmissions.map((submission) => (
                    <div key={submission.id} className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {submission.studentName}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {submission.enrollmentNumber ?? "Enrollment unavailable"}
                          </p>
                        </div>
                        <StatusBadge status={submission.status} />
                      </div>
                      <p className="text-xs text-slate-500">
                        Submitted: {formatDate(submission.submittedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Integration note */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-50 p-2 text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]">
              <Link2 size={19} />
            </div>
            <div>
              <h3 className="font-semibold">Google Forms integration</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                The production workflow will create a Google Form for the
                selected academic scope, share its real URL with the relevant
                students, fetch submitted responses and synchronize valid
                registrations into the student database. Response fetching
                and synchronization must remain separate from form generation.
                These operations are represented by mock data in this
                frontend prototype.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
      <p className="text-xs font-bold tracking-widest text-[#176B52] dark:text-[#81D3AD]">
        STEP {number}
      </p>
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
    </div>
  );
}

function ScopeField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ScopeSummary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[var(--bg-main)] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="rounded-xl bg-emerald-50 p-2 text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: RegistrationStatus }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
