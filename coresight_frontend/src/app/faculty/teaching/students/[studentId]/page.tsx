
"use client";

import { Suspense, type ElementType } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Mail,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  attendanceSessions,
  facultyStudents,
  teachingOfferings,
} from "@/data/faculty-mock-data";

function TeachingStudentProfileContent() {
  const params = useParams<{ studentId: string }>();
  const studentId = params.studentId;

  const student = facultyStudents.find(
    (item) => item.id === studentId
  );

  if (!student) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] px-4 py-16 text-[var(--text-main)]">
        <div className="mx-auto max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 text-center">
          <UserRound
            size={36}
            className="mx-auto text-slate-400"
          />

          <h1 className="mt-4 font-display text-2xl font-semibold">
            Student Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The requested student does not exist in the current mock data.
          </p>

          <Link
            href="/faculty/teaching/students"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#176B52] px-5 py-3 text-sm font-semibold text-white dark:bg-[#81D3AD] dark:text-[#10231C]"
          >
            <ArrowLeft size={16} />
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  const studentOfferings = teachingOfferings.filter(
    (offering) =>
      offering.academicSession === student.academicSession &&
      offering.batch === student.batch &&
      offering.section === student.section &&
      offering.semester === student.semester
  );

  const studentAttendance = attendanceSessions
    .filter((session) =>
      studentOfferings.some(
        (offering) => offering.id === session.offeringId
      )
    )
    .map((session) => {
      const offering = studentOfferings.find(
        (item) => item.id === session.offeringId
      );

      const record = session.records.find(
        (item) => item.studentId === student.id
      );

      return {
        ...session,
        subjectName: offering?.subjectName ?? "Unknown Subject",
        subjectCode: offering?.subjectCode ?? "N/A",
        status: record?.status ?? null,
      };
    })
    .filter((session) => session.status !== null)
    .sort((a, b) => b.date.localeCompare(a.date));

  const subjectAttendance = studentOfferings.map((offering) => {
    const sessions = attendanceSessions.filter(
      (session) =>
        session.offeringId === offering.id &&
        session.records.some(
          (record) => record.studentId === student.id
        )
    );

    const attended = sessions.filter((session) =>
      session.records.some(
        (record) =>
          record.studentId === student.id &&
          record.status === "present"
      )
    ).length;

    const conducted = sessions.length;

    return {
      ...offering,
      conducted,
      attended,
      percentage:
        conducted > 0
          ? Math.round((attended / conducted) * 100)
          : 0,
    };
  });

  const totalConducted = subjectAttendance.reduce(
    (sum, item) => sum + item.conducted,
    0
  );

  const totalAttended = subjectAttendance.reduce(
    (sum, item) => sum + item.attended,
    0
  );

  const overallPercentage =
    totalConducted > 0
      ? Math.round((totalAttended / totalConducted) * 100)
      : 0;

  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(year, month - 1, day));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-8 text-[var(--text-main)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <div>
          <Link
            href="/faculty/teaching/students"
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#176B52] dark:hover:text-[#81D3AD]"
          >
            <ArrowLeft size={16} />
            Back to Students
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#176B52] dark:text-[#81D3AD]">
            Teaching Workspace
          </p>

          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Student Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Academic information and attendance overview.
          </p>
        </div>

        {/* Student information */}
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]">
              <UserRound size={36} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl font-semibold">
                  {student.name}
                </h2>

                <StudentStatus status={student.status} />
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Enrollment Number: {student.enrollmentNumber}
              </p>

              <a
                href={`mailto:${student.email}`}
                className="mt-3 inline-flex items-center gap-2 text-sm text-[#176B52] hover:underline dark:text-[#81D3AD]"
              >
                <Mail size={15} />
                {student.email}
              </a>
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-[var(--border-color)] pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem label="Department" value={student.department} />
            <InfoItem label="Academic Session" value={student.academicSession} />
            <InfoItem label="Batch" value={student.batch} />
            <InfoItem label="Section" value={student.section} />
            <InfoItem label="Semester" value={`Semester ${student.semester}`} />
            <InfoItem label="Enrollment Number" value={student.enrollmentNumber} />
          </div>
        </section>

        {/* Attendance overview */}
        <section>
          <div className="mb-4">
            <h2 className="font-display text-xl font-semibold">
              Attendance Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Attendance from subjects assigned to you.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Overall Attendance"
              value={`${overallPercentage}%`}
              icon={ClipboardCheck}
            />

            <SummaryCard
              label="Classes Conducted"
              value={totalConducted.toString()}
              icon={CalendarDays}
            />

            <SummaryCard
              label="Classes Attended"
              value={totalAttended.toString()}
              icon={CheckCircle2}
            />

            <SummaryCard
              label="Classes Missed"
              value={(totalConducted - totalAttended).toString()}
              icon={XCircle}
            />
          </div>
        </section>

        {/* Subject-wise attendance */}
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]">
              <BookOpen size={20} />
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold">
                Subject-wise Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Attendance breakdown for each assigned subject.
              </p>
            </div>
          </div>

          {subjectAttendance.length === 0 ? (
            <EmptyState message="No assigned subjects found for this student's academic scope." />
          ) : (
            <div className="mt-5 space-y-5">
              {subjectAttendance.map((subject) => (
                <div
                  key={subject.id}
                  className="rounded-xl bg-[var(--bg-main)] p-4"
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-semibold">
                        {subject.subjectName}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {subject.subjectCode} · Semester {subject.semester}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xl font-semibold tabular-nums">
                        {subject.percentage}%
                      </p>

                      <p className="text-xs text-slate-500">
                        {subject.attended} / {subject.conducted} classes
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-full rounded-full ${
                        subject.percentage >= 75
                          ? "bg-emerald-500"
                          : subject.percentage >= 60
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${subject.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Attendance history */}
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]">
              <CalendarDays size={20} />
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold">
                Recent Attendance History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Individual attendance entries across assigned subjects.
              </p>
            </div>
          </div>

          {studentAttendance.length === 0 ? (
            <EmptyState message="No attendance records are available for this student." />
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-[var(--bg-main)] text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="rounded-l-lg px-4 py-3 font-semibold">
                      Date
                    </th>
                    <th className="px-4 py-3 font-semibold">Subject</th>
                    <th className="px-4 py-3 font-semibold">Topic</th>
                    <th className="rounded-r-lg px-4 py-3 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {studentAttendance.map((session) => (
                    <tr
                      key={session.id}
                      className="border-b border-[var(--border-color)] last:border-0"
                    >
                      <td className="px-4 py-4 text-slate-500">
                        {formatDate(session.date)}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium">{session.subjectName}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {session.subjectCode}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-slate-500">
                        {session.topic || "—"}
                      </td>

                      <td className="px-4 py-4">
                        <AttendanceBadge
                          status={session.status as "present" | "absent"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
          <div className="flex items-start gap-3">
            <GraduationCap
              size={20}
              className="mt-0.5 text-[#176B52] dark:text-[#81D3AD]"
            />

            <div>
              <h3 className="text-sm font-semibold">Faculty access</h3>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                This profile is read-only. Attendance figures are calculated
                from the available mock attendance sessions. Student
                registration and academic record changes are not managed
                from this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeachingStudentProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-main)] px-4 py-16 text-[var(--text-main)]">
          <div className="mx-auto max-w-7xl animate-pulse">
            <div className="h-8 w-56 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="mt-6 h-40 rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="mt-5 h-56 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      }
    >
      <TeachingStudentProfileContent />
    </Suspense>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold">{value}</p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-slate-500">{label}</p>

        <div className="rounded-xl bg-emerald-50 p-2 text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function StudentStatus({
  status,
}: {
  status: "active" | "inactive" | "graduated";
}) {
  const styles = {
    active:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    inactive:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    graduated:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function AttendanceBadge({
  status,
}: {
  status: "present" | "absent";
}) {
  const isPresent = status === "present";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isPresent
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
      }`}
    >
      {isPresent ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
      {isPresent ? "Present" : "Absent"}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-[var(--border-color)] px-5 py-10 text-center">
      <ClipboardCheck
        size={28}
        className="mx-auto text-slate-400"
      />
      <p className="mt-3 text-sm text-slate-500">{message}</p>
    </div>
  );
}
