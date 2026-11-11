
"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  UserRound,
  GraduationCap,
  Layers3,
  X,
  Mail,
  Hash,
} from "lucide-react";

import { studentSubjects } from "@/data/student-mock-data";

export default function StudentSubjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] =
    useState<(typeof studentSubjects)[number] | null>(null);

  const filteredSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return studentSubjects;

    return studentSubjects.filter(
      (subject) =>
        subject.subjectName.toLowerCase().includes(query) ||
        subject.subjectCode.toLowerCase().includes(query) ||
        subject.facultyName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium tracking-wide text-[var(--primary)]">
          STUDENT WORKSPACE / ACADEMICS / SUBJECTS
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          My Subjects
        </h1>

        <p className="mt-2 text-sm text-[var(--text-main)]/60">
          View your assigned subjects and associated faculty information.
        </p>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total Subjects"
          value={studentSubjects.length}
          icon={BookOpen}
        />

        <SummaryCard
          label="Current Semester"
          value={`Semester ${studentSubjects[0]?.semester ?? "—"}`}
          icon={GraduationCap}
        />

        <SummaryCard
          label="Academic Session"
          value={studentSubjects[0]?.academicSession ?? "—"}
          icon={Layers3}
        />
      </section>

      {/* Search */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Enrolled Subjects</h2>
          <p className="mt-1 text-sm text-[var(--text-main)]/55">
            {filteredSubjects.length} of {studentSubjects.length} subjects
          </p>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-main)]/40"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search subject or faculty..."
            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] py-3 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-[var(--text-main)]/35 focus:border-[var(--primary)]"
          />
        </div>
      </section>

      {/* Subject cards */}
      {filteredSubjects.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-14 text-center">
          <Search
            size={30}
            className="mx-auto text-[var(--text-main)]/30"
          />

          <h3 className="mt-4 font-semibold">No subjects found</h3>

          <p className="mt-1 text-sm text-[var(--text-main)]/55">
            Try searching with a different subject name or code.
          </p>

          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-4 text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <article
              key={subject.id}
              className="group flex flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <BookOpen size={21} />
                </div>

                <span className="rounded-lg bg-[var(--bg-main)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)]">
                  {subject.subjectCode}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold leading-snug">
                {subject.subjectName}
              </h3>

              <p className="mt-2 text-xs text-[var(--text-main)]/50">
                Semester {subject.semester}
              </p>

              <div className="mt-5 flex-1 space-y-3 border-t border-[var(--border-color)] pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <UserRound
                    size={16}
                    className="shrink-0 text-[var(--primary)]"
                  />
                  <span className="truncate text-[var(--text-main)]/70">
                    {subject.facultyName}
                  </span>
                </div>

                {subject.credits !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap
                      size={16}
                      className="shrink-0 text-[var(--primary)]"
                    />
                    <span className="text-[var(--text-main)]/70">
                      {subject.credits} Credits
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubject(subject)}
                className="mt-5 w-full rounded-lg border border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]"
              >
                View Subject Details
              </button>
            </article>
          ))}
        </div>
      )}

      {/* Subject details modal */}
      {selectedSubject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedSubject(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="subject-modal-title"
            className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-[var(--primary)]">
                  SUBJECT DETAILS
                </p>

                <h2
                  id="subject-modal-title"
                  className="mt-2 text-xl font-semibold"
                >
                  {selectedSubject.subjectName}
                </h2>

                <p className="mt-1 text-sm text-[var(--text-main)]/50">
                  {selectedSubject.subjectCode}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubject(null)}
                aria-label="Close subject details"
                className="rounded-lg p-2 text-[var(--text-main)]/60 hover:bg-[var(--bg-main)]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <DetailRow
                icon={UserRound}
                label="Assigned Faculty"
                value={selectedSubject.facultyName}
              />

              {selectedSubject.facultyEmail && (
                <DetailRow
                  icon={Mail}
                  label="Faculty Email"
                  value={selectedSubject.facultyEmail}
                />
              )}

              <DetailRow
                icon={GraduationCap}
                label="Semester"
                value={`Semester ${selectedSubject.semester}`}
              />

              {selectedSubject.credits !== undefined && (
                <DetailRow
                  icon={BookOpen}
                  label="Credits"
                  value={selectedSubject.credits.toString()}
                />
              )}

              <DetailRow
                icon={Layers3}
                label="Academic Session"
                value={selectedSubject.academicSession}
              />

              <DetailRow
                icon={Hash}
                label="Batch / Section"
                value={`${selectedSubject.batch} / ${selectedSubject.section}`}
              />

              <DetailRow
                icon={BookOpen}
                label="Department"
                value={selectedSubject.department}
              />
            </div>

            <div className="mt-6 rounded-xl bg-[var(--bg-main)] p-4">
              <p className="text-xs leading-relaxed text-[var(--text-main)]/55">
                Subject allocation is managed by authorized institutional
                staff. Students can view these details but cannot modify
                subject or faculty assignments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedSubject(null)}
              className="mt-5 w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 dark:text-[#101B19]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-main)]/55">{label}</p>

        <div className="rounded-lg bg-[var(--primary)]/10 p-2 text-[var(--primary)]">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function DetailRow({
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
      <div className="mt-0.5 rounded-lg bg-[var(--primary)]/10 p-2 text-[var(--primary)]">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--text-main)]/50">{label}</p>
        <p className="mt-1 break-words text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
