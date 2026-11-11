
"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  Search,
  BookOpen,
  Clock3,
} from "lucide-react";

import {
  studentAttendanceSummary,
  studentAttendanceRecords,
} from "@/data/student-mock-data";

type AttendanceFilter = "all" | "present" | "absent";

export default function StudentAttendancePage() {
  const [filter, setFilter] = useState<AttendanceFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const summary = studentAttendanceSummary;

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return studentAttendanceRecords.filter((record) => {
      const matchesStatus =
        filter === "all" || record.status === filter;

      const matchesSearch =
        !query ||
        record.subjectName.toLowerCase().includes(query) ||
        record.subjectCode.toLowerCase().includes(query) ||
        record.date.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [filter, searchQuery]);

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return "text-emerald-600 dark:text-emerald-400";
    if (percentage >= 75) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium tracking-wide text-[var(--primary)]">
          STUDENT WORKSPACE / ATTENDANCE
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          My Attendance
        </h1>

        <p className="mt-2 text-sm text-[var(--text-main)]/60">
          View your overall attendance, subject-wise records, and attendance history.
        </p>
      </section>

      {/* Overall attendance */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--text-main)]/60">
              Overall Attendance
            </p>

            <ClipboardCheck
              size={20}
              className="text-[var(--primary)]"
            />
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(var(--primary) ${
                  summary.percentage * 3.6
                }deg, var(--border-color) 0deg)`,
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[var(--card-bg)]">
                <span className="text-3xl font-bold">
                  {summary.percentage}%
                </span>

                <span className="mt-1 text-xs text-[var(--text-main)]/50">
                  Attendance
                </span>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-[var(--text-main)]/50">
            Based on recorded classes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-2">
          <MetricCard
            label="Total Classes"
            value={summary.totalClasses}
            description="Classes conducted"
            icon={CalendarDays}
          />

          <MetricCard
            label="Classes Attended"
            value={summary.classesAttended}
            description="Present records"
            icon={CheckCircle2}
            iconColor="text-emerald-600 dark:text-emerald-400"
          />

          <MetricCard
            label="Classes Missed"
            value={summary.classesMissed}
            description="Absent records"
            icon={XCircle}
            iconColor="text-red-500"
          />
        </div>
      </section>

      {/* Subject-wise attendance */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Subject-wise Attendance
          </h2>

          <p className="mt-1 text-sm text-[var(--text-main)]/55">
            Attendance distribution for each assigned subject.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead className="border-b border-[var(--border-color)] bg-[var(--bg-main)]">
                <tr className="text-xs font-semibold text-[var(--text-main)]/55">
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Conducted</th>
                  <th className="px-5 py-4">Attended</th>
                  <th className="px-5 py-4">Missed</th>
                  <th className="px-5 py-4">Attendance</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--border-color)]">
                {summary.subjectAttendance.map((subject) => (
                  <tr key={subject.subjectCode}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold">
                        {subject.subjectName}
                      </p>

                      <p className="mt-1 text-xs text-[var(--text-main)]/50">
                        {subject.subjectCode}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {subject.classesConducted}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {subject.classesAttended}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-red-500">
                      {subject.classesMissed}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex min-w-32 items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--border-color)]">
                          <div
                            className="h-full rounded-full bg-[var(--primary)] transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(0, subject.percentage)
                              )}%`,
                            }}
                          />
                        </div>

                        <span
                          className={`text-sm font-semibold ${getAttendanceColor(
                            subject.percentage
                          )}`}
                        >
                          {subject.percentage.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Attendance history */}
      <section>
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">
              Attendance History
            </h2>

            <p className="mt-1 text-sm text-[var(--text-main)]/55">
              Recent attendance records.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-main)]/40"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search subject or date..."
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>
        </div>

        {/* Status filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          {(
            [
              { value: "all", label: "All Records" },
              { value: "present", label: "Present" },
              { value: "absent", label: "Absent" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                filter === option.value
                  ? "bg-[var(--primary)] text-white dark:text-[#101B19]"
                  : "border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)]/65 hover:border-[var(--primary)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
          {filteredRecords.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Search
                size={28}
                className="mx-auto text-[var(--text-main)]/30"
              />

              <p className="mt-3 font-semibold">
                No attendance records found
              </p>

              <p className="mt-1 text-sm text-[var(--text-main)]/50">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-color)]">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={`mt-1 rounded-lg p-2 ${
                        record.status === "present"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {record.status === "present" ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <XCircle size={18} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        {record.subjectName}
                      </p>

                      <p className="mt-1 text-xs text-[var(--text-main)]/50">
                        {record.subjectCode}
                      </p>

                      {record.sessionTopic && (
                        <p className="mt-1 text-xs text-[var(--text-main)]/60">
                          {record.sessionTopic}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                    <span className="flex items-center gap-1.5 text-xs text-[var(--text-main)]/55">
                      <CalendarDays size={14} />
                      {record.date}
                    </span>

                    {record.startTime && (
                      <span className="flex items-center gap-1.5 text-xs text-[var(--text-main)]/55">
                        <Clock3 size={14} />
                        {record.startTime}
                      </span>
                    )}

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        record.status === "present"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-[var(--text-main)]/45">
          Showing {filteredRecords.length} of{" "}
          {studentAttendanceRecords.length} available history records.
        </p>
      </section>

      {/* Read-only notice */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-4">
        <p className="text-sm font-medium">
          Attendance records are read-only.
        </p>

        <p className="mt-1 text-xs leading-relaxed text-[var(--text-main)]/55">
          Attendance is recorded by authorized faculty. Students cannot
          modify attendance entries. Contact the concerned faculty member
          if a recorded entry appears incorrect.
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  iconColor = "text-[var(--primary)]",
}: {
  label: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-[var(--text-main)]/55">{label}</p>
        <Icon size={19} className={iconColor} />
      </div>

      <p className="mt-5 text-3xl font-semibold">{value}</p>

      <p className="mt-1 text-xs text-[var(--text-main)]/50">
        {description}
      </p>
    </div>
  );
}
