'use client';

import { useState } from 'react';
import { AdminNavbar } from '@/components/navigation/AdminNavbar';
import { SessionSelector } from '@/components/admin/SessionSelector';
import { OverviewCards } from '@/components/admin/OverviewCards';
import { AcademicStructureOverview } from '@/components/admin/AcademicStructureOverview';
import { PendingOperations } from '@/components/admin/PendingOperations';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export default function AdminDashboardPage() {
  const [currentSession, setCurrentSession] = useState('2026-27');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] font-sans">
      <AdminNavbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10 space-y-8">
        
        {/* Welcome & Session Selector Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-[var(--border-color)]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#176B52] dark:text-[#81D3AD] mb-2">
              Institutional Overview
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome back, Admin.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
              Your institution at a glance. Review the academic structure, address pending work, and move directly to the operations that matter.
            </p>
          </div>

          <SessionSelector currentSession={currentSession} onSessionChange={setCurrentSession} />
        </div>

        {/* Snapshot Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Institutional snapshot</h2>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD] text-xs font-semibold">
              {currentSession === '2026-27' ? '2026–27 session' : '2025–26 session'}
            </span>
          </div>
          <OverviewCards session={currentSession} />
        </section>

        {/* Grid Structure & Pending Work */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          <div className="lg:col-span-7">
            <AcademicStructureOverview />
          </div>
          <div className="lg:col-span-5">
            <PendingOperations />
          </div>
        </div>

      </main>
    </div>
  );
}