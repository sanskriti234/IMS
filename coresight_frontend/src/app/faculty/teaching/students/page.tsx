
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  GraduationCap,
  UserCheck,
  UserX,
  ArrowRight,
  Filter,
  Mail,
  Hash,
  BookOpen,
} from "lucide-react";

import { facultyStudents } from "@/data/faculty-mock-data";

export default function TeachingStudentsPage() {
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const batches = Array.from(
    new Set(facultyStudents.map((student) => student.batch))
  ).sort();

  const sections = Array.from(
    new Set(facultyStudents.map((student) => student.section))
  ).sort();

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return facultyStudents.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.enrollmentNumber.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.batch.toLowerCase().includes(query);

      const matchesBatch =
        selectedBatch === "all" || student.batch === selectedBatch;

      const matchesSection =
        selectedSection === "all" ||
        student.section === selectedSection;

      const matchesStatus =
        selectedStatus === "all" || student.status === selectedStatus;

      return (
        matchesSearch &&
        matchesBatch &&
        matchesSection &&
        matchesStatus
      );
    });
  }, [search, selectedBatch, selectedSection, selectedStatus]);

  const activeCount = facultyStudents.filter(
    (student) => student.status === "active"
  ).length;

  const inactiveCount = facultyStudents.filter(
    (student) => student.status === "inactive"
  ).length;

  const graduatedCount = facultyStudents.filter(
    (student) => student.status === "graduated"
  ).length;

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
              Assigned Students
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 max-w-2xl">
              View and manage the student records belonging to your assigned
              teaching groups.
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

      {/* Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <SummaryCard
          title="Total Students"
          value={facultyStudents.length}
          icon={Users}
          color="green"
        />

        <SummaryCard
          title="Active Students"
          value={activeCount}
          icon={UserCheck}
          color="green"
        />

        <SummaryCard
          title="Inactive Students"
          value={inactiveCount}
          icon={UserX}
          color="amber"
        />

        <SummaryCard
          title="Graduated Students"
          value={graduatedCount}
          icon={GraduationCap}
          color="blue"
        />
      </section>

      {/* Search and Filters */}
      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter
            size={18}
            className="text-[#176B52] dark:text-[#81D3AD]"
          />
          <h2 className="font-semibold">Find Students</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="relative md:col-span-2 xl:col-span-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, enrollment no. or email..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
            />
          </div>

          <select
            value={selectedBatch}
            onChange={(event) => setSelectedBatch(event.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
          >
            <option value="all">All Batches</option>
            {batches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
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

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {filteredStudents.length} of {facultyStudents.length} students
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedBatch("all");
              setSelectedSection("all");
              setSelectedStatus("all");
            }}
            className="text-xs font-semibold text-[#176B52] dark:text-[#81D3AD] hover:underline"
          >
            Clear filters
          </button>
        </div>
      </section>

      {/* Student Directory */}
      <section className="space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold">
            Student Directory
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Students assigned to your teaching responsibilities.
          </p>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={36} className="mx-auto text-slate-400 mb-4" />
              <h3 className="font-semibold text-lg">No students found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Change your search or filters to see other students.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--bg-main)] border-b border-[var(--border-color)]">
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <th className="px-5 py-4">Student</th>
                      <th className="px-5 py-4">Enrollment Number</th>
                      <th className="px-5 py-4">Academic Group</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-[var(--bg-main)] transition"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-sm font-bold text-[#176B52] dark:text-[#81D3AD]">
                              {student.name
                                .split(" ")
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join("")}
                            </div>

                            <div>
                              <p className="font-semibold">{student.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 font-medium">
                          {student.enrollmentNumber}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium">{student.batch}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Section {student.section} · Semester {student.semester}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={student.status} />
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/faculty/teaching/students/${student.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#176B52] dark:text-[#81D3AD] hover:underline"
                          >
                            View Profile
                            <ArrowRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-[var(--border-color)]">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-[#176B52] dark:text-[#81D3AD]">
                        {student.name
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </div>

                      <div className="flex-grow min-w-0">
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-all">
                          {student.email}
                        </p>
                      </div>

                      <StatusBadge status={student.status} />
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500 dark:text-slate-400">
                          Enrollment
                        </span>
                        <span className="font-medium">
                          {student.enrollmentNumber}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500 dark:text-slate-400">
                          Batch / Section
                        </span>
                        <span className="font-medium">
                          {student.batch} / {student.section}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/faculty/teaching/students/${student.id}`}
                      className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-sm font-semibold text-[#176B52] dark:text-[#81D3AD]"
                    >
                      View Student Profile
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

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
  icon: React.ElementType;
  color: "green" | "amber" | "blue";
}) {
  const colorStyles = {
    green: "bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]",
    amber: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    blue: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="font-display text-3xl font-bold mt-2">{value}</h3>
        </div>

        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "active" | "inactive" | "graduated";
}) {
  const styles = {
    active:
      "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    inactive:
      "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    graduated:
      "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
  };

  return (
    <span
      className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
