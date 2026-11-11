
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Layers3,
  UserRound,
  Users,
  Building2,
  Hash,
} from "lucide-react";

import { studentProfile } from "@/data/student-mock-data";

const academic = studentProfile.academic;

const academicDetails = [
  {
    label: "Department",
    value: academic.department,
    icon: Building2,
  },
  {
    label: "Department Code",
    value: academic.departmentCode,
    icon: Hash,
  },
  {
    label: "Academic Session",
    value: academic.academicSession,
    icon: CalendarDays,
  },
  {
    label: "Admission Year",
    value: academic.admissionYear.toString(),
    icon: GraduationCap,
  },
  {
    label: "Batch",
    value: academic.batch,
    icon: Users,
  },
  {
    label: "Current Semester",
    value: `Semester ${academic.semester}`,
    icon: Layers3,
  },
  {
    label: "Section",
    value: academic.section,
    icon: UserRound,
  },
  {
    label: "Student Status",
    value: studentProfile.status,
    icon: GraduationCap,
  },
];

const academicLinks = [
  {
    title: "My Subjects",
    description:
      "View your enrolled subjects, subject codes, credits, and assigned faculty.",
    href: "/student/academics/subjects",
    icon: BookOpen,
  },
  {
    title: "Class Timetable",
    description:
      "View your weekly class schedule, lecture timings, faculty, and rooms.",
    href: "/student/academics/timetable",
    icon: CalendarDays,
  },
];

export default function StudentAcademicsPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page heading */}
      <section>
        <p className="text-sm font-medium tracking-wide text-[var(--primary)]">
          STUDENT WORKSPACE / ACADEMICS
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          My Academics
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-main)]/60">
          View your academic profile, institutional allocation, semester
          information, and assigned mentor.
        </p>
      </section>

      {/* Current academic status */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <GraduationCap size={28} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-main)]/50">
                Current Academic Session
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                {academic.academicSession}
              </h2>

              <p className="mt-1 text-sm text-[var(--text-main)]/55">
                {academic.department}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[var(--primary)]/10 px-5 py-3">
            <p className="text-xs font-medium text-[var(--primary)]">
              CURRENT SEMESTER
            </p>
            <p className="mt-1 text-2xl font-semibold text-[var(--primary)]">
              {academic.semester}
            </p>
          </div>
        </div>
      </section>

      {/* Academic details */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Academic Details
          </h2>
          <p className="mt-1 text-sm text-[var(--text-main)]/55">
            Official academic information linked to your student account.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {academicDetails.map((detail) => {
            const Icon = detail.icon;

            return (
              <div
                key={detail.label}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5"
              >
                <div className="flex items-center gap-2 text-[var(--primary)]">
                  <Icon size={18} />
                  <p className="text-xs font-medium text-[var(--text-main)]/55">
                    {detail.label}
                  </p>
                </div>

                <p className="mt-4 break-words text-base font-semibold capitalize">
                  {detail.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mentor information */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <UserRound size={23} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-main)]/50">
              Assigned Faculty Mentor
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              {academic.assignedMentor}
            </h2>

            <p className="mt-1 text-sm text-[var(--text-main)]/55">
              Your assigned academic mentor.
            </p>
          </div>
        </div>
      </section>

      {/* Academic navigation */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Academic Resources
          </h2>

          <p className="mt-1 text-sm text-[var(--text-main)]/55">
            Access your subjects and class schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {academicLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/50 hover:shadow-md sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Icon size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-main)]/55">
                    {item.description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                    View details
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Read-only notice */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-4">
        <p className="text-sm font-medium">
          Institutional information is read-only.
        </p>

        <p className="mt-1 text-xs leading-relaxed text-[var(--text-main)]/55">
          Department, academic session, batch, semester, section, and mentor
          allocations are managed by authorized institutional staff. Contact
          your department if any information appears incorrect.
        </p>
      </div>
    </div>
  );
}
