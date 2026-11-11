
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  ScanFace,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  studentProfile,
  studentTimetable,
  studentAttendanceSummary,
  studentPendingActions,
} from "@/data/student-mock-data";

const quickLinks = [
  {
    title: "My Subjects",
    description: "View enrolled subjects and faculty details",
    href: "/student/academics/subjects",
    icon: BookOpen,
  },
  {
    title: "Attendance",
    description: "Check attendance records and percentages",
    href: "/student/attendance",
    icon: CheckCircle2,
  },
  {
    title: "Timetable",
    description: "View your weekly class schedule",
    href: "/student/academics/timetable",
    icon: CalendarDays,
  },
  {
    title: "Face Enrollment",
    description: "Manage your face enrollment status",
    href: "/student/face-enrollment",
    icon: ScanFace,
  },
];

export default function StudentDashboardPage() {
  const [today, setToday] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const currentDate = new Date();

    setToday(
      currentDate.toLocaleDateString("en-US", {
        weekday: "long",
      })
    );

    setFormattedDate(
      currentDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  const todayClasses = studentTimetable
    .filter((entry) => entry.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const attendancePercentage = studentAttendanceSummary.percentage;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[var(--primary)]">
            STUDENT WORKSPACE
          </p>

          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {studentProfile.fullName.split(" ")[0]}.
          </h1>

          <p className="mt-2 text-sm text-[var(--text-main)]/60">
            Here is your academic overview and daily schedule.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarDays size={17} className="text-[var(--primary)]" />
            {formattedDate || "Loading date..."}
          </div>
          <p className="mt-1 text-xs text-[var(--text-main)]/50">
            {today || "Your local date"}
          </p>
        </div>
      </section>

      {/* Student identity card */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
        <div className="h-2 bg-[var(--primary)]" />

        <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-7">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-2xl font-bold text-[var(--primary)]">
            {studentProfile.fullName.charAt(0)}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">
              {studentProfile.fullName}
            </h2>

            <p className="mt-1 text-sm text-[var(--text-main)]/55">
              {studentProfile.enrollmentNumber}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--text-main)]/65">
              <span className="flex items-center gap-1.5">
                <GraduationCap size={15} />
                {studentProfile.academic.department}
              </span>

              <span className="flex items-center gap-1.5">
                <BookOpen size={15} />
                Semester {studentProfile.academic.semester}
              </span>

              <span className="flex items-center gap-1.5">
                <UserRound size={15} />
                Section {studentProfile.academic.section}
              </span>
            </div>
          </div>

          <Link
            href="/student/profile"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            View Profile
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Overview cards */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Academic Overview</h2>
          <p className="mt-1 text-sm text-[var(--text-main)]/55">
            Your current academic performance summary.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            label="Attendance"
            value={`${attendancePercentage}%`}
            description={`${studentAttendanceSummary.classesAttended} classes attended`}
            icon={CheckCircle2}
          />

          <OverviewCard
            label="Total Classes"
            value={studentAttendanceSummary.totalClasses}
            description="Classes conducted"
            icon={CalendarDays}
          />

          <OverviewCard
            label="Classes Missed"
            value={studentAttendanceSummary.classesMissed}
            description="Recorded absences"
            icon={XCircle}
          />

          <OverviewCard
            label="Current Semester"
            value={`Semester ${studentProfile.academic.semester}`}
            description={studentProfile.academic.academicSession}
            icon={GraduationCap}
          />
        </div>
      </section>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Today's timetable */}
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-6 xl:col-span-2">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Today's Classes</h2>
              <p className="mt-1 text-sm text-[var(--text-main)]/55">
                Your scheduled lectures for {today || "today"}.
              </p>
            </div>

            <Link
              href="/student/academics/timetable"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline"
            >
              Full timetable
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {!today && (
              <div className="rounded-xl bg-[var(--bg-main)] p-5 text-center text-sm text-[var(--text-main)]/55">
                Loading today's schedule...
              </div>
            )}

            {today && todayClasses.length === 0 && (
              <div className="rounded-xl bg-[var(--bg-main)] px-5 py-8 text-center">
                <CalendarDays
                  size={28}
                  className="mx-auto text-[var(--primary)]/60"
                />
                <p className="mt-3 font-medium">No classes scheduled</p>
                <p className="mt-1 text-sm text-[var(--text-main)]/50">
                  There are no classes in your timetable for today.
                </p>
              </div>
            )}

            {todayClasses.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-3 rounded-xl border border-[var(--border-color)] p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-24">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)]">
                    <Clock3 size={15} />
                    {entry.startTime}
                  </div>
                  <p className="mt-1 pl-5 text-xs text-[var(--text-main)]/45">
                    {entry.endTime}
                  </p>
                </div>

                <div className="min-w-0 flex-1 border-l border-[var(--border-color)] pl-4">
                  <p className="text-xs font-semibold text-[var(--primary)]">
                    {entry.subjectCode}
                  </p>
                  <h3 className="mt-1 font-medium">
                    {entry.subjectName}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--text-main)]/55">
                    {entry.facultyName}
                  </p>
                </div>

                {entry.room && (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-main)]/55">
                    <MapPin size={14} />
                    {entry.room}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Pending actions */}
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold">Pending Actions</h2>
            <p className="mt-1 text-sm text-[var(--text-main)]/55">
              Tasks requiring your attention.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {studentPendingActions.length === 0 ? (
              <div className="rounded-xl bg-[var(--bg-main)] p-5 text-center">
                <CheckCircle2
                  size={26}
                  className="mx-auto text-[var(--primary)]"
                />
                <p className="mt-2 text-sm font-medium">
                  All caught up
                </p>
              </div>
            ) : (
              studentPendingActions.map((action) => (
                <div
                  key={action.id}
                  className="rounded-xl border border-[var(--border-color)] p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold">
                      {action.title}
                    </h3>

                    {action.priority === "important" && (
                      <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-600">
                        Important
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-[var(--text-main)]/55">
                    {action.description}
                  </p>

                  <Link
                    href={action.href}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
                  >
                    Take action
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Academic information */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Academic Information</h2>
          <p className="mt-1 text-sm text-[var(--text-main)]/55">
            Institutional details associated with your student account.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem
            label="Department"
            value={studentProfile.academic.department}
          />

          <InfoItem
            label="Academic Session"
            value={studentProfile.academic.academicSession}
          />

          <InfoItem
            label="Batch"
            value={studentProfile.academic.batch}
          />

          <InfoItem
            label="Section"
            value={studentProfile.academic.section}
          />

          <InfoItem
            label="Admission Year"
            value={studentProfile.academic.admissionYear}
          />

          <InfoItem
            label="Current Semester"
            value={studentProfile.academic.semester}
          />

          <InfoItem
            label="Assigned Mentor"
            value={studentProfile.academic.assignedMentor}
          />

          <InfoItem
            label="Student Status"
            value={studentProfile.status}
          />
        </div>
      </section>

      {/* Quick access */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Quick Access</h2>
          <p className="mt-1 text-sm text-[var(--text-main)]/55">
            Navigate to your student services.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/50 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Icon size={20} />
                </div>

                <h3 className="mt-4 font-semibold">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-[var(--text-main)]/55">
                  {item.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
                  Open
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function OverviewCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-main)]/60">{label}</p>
        <div className="rounded-lg bg-[var(--primary)]/10 p-2 text-[var(--primary)]">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-[var(--text-main)]/50">
        {description}
      </p>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-xs text-[var(--text-main)]/50">{label}</p>
      <p className="mt-1 break-words text-sm font-medium capitalize">
        {value}
      </p>
    </div>
  );
}
