'use client';

import type { AcademicYearOption } from '@/lib/api';

interface SessionSelectorProps {
  academicYears: AcademicYearOption[];
  currentSession: string;
  onSessionChange: (session: string) => void;
  disabled?: boolean;
}

export function SessionSelector({
  academicYears,
  currentSession,
  onSessionChange,
  disabled = false,
}: SessionSelectorProps) {
  return (
    <div className="w-full md:w-64">
      <label
        htmlFor="session-select"
        className="block font-semibold mb-2 text-sm"
      >
        Academic session
      </label>

      <select
        id="session-select"
        value={currentSession}
        onChange={(e) => onSessionChange(e.target.value)}
        disabled={disabled || academicYears.length === 0}
        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-sm font-semibold focus:outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD] transition-colors disabled:opacity-50"
      >
        {academicYears.length === 0 ? (
          <option value="">
            No academic sessions available
          </option>
        ) : (
          academicYears.map((year) => (
            <option key={year.id} value={year.id}>
              {year.name}
              {year.status === 'active' ? ' · Current' : ''}
            </option>
          ))
        )}
      </select>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        Overview updates when you change sessions.
      </p>
    </div>
  );
}