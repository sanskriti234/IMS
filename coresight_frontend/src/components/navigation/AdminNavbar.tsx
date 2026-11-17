
'use client';

import Link from 'next/link';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  LogOut,
} from 'lucide-react';

export function AdminNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--card-bg)] border-b border-[var(--border-color)] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-8">
          <Logo />

          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD] text-xs font-semibold">
            HOD Admin Portal
          </span>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-2 font-medium text-sm">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#176B52] dark:text-[#81D3AD]" />
              Dashboard
            </Link>

            <Link
              href="/admin/academics?tab=sessions"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#176B52] dark:text-[#81D3AD]" />
              Academics
            </Link>

            <Link
              href="/admin/faculty?tab=directory"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Users className="w-4 h-4 text-[#176B52] dark:text-[#81D3AD]" />
              Faculty
            </Link>

              <Link
          href="/admin/subjects"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-[#176B52] dark:text-[#81D3AD]" />
          Subjects
        </Link>

          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30 text-xs font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Link>

        </div>

      

      </div>
    </header>
  );
}
