
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Users,
  GraduationCap,
  ArrowRight,
  Filter,
  Layers3,
} from "lucide-react";

import { teachingOfferings } from "@/data/faculty-mock-data";

export default function TeachingSubjectsPage() {
  const [search, setSearch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");

  const semesters = Array.from(
    new Set(teachingOfferings.map((subject) => subject.semester))
  ).sort((a, b) => a - b);

  const sections = Array.from(
    new Set(teachingOfferings.map((subject) => subject.section))
  ).sort();

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return teachingOfferings.filter((subject) => {
      const matchesSearch =
        !query ||
        subject.subjectName.toLowerCase().includes(query) ||
        subject.subjectCode.toLowerCase().includes(query) ||
        subject.department.toLowerCase().includes(query) ||
        subject.batch.toLowerCase().includes(query);

      const matchesSemester =
        selectedSemester === "all" ||
        subject.semester.toString() === selectedSemester;

      const matchesSection =
        selectedSection === "all" ||
        subject.section === selectedSection;

      return matchesSearch && matchesSemester && matchesSection;
    });
  }, [search, selectedSemester, selectedSection]);

  const totalStudents = teachingOfferings.reduce(
    (total, subject) => total + subject.studentCount,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Page Header */}
      <section className="pb-7 border-b border-[var(--border-color)]">
        <p className="text-xs font-bold uppercase tracking-widest text-[#176B52] dark:text-[#81D3AD] mb-2">
          Teaching Workspace
        </p>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              My Subjects
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 max-w-2xl">
              View your assigned subjects, academic groups, semesters and
              student strength.
            </p>
          </div>

          <Link
            href="/faculty/teaching/dashboard"
            className="text-sm font-semibold text-[#176B52] dark:text-[#81D3AD] inline-flex items-center gap-2 hover:gap-3 transition-all"
          >
            Back to Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Assigned Subjects
              </p>
              <h2 className="font-display text-3xl font-bold mt-2">
                {teachingOfferings.length}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
              <BookOpen size={22} />
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Academic Groups
              </p>
              <h2 className="font-display text-3xl font-bold mt-2">
                {new Set(
                  teachingOfferings.map(
                    (subject) => `${subject.batch}-${subject.section}`
                  )
                ).size}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
              <Layers3 size={22} />
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Subject Enrolments
              </p>
              <h2 className="font-display text-3xl font-bold mt-2">
                {totalStudents}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
              <Users size={22} />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-[#176B52] dark:text-[#81D3AD]" />
          <h2 className="font-semibold">Search and Filter Subjects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search subject, code or batch..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
            />
          </div>

          <select
            value={selectedSemester}
            onChange={(event) => setSelectedSemester(event.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
          >
            <option value="all">All Semesters</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester.toString()}>
                Semester {semester}
              </option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(event) => setSelectedSection(event.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
          >
            <option value="all">All Sections</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                Section {section}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {filteredSubjects.length} of {teachingOfferings.length} subjects
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedSemester("all");
              setSelectedSection("all");
            }}
            className="text-xs font-semibold text-[#176B52] dark:text-[#81D3AD] hover:underline"
          >
            Clear filters
          </button>
        </div>
      </section>

      {/* Subject List */}
      <section className="space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold">
            Assigned Subject Details
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your current teaching allocations.
          </p>
        </div>

        {filteredSubjects.length === 0 ? (
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-12 text-center">
            <BookOpen
              size={36}
              className="mx-auto text-slate-400 mb-4"
            />
            <h3 className="font-semibold text-lg">
              No subjects found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Try changing your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredSubjects.map((subject) => (
              <article
                key={subject.id}
                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 hover:shadow-lg transition duration-200"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
                    <BookOpen size={22} />
                  </div>

                  <span className="text-xs font-bold tracking-wide px-3 py-1.5 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)]">
                    {subject.subjectCode}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold mt-5">
                  {subject.subjectName}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {subject.department}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] p-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Batch
                    </p>
                    <p className="font-semibold text-sm mt-1">
                      {subject.batch}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] p-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Section
                    </p>
                    <p className="font-semibold text-sm mt-1">
                      {subject.section}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] p-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Semester
                    </p>
                    <p className="font-semibold text-sm mt-1">
                      {subject.semester}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] p-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Students
                    </p>
                    <p className="font-semibold text-sm mt-1">
                      {subject.studentCount}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
                  <Link
                    href="/faculty/teaching/students"
                    className="flex items-center justify-between text-sm font-semibold text-[#176B52] dark:text-[#81D3AD] group"
                  >
                    View assigned students
                    <ArrowRight
                      size={17}
                      className="group-hover:translate-x-1 transition"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <p>CoreSight · Faculty Workspace</p>
        <p>Academic Management System</p>
      </footer>

    </div>
  );
}
