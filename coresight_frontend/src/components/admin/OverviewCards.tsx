import {
  Building2,
  GraduationCap,
  UsersRound,
} from 'lucide-react';

import type { DashboardCounts } from '@/lib/api';

interface OverviewCardsProps {
  counts: DashboardCounts;
  loading?: boolean;
}

export function OverviewCards({
  counts,
  loading = false,
}: OverviewCardsProps) {
  const stats = [
    {
      label: 'Total departments',
      value: counts.departments,
      description: 'Across engineering, sciences & humanities',
      Icon: Building2,
    },
    {
      label: 'Total students',
      value: counts.students,
      description: 'Enrolled across undergraduate & postgraduate programmes',
      Icon: GraduationCap,
    },
    {
      label: 'Total faculty',
      value: counts.faculty,
      description: 'Teaching and research appointments',
      Icon: UsersRound,
    },
  ];

  return (
    <div className="grid sm:grid-cols-3 gap-6">
      {stats.map(({ label, value, description, Icon }) => (
        <div
          key={label}
          className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm"
        >
          <div className="flex items-start justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {label}
            </span>

            <Icon className="w-5 h-5 text-[#176B52] dark:text-[#81D3AD]" />
          </div>

          <div className="font-display text-4xl font-bold mt-5 text-[#176B52] dark:text-[#81D3AD]">
            {loading ? '...' : value.toLocaleString('en-IN')}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {description}
          </p>
        </div>
      ))}
    </div>
  );
}