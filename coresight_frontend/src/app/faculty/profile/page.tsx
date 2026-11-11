
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import {
  facultyAssignment,
  facultyProfile,
  teachingOfferings,
  assignedMentees,
} from "@/data/faculty-mock-data";

export default function FacultyProfilePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-8 text-[var(--text-main)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-7">
        <div>
          <Link
            href="/faculty/teaching/dashboard"
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#176B52] dark:hover:text-[#81D3AD]"
          >
            <ArrowLeft size={16} />
            Back to Workspace
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#176B52] dark:text-[#81D3AD]">
            Account
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Faculty Profile
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            View your faculty information and current workspace assignments.
          </p>
        </div>

        {/* Profile card */}
        <section className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
          <div className="h-28 bg-gradient-to-r from-[#176B52] to-[#399775] dark:from-[#173F32] dark:to-[#27684F]" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-[var(--card-bg)] bg-emerald-50 text-[#176B52] dark:bg-emerald-950 dark:text-[#81D3AD]">
                {facultyProfile.avatar ? (
                  <img
                    src={facultyProfile.avatar}
                    alt={facultyProfile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={42} />
                )}
              </div>

              <div className="flex-1 pb-1">
                <h2 className="font-display text-2xl font-semibold">
                  {facultyProfile.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {facultyProfile.designation}
                </p>
              </div>

              <span className="mb-1 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <ShieldCheck size={14} />
                Faculty Account
              </span>
            </div>

            <div className="mt-7 grid gap-5 border-t border-[var(--border-color)] pt-6 sm:grid-cols-2">
              <ProfileField
                icon={Mail}
                label="Email Address"
                value={facultyProfile.email}
              />
              <ProfileField
                icon={UserRound}
                label="Employee ID"
                value={facultyProfile.employeeId}
              />
              <ProfileField
                icon={GraduationCap}
                label="Department"
                value={facultyProfile.department}
              />
              <ProfileField
                icon={BookOpen}
                label="Designation"
                value={facultyProfile.designation}
              />
            </div>
          </div>
        </section>

        {/* Workspace assignments */}
        <section>
          <div className="mb-4">
            <h2 className="font-display text-xl font-semibold">
              Workspace Assignments
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your active responsibilities in CoreSight.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AssignmentCard
              title="Teaching Faculty"
              description="Manage assigned subjects, students and attendance."
              active={facultyAssignment.teachingActive}
              icon={BookOpen}
              count={`${teachingOfferings.length} assigned subjects`}
              href="/faculty/teaching/dashboard"
            />

            <AssignmentCard
              title="Mentor"
              description="Monitor mentees, maintain mentorship records and manage student registration."
              active={facultyAssignment.mentorshipActive}
              icon={Users}
              count={`${assignedMentees.length} assigned mentees`}
              href="/faculty/mentor/dashboard"
            />
          </div>
        </section>

        {/* Account information */}
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={21}
              className="mt-0.5 text-[#176B52] dark:text-[#81D3AD]"
            />
            <div>
              <h3 className="font-semibold">Account and permissions</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Your available workspaces depend on the assignments activated
                by the administrator. Teaching and mentorship responsibilities
                are independent. This prototype displays mock account
                information and does not support editing faculty details.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-[var(--bg-main)] p-2.5 text-[#176B52] dark:text-[#81D3AD]">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function AssignmentCard({
  title,
  description,
  active,
  icon: Icon,
  count,
  href,
}: {
  title: string;
  description: string;
  active: boolean;
  icon: React.ElementType;
  count: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]">
          <Icon size={22} />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            active
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

      <p className="mt-4 text-xs font-medium text-slate-500">{count}</p>

      {active && (
        <Link
          href={href}
          className="mt-5 inline-flex items-center rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold transition hover:border-[#176B52] hover:text-[#176B52] dark:hover:border-[#81D3AD] dark:hover:text-[#81D3AD]"
        >
          Open Workspace
        </Link>
      )}
    </div>
  );
}
