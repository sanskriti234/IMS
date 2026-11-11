
"use client";

import Link from "next/link";
import { Suspense, type ElementType } from "react";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  UserRound,
  Mail,
  GraduationCap,
  BookOpen,
  CalendarDays,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MessageSquare,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import {
  assignedMentees,
  mentorshipRecords,
  mentorshipFollowUps,
} from "@/data/faculty-mock-data";

import type {
  AttentionLevel,
  FollowUpStatus,
} from "@/types/faculty";

// --------------------------------------------------
// MAIN CONTENT
// --------------------------------------------------

function MenteeProfileContent() {
  const params = useParams<{ menteeId: string }>();
  const menteeId = params.menteeId;

  const mentee = assignedMentees.find(
    (student) => student.id === menteeId
  );

  if (!mentee) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          <AlertCircle size={30} />
        </div>

        <h1 className="font-display text-2xl font-bold">
          Mentee Not Found
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          This student is not present in your assigned mentee list.
        </p>

        <Link
          href="/faculty/mentor/mentees"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#176B52] dark:text-[#81D3AD]"
        >
          <ArrowLeft size={16} />
          Back to Mentees
        </Link>
      </div>
    );
  }

  const studentRecords = mentorshipRecords
    .filter((record) => record.menteeId === mentee.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const studentFollowUps = mentorshipFollowUps
    .filter((item) => item.menteeId === mentee.id)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const pendingFollowUps = studentFollowUps.filter(
    (item) => item.status === "pending"
  );

  const overdueFollowUps = studentFollowUps.filter(
    (item) => item.status === "overdue"
  );

  const completedFollowUps = studentFollowUps.filter(
    (item) => item.status === "completed"
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">

      {/* NAVIGATION */}
      <Link
        href="/faculty/mentor/mentees"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#176B52] dark:text-slate-400 dark:hover:text-[#81D3AD]"
      >
        <ArrowLeft size={17} />
        Back to Mentee Management
      </Link>

      {/* PROFILE HEADER */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-[#176B52] dark:bg-emerald-950 dark:text-[#81D3AD] sm:h-20 sm:w-20">
              <span className="font-display text-2xl font-bold">
                {mentee.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#176B52] dark:text-[#81D3AD]">
                Mentee Profile
              </p>

              <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                {mentee.name}
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {mentee.enrollmentNumber}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <AcademicStatusBadge status={mentee.academicStatus} />
                <AttentionBadge level={mentee.attentionLevel} />
              </div>
            </div>
          </div>

          <a
            href={`mailto:${mentee.email}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B52] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-[#81D3AD] dark:text-[#101B19]"
          >
            <Mail size={16} />
            Contact Student
          </a>
        </div>
      </section>

      {/* ACADEMIC INFORMATION AND ATTENDANCE */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <UserRound
              size={19}
              className="text-[#176B52] dark:text-[#81D3AD]"
            />
            <h2 className="font-display text-xl font-bold">
              Academic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InfoItem
              icon={Mail}
              label="Email Address"
              value={mentee.email}
            />

            <InfoItem
              icon={GraduationCap}
              label="Department"
              value={mentee.department}
            />

            <InfoItem
              icon={CalendarDays}
              label="Academic Session"
              value={mentee.academicSession}
            />

            <InfoItem
              icon={BookOpen}
              label="Batch"
              value={mentee.batch}
            />

            <InfoItem
              icon={UserRound}
              label="Section"
              value={mentee.section}
            />

            <InfoItem
              icon={GraduationCap}
              label="Semester"
              value={`Semester ${mentee.semester}`}
            />
          </div>
        </div>

        {/* ATTENDANCE OVERVIEW */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp
              size={19}
              className="text-[#176B52] dark:text-[#81D3AD]"
            />

            <h2 className="font-display text-xl font-bold">
              Attendance
            </h2>
          </div>

          <div className="py-4 text-center">
            <p
              className={`font-display text-5xl font-bold ${
                mentee.attendancePercentage >= 75
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {mentee.attendancePercentage}%
            </p>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Overall attendance
            </p>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-full rounded-full ${
                mentee.attendancePercentage >= 75
                  ? "bg-emerald-600"
                  : "bg-amber-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, mentee.attendancePercentage)
                )}%`,
              }}
            />
          </div>

          <div className="mt-5 rounded-xl bg-[var(--bg-main)] p-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Attendance monitoring
            </p>

            <p className="mt-1 text-sm font-semibold">
              {mentee.attendancePercentage >= 75
                ? "Attendance is currently satisfactory"
                : "Attendance requires monitoring"}
            </p>
          </div>

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Attendance is read-only in the Mentor Workspace.
          </p>
        </div>
      </section>

      {/* SUBJECT-WISE ATTENDANCE */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
        <div className="border-b border-[var(--border-color)] p-6">
          <h2 className="font-display text-xl font-bold">
            Subject-wise Attendance
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Attendance performance across assigned subjects.
          </p>
        </div>

        {mentee.subjectAttendance.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No subject attendance information available.
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-12 gap-4 bg-[var(--bg-main)] px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 md:grid">
              <div className="col-span-4">Subject</div>
              <div className="col-span-2 text-center">Conducted</div>
              <div className="col-span-2 text-center">Attended</div>
              <div className="col-span-4">Attendance</div>
            </div>

            <div className="divide-y divide-[var(--border-color)]">
              {mentee.subjectAttendance.map((subject) => (
                <div
                  key={subject.subjectCode}
                  className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-12"
                >
                  <div className="md:col-span-4">
                    <p className="text-sm font-semibold">
                      {subject.subjectName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {subject.subjectCode}
                    </p>
                  </div>

                  <div className="md:col-span-2 md:text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 md:hidden">
                      Classes Conducted
                    </p>

                    <p className="text-sm font-semibold">
                      {subject.conducted}
                    </p>
                  </div>

                  <div className="md:col-span-2 md:text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 md:hidden">
                      Classes Attended
                    </p>

                    <p className="text-sm font-semibold">
                      {subject.attended}
                    </p>
                  </div>

                  <div className="md:col-span-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Attendance percentage
                      </span>

                      <span
                        className={`text-sm font-bold ${
                          subject.percentage >= 75
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {subject.percentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className={`h-full rounded-full ${
                          subject.percentage >= 75
                            ? "bg-emerald-600"
                            : "bg-amber-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, subject.percentage)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* STUDENT CONCERNS */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
        <div className="mb-5 flex items-center gap-2">
          <AlertTriangle
            size={19}
            className="text-amber-600 dark:text-amber-400"
          />

          <h2 className="font-display text-xl font-bold">
            Student Concerns
          </h2>
        </div>

        {mentee.concerns.length === 0 ? (
          <div className="rounded-xl bg-[var(--bg-main)] p-5 text-sm text-slate-500 dark:text-slate-400">
            No concerns have been recorded for this student.
          </div>
        ) : (
          <div className="space-y-3">
            {mentee.concerns.map((concern, index) => (
              <div
                key={`${mentee.id}-concern-${index}`}
                className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
              >
                <AlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300"
                />

                <p className="text-sm text-amber-900 dark:text-amber-200">
                  {concern}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MENTORSHIP HISTORY */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
        <div className="flex flex-col justify-between gap-3 border-b border-[var(--border-color)] p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-xl font-bold">
              Mentorship History
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Previous discussions and guidance provided.
            </p>
          </div>

          <Link
            href="/faculty/mentor/records"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#176B52] dark:text-[#81D3AD]"
          >
            View All Records
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="p-6">
          {studentRecords.length === 0 ? (
            <EmptyState message="No mentorship interactions have been recorded yet." />
          ) : (
            <div className="space-y-6">
              {studentRecords.map((record) => (
                <div
                  key={record.id}
                  className="relative border-l-2 border-[var(--border-color)] pl-8"
                >
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-[var(--card-bg)] bg-[#176B52] dark:bg-[#81D3AD]" />

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold">
                      Mentorship Discussion
                    </p>

                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {record.date}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {record.discussionSummary}
                  </p>

                  {record.concern && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Concern Discussed
                      </p>

                      <p className="mt-1 text-sm">
                        {record.concern}
                      </p>
                    </div>
                  )}

                  {record.recommendation && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Recommendation
                      </p>

                      <p className="mt-1 text-sm">
                        {record.recommendation}
                      </p>
                    </div>
                  )}

                  {record.followUpDate && (
                    <p className="mt-3 inline-flex items-center gap-2 text-xs text-[#176B52] dark:text-[#81D3AD]">
                      <CalendarDays size={14} />
                      Follow-up date: {record.followUpDate}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOLLOW-UP TASKS */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
        <div className="border-b border-[var(--border-color)] p-6">
          <h2 className="font-display text-xl font-bold">
            Follow-up Tasks
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Action items associated with this mentee.
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-[var(--border-color)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <FollowUpMetric
            label="Pending"
            value={pendingFollowUps.length}
            color="amber"
          />

          <FollowUpMetric
            label="Overdue"
            value={overdueFollowUps.length}
            color="red"
          />

          <FollowUpMetric
            label="Completed"
            value={completedFollowUps.length}
            color="green"
          />
        </div>

        <div className="border-t border-[var(--border-color)] p-6">
          {studentFollowUps.length === 0 ? (
            <EmptyState message="No follow-up tasks have been created for this student." />
          ) : (
            <div className="space-y-3">
              {studentFollowUps.map((followUp) => (
                <div
                  key={followUp.id}
                  className="flex flex-col justify-between gap-3 rounded-xl bg-[var(--bg-main)] p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-[var(--card-bg)] p-2 text-[#176B52] dark:text-[#81D3AD]">
                      <ClipboardList size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {followUp.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Due date: {followUp.dueDate}
                      </p>
                    </div>
                  </div>

                  <FollowUpBadge status={followUp.status} />
                </div>
              ))}
            </div>
          )}

          <Link
            href="/faculty/mentor/follow-ups"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#176B52] dark:text-[#81D3AD]"
          >
            Manage All Follow-ups
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col justify-between gap-2 border-t border-[var(--border-color)] pt-6 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
        <p>CoreSight · Mentor Workspace</p>
        <p>Academic Management System</p>
      </footer>
    </div>
  );
}

// --------------------------------------------------
// REUSABLE COMPONENTS
// --------------------------------------------------

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-[var(--bg-main)] p-2 text-[#176B52] dark:text-[#81D3AD]">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}

function AcademicStatusBadge({
  status,
}: {
  status: "good" | "needs_attention";
}) {
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        status === "good"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
      }`}
    >
      {status === "good" ? "Good Standing" : "Needs Attention"}
    </span>
  );
}

function AttentionBadge({
  level,
}: {
  level: AttentionLevel;
}) {
  const styles: Record<AttentionLevel, string> = {
    normal:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    medium:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    high:
      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${styles[level]}`}
    >
      {level} attention
    </span>
  );
}

function FollowUpBadge({
  status,
}: {
  status: FollowUpStatus;
}) {
  const styles: Record<FollowUpStatus, string> = {
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    completed:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    overdue:
      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  const icons: Record<FollowUpStatus, ElementType> = {
    pending: Clock3,
    completed: CheckCircle2,
    overdue: AlertTriangle,
  };

  const Icon = icons[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${styles[status]}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

function FollowUpMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "amber" | "red" | "green";
}) {
  const styles = {
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
    green: "text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="p-5 text-center">
      <p className={`font-display text-3xl font-bold ${styles[color]}`}>
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-8 text-center">
      <MessageSquare
        size={26}
        className="mx-auto mb-3 text-slate-400"
      />

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}

// --------------------------------------------------
// PAGE EXPORT WITH SUSPENSE
// --------------------------------------------------

export default function MenteeProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-main)] px-4 py-10">
          <div className="mx-auto max-w-7xl animate-pulse space-y-5">
            <div className="h-8 w-56 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      }
    >
      <MenteeProfileContent />
    </Suspense>
  );
}
