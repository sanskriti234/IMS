import { Network } from 'lucide-react';

import type { AcademicStructureSummary } from '@/lib/api';

interface AcademicStructureOverviewProps {
  structure: AcademicStructureSummary;
  loading?: boolean;
}

export function AcademicStructureOverview({
  structure,
  loading = false,
}: AcademicStructureOverviewProps) {
  const items = [
    {
      label: 'Departments',
      value: structure.departments,
    },
    {
      label: 'Programmes',
      value: structure.programs,
    },
    {
      label: 'Batches',
      value: structure.batches,
    },
    {
      label: 'Sections',
      value: structure.sections,
    },
  ];

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
          <Network className="w-5 h-5" />
        </div>

        <div>
          <h2 className="font-display font-bold text-xl">
            Academic structure
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current session organisation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {item.label}
            </p>

            <p className="font-bold mt-1">
              {loading ? '...' : item.value.toLocaleString('en-IN')}
            </p>
          </div>
        ))}

        <div className="col-span-2 pt-4 border-t border-[var(--border-color)]">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Active semesters
          </p>

          <p className="font-bold mt-1">
            {loading
              ? '...'
              : structure.active_semesters.length > 0
                ? structure.active_semesters
                    .map((semester) => `Semester ${semester}`)
                    .join(', ')
                : 'No active semesters'}
          </p>
        </div>
      </div>
    </div>
  );
}