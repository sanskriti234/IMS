
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  AlertTriangle,
  GraduationCap,
  Mail,
  ArrowRight,
  Filter,
  BookOpen,
  CalendarDays,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { assignedMentees } from "@/data/faculty-mock-data";

type StatusFilter = "all" | "good" | "needs_attention";
type AttentionFilter = "all" | "normal" | "medium" | "high";

export default function MenteesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [attentionFilter, setAttentionFilter] =
    useState<AttentionFilter>("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");

  const batches = Array.from(
    new Set(assignedMentees.map((mentee) => mentee.batch))
  );

  const sections = Array.from(
    new Set(assignedMentees.map((mentee) => mentee.section))
  );

  const filteredMentees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignedMentees.filter((mentee) => {
      const matchesSearch =
        !query ||
        mentee.name.toLowerCase().includes(query) ||
        mentee.enrollmentNumber.toLowerCase().includes(query) ||
        mentee.email.toLowerCase().includes(query) ||
        mentee.department.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        mentee.academicStatus === statusFilter;

      const matchesAttention =
        attentionFilter === "all" ||
        mentee.attentionLevel === attentionFilter;

      const matchesBatch =
        selectedBatch === "all" || mentee.batch === selectedBatch;

      const matchesSection =
        selectedSection === "all" ||
        mentee.section === selectedSection;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAttention &&
        matchesBatch &&
        matchesSection
      );
    });
  }, [
    search,
    statusFilter,
    attentionFilter,
    selectedBatch,
    selectedSection,
  ]);

  const needsAttention = assignedMentees.filter(
    (mentee) => mentee.academicStatus === "needs_attention"
  ).length;

  const averageAttendance =
    assignedMentees.length > 0
      ? Math.round(
          assignedMentees.reduce(
            (total, mentee) => total + mentee.attendancePercentage,
            0
          ) / assignedMentees.length
        )
      : 0;

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setAttentionFilter("all");
    setSelectedBatch("all");
    setSelectedSection("all");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Header */}
      <section className="pb-7 border-b border-[var(--border-color)]">
        <p className="text-xs font-bold uppercase tracking-widest text-[#176B52] dark:text-[#81D3AD] mb-2">
          Mentor Workspace
        </p>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Mentee Management
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 max-w-2xl">
              View your assigned students, monitor their academic progress
              and identify students who require additional guidance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Users size={17} />
            {assignedMentees.length} assigned mentees
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <SummaryCard
          title="Total Mentees"
          value={assignedMentees.length}
          icon={Users}
          color="green"
        />

        <SummaryCard
          title="Good Academic Status"
          value={
            assignedMentees.length - needsAttention
          }
          icon={GraduationCap}
          color="blue"
        />

        <SummaryCard
          title="Need Attention"
          value={needsAttention}
          icon={AlertTriangle}
          color="amber"
        />

        <SummaryCard
          title="Average Attendance"
          value={`${averageAttendance}%`}
          icon={CalendarDays}
          color="purple"
        />
      </section>

      {/* Filters */}
      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Filter
              size={18}
              className="text-[#176B52] dark:text-[#81D3AD]"
            />
            <h2 className="font-semibold">Search and Filters</h2>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-[#176B52] dark:text-[#81D3AD] hover:underline"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, enrollment or email..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
            />
          </div>

          <select
            value={selectedBatch}
            onChange={(event) => setSelectedBatch(event.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none"
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
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none"
          >
            <option value="all">All Sections</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                Section {section}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none"
          >
            <option value="all">All Academic Statuses</option>
            <option value="good">Good</option>
            <option value="needs_attention">Needs Attention</option>
          </select>

          <select
            value={attentionFilter}
            onChange={(event) =>
              setAttentionFilter(event.target.value as AttentionFilter)
            }
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none"
          >
            <option value="all">All Attention Levels</option>
            <option value="normal">Normal</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
          Showing {filteredMentees.length} of {assignedMentees.length} mentees
        </p>
      </section>

      {/* Mentee Cards */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">
              Assigned Students
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select a student to view their detailed academic profile.
            </p>
          </div>
        </div>

        {filteredMentees.length === 0 ? (
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-12 text-center">
            <UserRound
              size={36}
              className="mx-auto text-slate-400 mb-4"
            />
            <h3 className="font-semibold text-lg">No mentees found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Change your search or filters to see other students.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm font-semibold text-[#176B52] dark:text-[#81D3AD] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredMentees.map((mentee) => (
              <article
                key={mentee.id}
                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 hover:border-[#176B52] dark:hover:border-[#81D3AD] transition-colors"
              >
                {/* Student Identity */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[#176B52] dark:text-[#81D3AD] font-bold">
                      {mentee.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold truncate">
                        {mentee.name}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {mentee.enrollmentNumber}
                      </p>
                    </div>
                  </div>

                  <AttentionBadge level={mentee.attentionLevel} />
                </div>

                {/* Student Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-xs">
                  <InfoItem
                    icon={Mail}
                    label="Email"
                    value={mentee.email}
                  />

                  <InfoItem
                    icon={BookOpen}
                    label="Department"
                    value={mentee.department}
                  />

                  <InfoItem
                    icon={GraduationCap}
                    label="Batch"
                    value={mentee.batch}
                  />

                  <InfoItem
                    icon={Users}
                    label="Section"
                    value={`Section ${mentee.section}`}
                  />
                </div>

                {/* Attendance */}
                <div className="mt-5 p-4 rounded-xl bg-[var(--bg-main)]">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={16}
                        className="text-[#176B52] dark:text-[#81D3AD]"
                      />
                      <span className="text-sm font-semibold">
                        Overall Attendance
                      </span>
                    </div>

                    <span
                      className={`text-sm font-bold ${
                        mentee.attendancePercentage >= 75
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {mentee.attendancePercentage}%
                    </span>
                  </div>

                  <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
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

                {/* Academic Status and Concerns */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <AcademicStatusBadge status={mentee.academicStatus} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {mentee.subjectAttendance.length} subjects monitored
                  </span>
                </div>

                {mentee.concerns.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Recorded Concerns
                    </p>

                    {mentee.concerns.slice(0, 2).map((concern, index) => (
                      <p
                        key={index}
                        className="text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2"
                      >
                        <AlertTriangle
                          size={13}
                          className="shrink-0 mt-0.5"
                        />
                        {concern}
                      </p>
                    ))}
                  </div>
                )}

                {/* Action */}
                <div className="mt-5 pt-4 border-t border-[var(--border-color)] flex justify-end">
                  <Link
                    href={`/faculty/mentor/mentees/${mentee.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#176B52] dark:bg-[#81D3AD] text-white dark:text-[#101B19] px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition"
                  >
                    View Student Profile
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
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

function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "green" | "blue" | "amber" | "purple";
}) {
  const styles = {
    green:
      "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    blue:
      "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    amber:
      "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    purple:
      "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
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

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon
        size={15}
        className="shrink-0 mt-0.5 text-slate-400"
      />
      <div className="min-w-0">
        <p className="text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-medium truncate mt-0.5">{value}</p>
      </div>
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
      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${styles[level]}`}
    >
      {level} attention
    </span>
  );
}

function AcademicStatusBadge({
  status,
}: {
  status: "good" | "needs_attention";
}) {
  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
        status === "good"
          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
      }`}
    >
      {status === "good" ? "Good Standing" : "Needs Attention"}
    </span>
  );
}
