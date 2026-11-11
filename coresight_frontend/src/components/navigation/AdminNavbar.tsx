'use client';

import Link from 'next/link';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import { ChevronDown, LayoutDashboard, Users, BookOpen, GraduationCap, LogOut } from 'lucide-react';
import { useState } from 'react';

export function AdminNavbar() {
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [facultyOpen, setFacultyOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--card-bg)] border-b border-[var(--border-color)] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD] text-xs font-semibold">
            HOD Admin Portal
          </span>
          
          <nav className="hidden lg:flex items-center gap-4 font-medium text-sm">
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#176B52] dark:text-[#81D3AD]" /> Dashboard
            </Link>

            {/* Academics Dropdown */}
            <div className="relative" onMouseLeave={() => setAcademicsOpen(false)}>
              <button
                onClick={() => setAcademicsOpen(!academicsOpen)}
                onMouseEnter={() => setAcademicsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#176B52] dark:text-[#81D3AD]" /> Academics <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {academicsOpen && (
                <div className="absolute top-full left-0 w-52 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl p-2 z-50 space-y-1">
                  <Link href="/admin/academics?tab=sessions" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium">Academic Sessions</Link>
                  <Link href="/admin/academics?tab=batches" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium">Batches & Sections</Link>
                  <Link href="/admin/academics?tab=subjects" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium">Subject Offerings</Link>
                </div>
              )}
            </div>

            {/* Faculty Dropdown */}
            <div className="relative" onMouseLeave={() => setFacultyOpen(false)}>
              <button
                onClick={() => setFacultyOpen(!facultyOpen)}
                onMouseEnter={() => setFacultyOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Users className="w-4 h-4 text-[#176B52] dark:text-[#81D3AD]" /> Faculty <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {facultyOpen && (
                <div className="absolute top-full left-0 w-52 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl p-2 z-50 space-y-1">
                  <Link href="/admin/faculty?tab=directory" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium">Faculty Directory</Link>
                  <Link href="/admin/faculty?tab=add" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium">Add Faculty</Link>
                  <Link href="/admin/faculty?tab=assignments" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium">Faculty Assignments</Link>
                </div>
              )}
            </div>

            {/* Students Dropdown */}
            <div className="relative" onMouseLeave={() => setStudentsOpen(false)}>
              <button
                onClick={() => setStudentsOpen(!studentsOpen)}
                onMouseEnter={() => setStudentsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-[#176B52] dark:text-[#81D3AD]" /> Students <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {studentsOpen && (
                <div className="absolute top-full left-0 w-52 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl p-2 z-50 space-y-1">
                  <Link href="/admin/students?tab=directory" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium">Student Directory</Link>
                  <Link href="/admin/students?tab=transfers" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium">Section Transfers</Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30 text-xs font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Link>
        </div>
      </div>
    </header>
  );
}