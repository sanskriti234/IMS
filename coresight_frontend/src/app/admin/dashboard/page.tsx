'use client';

import { useCallback, useEffect, useState } from 'react';

import { AdminNavbar } from '@/components/navigation/AdminNavbar';
import { SessionSelector } from '@/components/admin/SessionSelector';
import { OverviewCards } from '@/components/admin/OverviewCards';
import { AcademicStructureOverview } from '@/components/admin/AcademicStructureOverview';
import { PendingOperations } from '@/components/admin/PendingOperations';

import {
  adminDashboardApi,
  type AdminDashboardResponse,
} from '@/lib/api';

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] =
    useState<AdminDashboardResponse | null>(null);

  const [currentAcademicYearId, setCurrentAcademicYearId] =
    useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(
    async (academicYearId?: string) => {
      try {
        setLoading(true);
        setError(null);

        const data = await adminDashboardApi.getDashboard(
          academicYearId
        );

        setDashboard(data);

        // Select the backend's default year on initial load.
        if (!academicYearId && data.selected_academic_year) {
          setCurrentAcademicYearId(
            data.selected_academic_year.id
          );
        }
      } catch (err) {
        console.error('Admin dashboard API error:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load dashboard data.'
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleAcademicYearChange = (yearId: string) => {
    setCurrentAcademicYearId(yearId);
    loadDashboard(yearId);
  };

  const selectedYear = dashboard?.academic_years.find(
    (year) => year.id === currentAcademicYearId
  ) ?? dashboard?.selected_academic_year ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] font-sans">
      <AdminNavbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10 space-y-8">

        {/* Welcome & Session Selector */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-[var(--border-color)]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#176B52] dark:text-[#81D3AD] mb-2">
              Institutional Overview
            </p>

            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome back, Admin.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
              Your institution at a glance. Review the academic
              structure, address pending work, and move directly
              to the operations that matter.
            </p>
          </div>

          <SessionSelector
            academicYears={dashboard?.academic_years ?? []}
            currentSession={currentAcademicYearId}
            onSessionChange={handleAcademicYearChange}
            disabled={loading && !dashboard}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl border border-red-300 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900">
            <p className="font-semibold">
              Failed to load institutional data
            </p>
            <p className="text-sm mt-1">{error}</p>

            <button
              onClick={() =>
                loadDashboard(currentAcademicYearId || undefined)
              }
              className="mt-3 text-sm font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !dashboard && (
          <div className="py-16 text-center text-slate-500">
            Loading institutional dashboard...
          </div>
        )}

        {/* Dashboard Content */}
        {dashboard && (
          <>
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">
                  Institutional snapshot
                </h2>

                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD] text-xs font-semibold">
                  {selectedYear?.name ?? 'No academic year selected'}
                </span>
              </div>

              <OverviewCards
                counts={dashboard.counts}
                loading={loading}
              />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              <div className="lg:col-span-7">
                <AcademicStructureOverview
                  structure={dashboard.academic_structure}
                  loading={loading}
                />
              </div>

              <div className="lg:col-span-5">
                <PendingOperations
                  operations={dashboard.pending_operations}
                  loading={loading}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}