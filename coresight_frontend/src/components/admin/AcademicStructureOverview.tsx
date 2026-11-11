import { Network } from 'lucide-react';

export function AcademicStructureOverview() {
  return (
    <div className="p-6 md:p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
          <Network className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl">Academic structure</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Current session organisation</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Schools</p>
          <p className="font-bold mt-1">3 schools</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Programmes</p>
          <p className="font-bold mt-1">24 programmes</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Active Term</p>
          <p className="font-bold mt-1">Semester V (Fall)</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Batches</p>
          <p className="font-bold mt-1">12 active batches</p>
        </div>
      </div>
    </div>
  );
}