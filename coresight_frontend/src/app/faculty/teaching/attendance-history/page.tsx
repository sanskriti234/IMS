
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  CalendarDays,
  Search,
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowRight,
  Filter,
  AlertCircle,
  X,
} from "lucide-react";

import {
  attendanceSessions,
  teachingOfferings,
  facultyStudents,
} from "@/data/faculty-mock-data";

type CorrectionRequest = {
  sessionId: string;
  studentId: string;
  reason: string;
  requestedAt: string;
};

export default function AttendanceHistoryPage() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  const [correctionSessionId, setCorrectionSessionId] = useState<string | null>(
    null
  );
  const [correctionStudentId, setCorrectionStudentId] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctionRequests, setCorrectionRequests] = useState<
    CorrectionRequest[]
  >([]);

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attendanceSessions.filter((session) => {
      const offering = teachingOfferings.find(
        (item) => item.id === session.offeringId
      );

      const matchesSearch =
        !query ||
        session.topic.toLowerCase().includes(query) ||
        session.date.toLowerCase().includes(query) ||
        offering?.subjectName.toLowerCase().includes(query) ||
        offering?.subjectCode.toLowerCase().includes(query);

      const matchesSubject =
        selectedSubject === "all" ||
        session.offeringId === selectedSubject;

      const matchesStatus =
        selectedStatus === "all" || session.status === selectedStatus;

      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [search, selectedSubject, selectedStatus]);

  const totalSessions = attendanceSessions.length;

  const submittedSessions = attendanceSessions.filter(
    (session) => session.status === "submitted"
  ).length;

  const lockedSessions = attendanceSessions.filter(
    (session) => session.status === "locked"
  ).length;

  const selectedSession = attendanceSessions.find(
    (session) => session.id === selectedSessionId
  );

  const correctionSession = attendanceSessions.find(
    (session) => session.id === correctionSessionId
  );

  function getOffering(offeringId: string) {
    return teachingOfferings.find((item) => item.id === offeringId);
  }

  function getStudent(studentId: string) {
    return facultyStudents.find((student) => student.id === studentId);
  }

  function submitCorrectionRequest() {
    if (
      !correctionSessionId ||
      !correctionStudentId ||
      !correctionReason.trim()
    ) {
      return;
    }

    setCorrectionRequests((previous) => [
      ...previous,
      {
        sessionId: correctionSessionId,
        studentId: correctionStudentId,
        reason: correctionReason.trim(),
        requestedAt: new Date().toLocaleString(),
      },
    ]);

    setCorrectionSessionId(null);
    setCorrectionStudentId("");
    setCorrectionReason("");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Header */}
      <section className="pb-7 border-b border-[var(--border-color)]">
        <p className="text-xs font-bold uppercase tracking-widest text-[#176B52] dark:text-[#81D3AD] mb-2">
          Teaching Workspace
        </p>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Attendance History
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 max-w-2xl">
              Review previously conducted attendance sessions, inspect
              student-wise records and raise correction requests.
            </p>
          </div>

          <Link
            href="/faculty/teaching/attendance"
            className="text-sm font-semibold text-[#176B52] dark:text-[#81D3AD] inline-flex items-center gap-2 hover:gap-3 transition-all"
          >
            Take Attendance
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <SummaryCard
          title="Total Sessions"
          value={totalSessions}
          icon={ClipboardList}
          color="green"
        />

        <SummaryCard
          title="Submitted Sessions"
          value={submittedSessions}
          icon={CheckCircle2}
          color="blue"
        />

        <SummaryCard
          title="Locked Sessions"
          value={lockedSessions}
          icon={Clock3}
          color="amber"
        />
      </section>

      {/* Filters */}
      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter
            size={18}
            className="text-[#176B52] dark:text-[#81D3AD]"
          />
          <h2 className="font-semibold">Filter Attendance Records</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search topic, date or subject..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(event) => setSelectedSubject(event.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none"
          >
            <option value="all">All Subjects</option>
            {teachingOfferings.map((offering) => (
              <option key={offering.id} value={offering.id}>
                {offering.subjectCode} - {offering.subjectName}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="locked">Locked</option>
          </select>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {filteredSessions.length} of {totalSessions} sessions
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedSubject("all");
              setSelectedStatus("all");
            }}
            className="text-xs font-semibold text-[#176B52] dark:text-[#81D3AD] hover:underline"
          >
            Clear filters
          </button>
        </div>
      </section>

      {/* Session List */}
      <section className="space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold">
            Previous Sessions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select a session to inspect its attendance records.
          </p>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-12 text-center">
            <ClipboardList
              size={36}
              className="mx-auto text-slate-400 mb-4"
            />
            <h3 className="font-semibold text-lg">No sessions found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Try changing your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => {
              const offering = getOffering(session.offeringId);

              const present = session.records.filter(
                (record) => record.status === "present"
              ).length;

              const absent = session.records.filter(
                (record) => record.status === "absent"
              ).length;

              return (
                <article
                  key={session.id}
                  className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
                        <BookOpen size={22} />
                      </div>

                      <div>
                        <h3 className="font-display text-lg font-bold">
                          {offering?.subjectName ?? "Unknown Subject"}
                        </h3>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {offering?.subjectCode} · {session.topic}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays size={14} />
                            {session.date}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <Users size={14} />
                            {session.records.length} students
                          </span>

                          <span>
                            {offering?.batch} / Section {offering?.section}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-xs text-center">
                        <p className="font-bold text-emerald-700 dark:text-emerald-300">
                          {present} Present
                        </p>
                        <p className="font-bold text-red-700 dark:text-red-300 mt-1">
                          {absent} Absent
                        </p>
                      </div>

                      <SessionStatus status={session.status} />

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSessionId(
                            selectedSessionId === session.id
                              ? null
                              : session.id
                          )
                        }
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm font-semibold hover:bg-[var(--bg-main)] transition"
                      >
                        {selectedSessionId === session.id
                          ? "Hide Details"
                          : "View Details"}
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>

                  {selectedSessionId === session.id && (
                    <div className="mt-6 pt-5 border-t border-[var(--border-color)] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h4 className="font-semibold">
                          Student-wise Attendance
                        </h4>

                        {session.status !== "draft" && (
                          <button
                            type="button"
                            onClick={() => {
                              setCorrectionSessionId(session.id);
                              setCorrectionStudentId("");
                              setCorrectionReason("");
                            }}
                            className="text-sm font-semibold text-[#176B52] dark:text-[#81D3AD] hover:underline"
                          >
                            Request Correction
                          </button>
                        )}
                      </div>

                      {session.records.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No student records available for this session.
                        </p>
                      ) : (
                        <div className="divide-y divide-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden">
                          {session.records.map((record) => {
                            const student = getStudent(record.studentId);

                            return (
                              <div
                                key={record.studentId}
                                className="flex items-center justify-between gap-3 px-4 py-3"
                              >
                                <div>
                                  <p className="text-sm font-medium">
                                    {student?.name ?? "Unknown Student"}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {student?.enrollmentNumber ?? record.studentId}
                                  </p>
                                </div>

                                <span
                                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                    record.status === "present"
                                      ? "text-emerald-700 dark:text-emerald-300"
                                      : "text-red-700 dark:text-red-300"
                                  }`}
                                >
                                  {record.status === "present" ? (
                                    <CheckCircle2 size={15} />
                                  ) : (
                                    <XCircle size={15} />
                                  )}
                                  {record.status}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {correctionRequests
                        .filter((request) => request.sessionId === session.id)
                        .map((request, index) => (
                          <div
                            key={`${request.studentId}-${index}`}
                            className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-4"
                          >
                            <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                              Local Correction Request
                            </p>
                            <p className="text-sm mt-1">
                              {getStudent(request.studentId)?.name ?? request.studentId}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                              {request.reason}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Correction Request Modal */}
      {correctionSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#176B52] dark:text-[#81D3AD]">
                  Attendance Correction
                </p>
                <h2 className="font-display text-xl font-bold mt-2">
                  Request a Correction
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setCorrectionSessionId(null)}
                className="p-2 rounded-lg hover:bg-[var(--bg-main)]"
                aria-label="Close correction form"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
              Session: {correctionSession.topic} · {correctionSession.date}
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Student
                </label>

                <select
                  value={correctionStudentId}
                  onChange={(event) =>
                    setCorrectionStudentId(event.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none"
                >
                  <option value="">Select a student</option>
                  {correctionSession.records.map((record) => {
                    const student = getStudent(record.studentId);

                    return (
                      <option
                        key={record.studentId}
                        value={record.studentId}
                      >
                        {student?.name ?? record.studentId}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Reason for Correction
                </label>

                <textarea
                  value={correctionReason}
                  onChange={(event) =>
                    setCorrectionReason(event.target.value)
                  }
                  rows={4}
                  placeholder="Explain why this attendance record needs correction..."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none resize-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
                />
              </div>

              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-3 flex gap-2">
                <AlertCircle
                  size={17}
                  className="shrink-0 text-amber-700 dark:text-amber-300 mt-0.5"
                />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  This is a frontend demonstration. The request will be
                  stored only in local page state and will not reach an
                  administrator.
                </p>
              </div>

              <button
                type="button"
                onClick={submitCorrectionRequest}
                disabled={!correctionStudentId || !correctionReason.trim()}
                className="w-full rounded-xl bg-[#176B52] dark:bg-[#81D3AD] text-white dark:text-[#101B19] px-4 py-3 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition"
              >
                Submit Correction Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <p>CoreSight · Faculty Workspace</p>
        <p>Academic Management System</p>
      </footer>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: typeof ClipboardList;
  color: "green" | "blue" | "amber";
}) {
  const styles = {
    green:
      "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    blue:
      "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    amber:
      "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="font-display text-3xl font-bold mt-2">{value}</h3>
        </div>

        <div className={`p-3 rounded-xl ${styles[color]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function SessionStatus({
  status,
}: {
  status: "draft" | "submitted" | "locked";
}) {
  const styles = {
    draft: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    submitted:
      "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    locked: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
