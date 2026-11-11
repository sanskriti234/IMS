
"use client";

import Link from "next/link";
import {
  Users,
  UserRoundCheck,
  AlertTriangle,
  CalendarCheck,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  TrendingUp,
} from "lucide-react";

import {
  facultyProfile,
  assignedMentees,
  mentorshipRecords,
  mentorshipFollowUps,
  registrationSubmissions,
} from "@/data/faculty-mock-data";

export default function MentorDashboardPage() {
  const totalMentees = assignedMentees.length;

  const studentsNeedingAttention = assignedMentees.filter(
    (mentee) => mentee.academicStatus === "needs_attention"
  );

  const averageAttendance =
    totalMentees > 0
      ? Math.round(
          assignedMentees.reduce(
            (total, mentee) => total + mentee.attendancePercentage,
            0
          ) / totalMentees
        )
      : 0;

  const pendingFollowUps = mentorshipFollowUps.filter(
    (item) => item.status === "pending"
  );

  const overdueFollowUps = mentorshipFollowUps.filter(
    (item) => item.status === "overdue"
  );

  const completedFollowUps = mentorshipFollowUps.filter(
    (item) => item.status === "completed"
  );

  const pendingRegistrations = registrationSubmissions.filter(
    (item) => item.status === "pending"
  );

  const registeredStudents = registrationSubmissions.filter(
    (item) => item.status === "registered"
  );

  const failedRegistrations = registrationSubmissions.filter(
    (item) =>
      item.status === "failed" ||
      item.status === "requires_correction"
  );

  const recentRecords = [...mentorshipRecords]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  function getMenteeName(menteeId: string) {
    return (
      assignedMentees.find((mentee) => mentee.id === menteeId)?.name ??
      "Unknown Student"
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-9">

      {/* Header */}
      <section className="pb-7 border-b border-[var(--border-color)]">
        <p className="text-xs font-bold uppercase tracking-widest text-[#176B52] dark:text-[#81D3AD] mb-2">
          Mentor Workspace
        </p>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Mentor Dashboard
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3">
              Monitor your assigned mentees, academic performance and
              student registration activities.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[#176B52] dark:text-[#81D3AD] font-bold">
              {facultyProfile.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </div>

            <div>
              <p className="text-sm font-semibold">{facultyProfile.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {facultyProfile.designation}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Assigned Mentees"
          value={totalMentees}
          description="Students under your mentorship"
          icon={Users}
          color="green"
        />

        <StatCard
          title="Need Attention"
          value={studentsNeedingAttention.length}
          description="Students requiring monitoring"
          icon={AlertTriangle}
          color="amber"
        />

        <StatCard
          title="Average Attendance"
          value={`${averageAttendance}%`}
          description="Across assigned mentees"
          icon={TrendingUp}
          color="blue"
        />

        <StatCard
          title="Pending Follow-ups"
          value={pendingFollowUps.length + overdueFollowUps.length}
          description={`${overdueFollowUps.length} overdue`}
          icon={CalendarCheck}
          color="purple"
        />
      </section>

      {/* Main Dashboard Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Mentee Overview */}
        <div className="xl:col-span-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">
                Mentee Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Academic and attendance monitoring
              </p>
            </div>

            <Link
              href="/faculty/mentor/mentees"
              className="text-sm font-semibold text-[#176B52] dark:text-[#81D3AD] inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {assignedMentees.map((mentee) => (
              <div
                key={mentee.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[#176B52] dark:text-[#81D3AD] font-bold">
                    {mentee.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div>
                    <p className="font-semibold text-sm">{mentee.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {mentee.enrollmentNumber}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {mentee.batch} · Section {mentee.section}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="min-w-24">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500 dark:text-slate-400">
                        Attendance
                      </span>
                      <span className="font-bold">
                        {mentee.attendancePercentage}%
                      </span>
                    </div>

                    <div className="h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
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
                  </div>

                  <AttentionBadge level={mentee.attentionLevel} />
                </div>
              </div>
            ))}

            {assignedMentees.length === 0 && (
              <EmptyState message="No mentees have been assigned yet." />
            )}
          </div>
        </div>

        {/* Attention Required */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={18}
                className="text-amber-600 dark:text-amber-400"
              />
              <h2 className="font-display text-xl font-bold">
                Attention Required
              </h2>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Students flagged for monitoring
            </p>
          </div>

          <div className="p-5 space-y-4">
            {studentsNeedingAttention.length === 0 ? (
              <EmptyState message="No students currently require attention." />
            ) : (
              studentsNeedingAttention.map((mentee) => (
                <div
                  key={mentee.id}
                  className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30"
                >
                  <p className="font-semibold text-sm text-amber-900 dark:text-amber-200">
                    {mentee.name}
                  </p>

                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                    Attendance: {mentee.attendancePercentage}%
                  </p>

                  {mentee.concerns.slice(0, 2).map((concern, index) => (
                    <p
                      key={index}
                      className="text-xs text-amber-800 dark:text-amber-300 mt-2"
                    >
                      • {concern}
                    </p>
                  ))}

                  <Link
                    href="/faculty/mentor/mentees"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 dark:text-amber-200 mt-3 hover:underline"
                  >
                    Review Mentee
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Follow-ups and Registration */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Follow-up Summary */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">
                Mentorship Follow-ups
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Track pending and completed actions
              </p>
            </div>

            <Link
              href="/faculty/mentor/follow-ups"
              className="text-sm font-semibold text-[#176B52] dark:text-[#81D3AD] inline-flex items-center gap-1"
            >
              Manage
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[var(--border-color)]">
            <MiniMetric
              value={pendingFollowUps.length}
              label="Pending"
              color="text-amber-600 dark:text-amber-400"
            />
            <MiniMetric
              value={overdueFollowUps.length}
              label="Overdue"
              color="text-red-600 dark:text-red-400"
            />
            <MiniMetric
              value={completedFollowUps.length}
              label="Completed"
              color="text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div className="p-5 space-y-3">
            {[...overdueFollowUps, ...pendingFollowUps].slice(0, 4).map(
              (followUp) => (
                <div
                  key={followUp.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[var(--bg-main)]"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {followUp.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {getMenteeName(followUp.menteeId)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Due: {followUp.dueDate}
                    </p>
                  </div>

                  <FollowUpBadge status={followUp.status} />
                </div>
              )
            )}

            {pendingFollowUps.length + overdueFollowUps.length === 0 && (
              <EmptyState message="No pending follow-ups." />
            )}
          </div>
        </div>

        {/* Registration Summary */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">
                Student Registration
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Google Forms registration overview
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
              <UserPlus size={20} />
            </div>
          </div>

          <div className="p-5 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <RegistrationMetric
                value={registeredStudents.length}
                label="Registered"
                color="text-emerald-600 dark:text-emerald-400"
              />

              <RegistrationMetric
                value={pendingRegistrations.length}
                label="Pending"
                color="text-amber-600 dark:text-amber-400"
              />

              <RegistrationMetric
                value={failedRegistrations.length}
                label="Issues"
                color="text-red-600 dark:text-red-400"
              />
            </div>

            <div className="rounded-xl border border-[var(--border-color)] p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
                  <ClipboardList size={19} />
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    Google Form Management
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Generate a registration form for a specific academic
                    session, batch and section, then share its link with
                    the respective students.
                  </p>
                </div>
              </div>

              <Link
                href="/faculty/mentor/registration"
                className="mt-4 w-full rounded-xl bg-[#176B52] dark:bg-[#81D3AD] text-white dark:text-[#101B19] py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                Manage Student Registration
                <ArrowRight size={16} />
              </Link>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Registration figures are based on the current demonstration
              data.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Mentorship Activity */}
      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">
              Recent Mentorship Activity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Latest recorded student interactions
            </p>
          </div>

          <Link
            href="/faculty/mentor/records"
            className="text-sm font-semibold text-[#176B52] dark:text-[#81D3AD] inline-flex items-center gap-1"
          >
            View Records
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="divide-y divide-[var(--border-color)]">
          {recentRecords.map((record) => (
            <div
              key={record.id}
              className="p-5 flex items-start gap-4"
            >
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                <BookOpen size={19} />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="font-semibold text-sm">
                    {getMenteeName(record.menteeId)}
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {record.date}
                  </span>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  {record.discussionSummary}
                </p>

                {record.concern && (
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                    Concern: {record.concern}
                  </p>
                )}
              </div>
            </div>
          ))}

          {recentRecords.length === 0 && (
            <EmptyState message="No mentorship records available yet." />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <p>CoreSight · Mentor Workspace</p>
        <p>Academic Management System</p>
      </footer>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  color: "green" | "amber" | "blue" | "purple";
}) {
  const styles = {
    green:
      "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    amber:
      "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    blue:
      "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    purple:
      "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="font-display text-3xl font-bold mt-2">{value}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {description}
          </p>
        </div>

        <div className={`p-3 rounded-xl ${styles[color]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function MiniMetric({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center py-4">
      <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        {label}
      </p>
    </div>
  );
}

function RegistrationMetric({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-[var(--bg-main)] p-3 text-center">
      <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        {label}
      </p>
    </div>
  );
}

function AttentionBadge({
  level,
}: {
  level: "normal" | "medium" | "high";
}) {
  const styles = {
    normal:
      "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    medium:
      "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    high:
      "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${styles[level]}`}
    >
      {level}
    </span>
  );
}

function FollowUpBadge({
  status,
}: {
  status: "pending" | "completed" | "overdue";
}) {
  const styles = {
    pending:
      "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    completed:
      "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    overdue:
      "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-8 text-center">
      <AlertCircle
        size={25}
        className="mx-auto text-slate-400 mb-2"
      />
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}
