'use client';

import { Building2, GraduationCap, UsersRound } from 'lucide-react';

interface OverviewCardsProps {
  session: string;
}

export function OverviewCards({ session }: OverviewCardsProps) {
  const stats = {
    departments: 8,
    students: session === '2026-27' ? '2,436' : '2,150',
    faculty: session === '2026-27' ? '184' : '165',
  };

  return (
    <div className="grid sm:grid-cols-3 gap-6">
      <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm">
        <div className="flex items-start justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total departments</span>
          <Building2 className="w-5 h-5 text-[#176B52] dark:text-[#81D3AD]" />
        </div>
        <div className="font-display text-4xl font-bold mt-5 text-[#176B52] dark:text-[#81D3AD]">
          {stats.departments}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Across engineering, sciences & humanities
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm">
        <div className="flex items-start justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total students</span>
          <GraduationCap className="w-5 h-5 text-[#176B52] dark:text-[#81D3AD]" />
        </div>
        <div className="font-display text-4xl font-bold mt-5 text-[#176B52] dark:text-[#81D3AD]">
          {stats.students}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Enrolled across undergraduate & postgraduate programmes
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm">
        <div className="flex items-start justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total faculty</span>
          <UsersRound className="w-5 h-5 text-[#176B52] dark:text-[#81D3AD]" />
        </div>
        <div className="font-display text-4xl font-bold mt-5 text-[#176B52] dark:text-[#81D3AD]">
          {stats.faculty}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Teaching and research appointments
        </p>
      </div>
    </div>
  );
}