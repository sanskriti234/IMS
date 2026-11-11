
import Link from "next/link";
import {
  BookOpen,
  Users,
  ClipboardCheck,
  UserPlus,
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Clock3,
} from "lucide-react";

import {
  facultyProfile,
  facultyAssignment,
  teachingOfferings,
  facultyStudents,
  attendanceSessions,
  registrationSubmissions,
} from "@/data/faculty-mock-data";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="font-display text-3xl font-bold mt-2">
            {value}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {description}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
      <div>
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#176B52] dark:text-[#81D3AD] hover:gap-3 transition-all"
      >
        {action}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export default function TeachingDashboardPage() {
  const activeStudents = facultyStudents.filter(
    (student) => student.status === "active"
  ).length;

  const draftSessions = attendanceSessions.filter(
    (session) => session.status === "draft"
  ).length;

  const pendingRegistrations = registrationSubmissions.filter(
    (submission) =>
      submission.status === "pending" ||
      submission.status === "requires_correction"
  ).length;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">

      <main className="max-w-7xl mx-auto w-full px-6 py-10 space-y-10">

        {/* Welcome Header */}
        <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-7 border-b border-[var(--border-color)]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#176B52] dark:text-[#81D3AD] mb-2">
              Teaching Workspace
            </p>

            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome back, {facultyProfile.name.split(" ")[0]}.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 max-w-2xl">
              Manage your assigned subjects, monitor student progress,
              conduct attendance and handle academic responsibilities.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3">
            <CalendarDays
              size={20}
              className="text-[#176B52] dark:text-[#81D3AD]"
            />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Academic Session
              </p>
              <p className="font-semibold text-sm">
                {teachingOfferings[0]?.academicSession ?? "Not assigned"}
              </p>
            </div>
          </div>
        </section>

        {/* Faculty Profile */}
        <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xl font-bold text-[#176B52] dark:text-[#81D3AD]">
              {facultyProfile.name
                .split(" ")
                .slice(0, 2)
                .map((part) => part[0])
                .join("")}
            </div>

            <div className="flex-grow">
              <h2 className="font-display text-xl font-bold">
                {facultyProfile.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {facultyProfile.designation}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {facultyProfile.department} · {facultyProfile.employeeId}
              </p>
            </div>

            <span className="w-fit px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD] text-xs font-semibold">
              Teaching Faculty
            </span>
          </div>
        </section>

        {/* Academic Snapshot */}
        <section className="space-y-5">
          <div>
            <h2 className="font-display text-xl font-bold">
              Academic Snapshot
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              An overview of your current teaching responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard
              title="Assigned Subjects"
              value={teachingOfferings.length}
              description="Subjects assigned to you"
              icon={BookOpen}
            />

            <StatCard
              title="Active Students"
              value={activeStudents}
              description="Students in your assigned groups"
              icon={Users}
            />

            <StatCard
              title="Draft Attendance"
              value={draftSessions}
              description="Sessions awaiting submission"
              icon={ClipboardCheck}
            />

            {facultyAssignment.registrationPermission && (
              <StatCard
                title="Pending Registrations"
                value={pendingRegistrations}
                description="Submissions requiring attention"
                icon={UserPlus}
              />
            )}
          </div>
        </section>

        {/* Assigned Subjects */}
        <section>
          <SectionHeader
            title="My Assigned Subjects"
            description="Academic subjects and groups assigned to you."
            href="/faculty/teaching/subjects"
            action="View all subjects"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {teachingOfferings.map((offering) => (
              <div
                key={offering.id}
                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 hover:shadow-lg transition duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
                    <BookOpen size={21} />
                  </div>

                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)]">
                    {offering.subjectCode}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold mt-5">
                  {offering.subjectName}
                </h3>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400">
                      Department
                    </span>
                    <span className="font-medium text-right">
                      {offering.department}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400">
                      Batch
                    </span>
                    <span className="font-medium">
                      {offering.batch}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400">
                      Section
                    </span>
                    <span className="font-medium">
                      {offering.section}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400">
                      Semester
                    </span>
                    <span className="font-medium">
                      {offering.semester}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Enrolled Students
                  </span>
                  <span className="font-bold text-[#176B52] dark:text-[#81D3AD]">
                    {offering.studentCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Attendance Sessions */}
        <section>
          <SectionHeader
            title="Recent Attendance"
            description="Track the status of your recent attendance sessions."
            href="/faculty/teaching/attendance-history"
            action="View history"
          />

          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
            {attendanceSessions.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No attendance sessions available.
              </p>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {attendanceSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
                        <ClipboardCheck size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {session.topic}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {session.date}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                        session.status === "submitted"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : session.status === "locked"
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-5">
          <div>
            <h2 className="font-display text-xl font-bold">
              Quick Actions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Access your frequently used teaching operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link
              href="/faculty/teaching/attendance"
              className="group bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 hover:border-[#176B52] dark:hover:border-[#81D3AD] hover:shadow-md transition"
            >
              <ClipboardCheck className="text-[#176B52] dark:text-[#81D3AD]" size={24} />
              <h3 className="font-semibold mt-4">Take Attendance</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Start a new attendance session.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#176B52] dark:text-[#81D3AD] mt-5">
                Open workspace
                <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>

            <Link
              href="/faculty/teaching/students"
              className="group bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 hover:border-[#176B52] dark:hover:border-[#81D3AD] hover:shadow-md transition"
            >
              <GraduationCap className="text-[#176B52] dark:text-[#81D3AD]" size={24} />
              <h3 className="font-semibold mt-4">My Students</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Access your assigned student records.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#176B52] dark:text-[#81D3AD] mt-5">
                View students
                <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {facultyAssignment.registrationPermission && (
              <Link
                href="/faculty/teaching/registration"
                className="group bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 hover:border-[#176B52] dark:hover:border-[#81D3AD] hover:shadow-md transition"
              >
                <UserPlus className="text-[#176B52] dark:text-[#81D3AD]" size={24} />
                <h3 className="font-semibold mt-4">Student Registration</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Review registration submissions.
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#176B52] dark:text-[#81D3AD] mt-5">
                  Review submissions
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>CoreSight · Faculty Workspace</p>
          <p>Academic Management System</p>
        </footer>

      </main>
    </div>
  );
}
