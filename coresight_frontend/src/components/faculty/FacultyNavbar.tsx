
'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';

import {
  facultyAssignment,
  facultyProfile,
} from '../../data/faculty-mock-data';

import {
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardCheck,
  FileText,
  Menu,
  X,
  LogOut,
  UserCircle,
  CalendarDays,
  ClipboardList,
} from 'lucide-react';

const teachingLinks = [
  {
    label: 'Dashboard',
    href: '/faculty/teaching/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'My Subjects',
    href: '/faculty/teaching/subjects',
    icon: BookOpen,
  },
  {
    label: 'Students',
    href: '/faculty/teaching/students',
    icon: Users,
  },
  {
    label: 'Attendance',
    href: '/faculty/teaching/attendance',
    icon: ClipboardCheck,
  },
  {
    label: 'Attendance History',
    href: '/faculty/teaching/attendance-history',
    icon: CalendarDays,
  },
];

const mentorLinks = [
  {
    label: 'Dashboard',
    href: '/faculty/mentor/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'My Mentees',
    href: '/faculty/mentor/mentees',
    icon: Users,
  },
  {
    label: 'Mentorship Records',
    href: '/faculty/mentor/records',
    icon: ClipboardList,
  },
  {
    label: 'Follow-ups',
    href: '/faculty/mentor/follow-ups',
    icon: CalendarDays,
  },
  {
    label: 'Student Registration',
    href: '/faculty/mentor/registration',
    icon: FileText,
  },
];

function FacultyNavbarContent() {
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { teachingActive, mentorshipActive } = facultyAssignment;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const toggleMenu = (menu: string) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const closeMenus = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const renderDropdown = (
    title: string,
    menuKey: string,
    links: typeof teachingLinks
  ) => (
    <div
      className="relative"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <button
        type="button"
        onClick={() => toggleMenu(menuKey)}
        onMouseEnter={() => setOpenMenu(menuKey)}
        aria-expanded={openMenu === menuKey}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          openMenu === menuKey || pathname.startsWith(`/faculty/${menuKey}`)
            ? 'bg-emerald-50 text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        {title}

        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            openMenu === menuKey ? 'rotate-180' : ''
          }`}
        />
      </button>

      {openMenu === menuKey && (
        <div className="absolute left-0 top-full z-50 w-60 pt-2">
          <div className="space-y-1 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-2 shadow-xl">
            {links.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenus}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive(href)
                    ? 'bg-emerald-50 font-semibold text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* BRAND */}
        <div className="flex items-center gap-5">
          <Logo />

          <span className="hidden rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-[#176B52] dark:bg-emerald-950 dark:text-[#81D3AD] xl:inline-flex">
            Faculty Portal
          </span>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-2 lg:flex">
          {teachingActive &&
            renderDropdown(
              'Teaching Faculty',
              'teaching',
              teachingLinks
            )}

          {mentorshipActive &&
            renderDropdown(
              'Mentor',
              'mentor',
              mentorLinks
            )}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* PROFILE DROPDOWN */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => toggleMenu('profile')}
              aria-expanded={openMenu === 'profile'}
              className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-semibold text-[#176B52] dark:bg-emerald-950 dark:text-[#81D3AD]">
                {facultyProfile.name.charAt(0)}
              </div>

              <div className="hidden text-left xl:block">
                <p className="text-sm font-semibold leading-tight">
                  {facultyProfile.name}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {facultyProfile.designation}
                </p>
              </div>

              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>

            {openMenu === 'profile' && (
              <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-2 shadow-xl">
                <div className="border-b border-[var(--border-color)] px-3 py-3">
                  <p className="text-sm font-semibold">
                    {facultyProfile.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {facultyProfile.email}
                  </p>
                </div>

                <Link
                  href="/faculty/profile"
                  onClick={closeMenus}
                  className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <UserCircle className="h-4 w-4" />
                  My Profile
                </Link>

                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileOpen && (
        <div className="space-y-4 border-t border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-4 lg:hidden">

          {teachingActive && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Teaching Faculty
              </p>

              {teachingLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenus}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive(href)
                      ? 'bg-emerald-50 font-semibold text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {mentorshipActive && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mentor
              </p>

              {mentorLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenus}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive(href)
                      ? 'bg-emerald-50 font-semibold text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* MOBILE PROFILE */}
          <div className="border-t border-[var(--border-color)] pt-3">
            <p className="text-sm font-semibold">
              {facultyProfile.name}
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {facultyProfile.email}
            </p>

            <Link
              href="/faculty/profile"
              onClick={closeMenus}
              className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <UserCircle className="h-4 w-4" />
              My Profile
            </Link>

            <Link
              href="/login"
              onClick={closeMenus}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </div>
        </div>
      )}

      {/* NO ASSIGNMENT STATE */}
      {!teachingActive && !mentorshipActive && (
        <div className="border-t border-[var(--border-color)] px-6 py-3 text-center text-sm text-slate-500">
          No active teaching or mentorship assignments.
        </div>
      )}
    </header>
  );
}

export function FacultyNavbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 h-16 border-b border-[var(--border-color)] bg-[var(--card-bg)]">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
            <Logo />
            <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        </header>
      }
    >
      <FacultyNavbarContent />
    </Suspense>
  );
}
