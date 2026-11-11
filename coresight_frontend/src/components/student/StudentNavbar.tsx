
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ScanFace,
  UserRound,
  Bell,
  LogOut,
  GraduationCap,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { studentProfile, studentNotifications } from "@/data/student-mock-data";

const unreadCount = studentNotifications.filter(
  (notification) => !notification.isRead
).length;

const academicLinks = [
  {
    label: "Academic Overview",
    href: "/student/academics",
  },
  {
    label: "My Subjects",
    href: "/student/academics/subjects",
  },
  {
    label: "Timetable",
    href: "/student/academics/timetable",
  },
];

function StudentNavbarContent() {
  const pathname = usePathname();

  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const closeMenus = () => {
    setAcademicsOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
  };

  const navLinkClass = (href: string) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive(href)
        ? "bg-[var(--primary)]/10 text-[var(--primary)]"
        : "text-[var(--text-main)]/75 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--card-bg)]">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex shrink-0 items-center gap-3">
          <Logo />
          <div className="hidden border-l border-[var(--border-color)] pl-3 sm:block">
            <p className="text-xs font-semibold tracking-wide text-[var(--primary)]">
              STUDENT PORTAL
            </p>
            <p className="text-[10px] text-[var(--text-main)]/55">
              Academic Workspace
            </p>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 xl:flex">
          <Link
            href="/student/dashboard"
            className={navLinkClass("/student/dashboard")}
            onClick={closeMenus}
          >
            <LayoutDashboard size={17} />
            Dashboard
          </Link>

          {/* Academics dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setAcademicsOpen(!academicsOpen);
                setProfileOpen(false);
              }}
              aria-expanded={academicsOpen}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/student/academics")
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--text-main)]/75 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
              }`}
            >
              <BookOpen size={17} />
              Academics
              <ChevronDown
                size={15}
                className={`transition-transform ${
                  academicsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {academicsOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-2 shadow-xl">
                {academicLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive(item.href)
                        ? "bg-[var(--primary)]/10 font-semibold text-[var(--primary)]"
                        : "text-[var(--text-main)]/75 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/student/attendance"
            className={navLinkClass("/student/attendance")}
            onClick={closeMenus}
          >
            <ClipboardCheck size={17} />
            Attendance
          </Link>

          <Link
            href="/student/face-enrollment"
            className={navLinkClass("/student/face-enrollment")}
            onClick={closeMenus}
          >
            <ScanFace size={17} />
            Face Enrollment
          </Link>
        </nav>

        {/* Right controls */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <Link
            href="/student/notifications"
            aria-label={`Notifications, ${unreadCount} unread`}
            className={`relative rounded-lg p-2 transition-colors hover:bg-[var(--primary)]/10 ${
              isActive("/student/notifications")
                ? "text-[var(--primary)]"
                : "text-[var(--text-main)]/70"
            }`}
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Profile dropdown */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setAcademicsOpen(false);
              }}
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] px-2 py-1.5 transition-colors hover:bg-[var(--primary)]/5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]/10 text-sm font-bold text-[var(--primary)]">
                {studentProfile.fullName.charAt(0)}
              </div>
              <div className="hidden text-left lg:block">
                <p className="max-w-28 truncate text-xs font-semibold">
                  {studentProfile.fullName}
                </p>
                <p className="text-[10px] text-[var(--text-main)]/55">
                  Student
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`text-[var(--text-main)]/60 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-2 shadow-xl">
                <div className="border-b border-[var(--border-color)] px-3 py-3">
                  <p className="truncate text-sm font-semibold">
                    {studentProfile.fullName}
                  </p>
                  <p className="mt-1 truncate text-xs text-[var(--text-main)]/55">
                    {studentProfile.enrollmentNumber}
                  </p>
                </div>

                <Link
                  href="/student/profile"
                  onClick={closeMenus}
                  className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--text-main)]/75 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
                >
                  <UserRound size={16} />
                  My Profile
                </Link>

                <div className="mt-1 flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--text-main)]/40">
                  <LogOut size={16} />
                  Sign out
                  <span className="ml-auto text-[10px]">Demo</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            className="rounded-lg p-2 text-[var(--text-main)] hover:bg-[var(--primary)]/10 xl:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-4 xl:hidden">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-[var(--bg-main)] p-3 sm:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10 font-bold text-[var(--primary)]">
              {studentProfile.fullName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {studentProfile.fullName}
              </p>
              <p className="truncate text-xs text-[var(--text-main)]/55">
                {studentProfile.enrollmentNumber}
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <Link
              href="/student/dashboard"
              onClick={closeMenus}
              className={navLinkClass("/student/dashboard")}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <button
              type="button"
              onClick={() => setAcademicsOpen(!academicsOpen)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-main)]/75 hover:bg-[var(--primary)]/10"
            >
              <span className="flex items-center gap-2">
                <BookOpen size={18} />
                Academics
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  academicsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {academicsOpen && (
              <div className="ml-7 flex flex-col border-l border-[var(--border-color)] pl-3">
                {academicLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    className={`rounded-lg px-3 py-2.5 text-sm ${
                      isActive(item.href)
                        ? "font-semibold text-[var(--primary)]"
                        : "text-[var(--text-main)]/65 hover:text-[var(--primary)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/student/attendance"
              onClick={closeMenus}
              className={navLinkClass("/student/attendance")}
            >
              <ClipboardCheck size={18} />
              Attendance
            </Link>

            <Link
              href="/student/face-enrollment"
              onClick={closeMenus}
              className={navLinkClass("/student/face-enrollment")}
            >
              <ScanFace size={18} />
              Face Enrollment
            </Link>

            <Link
              href="/student/notifications"
              onClick={closeMenus}
              className={navLinkClass("/student/notifications")}
            >
              <Bell size={18} />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/student/profile"
              onClick={closeMenus}
              className={navLinkClass("/student/profile")}
            >
              <UserRound size={18} />
              My Profile
            </Link>
          </nav>

          <div className="mt-4 border-t border-[var(--border-color)] pt-3">
            <div className="flex items-center gap-2 text-xs text-[var(--text-main)]/50">
              <GraduationCap size={15} />
              Student Academic Workspace
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function StudentNavbar() {
  return (
    <Suspense
      fallback={
        <header className="h-16 border-b border-[var(--border-color)] bg-[var(--card-bg)] px-6">
          <div className="flex h-full items-center">
            <Logo />
          </div>
        </header>
      }
    >
      <StudentNavbarContent />
    </Suspense>
  );
}
