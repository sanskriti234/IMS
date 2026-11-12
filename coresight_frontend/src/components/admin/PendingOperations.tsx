import {
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

import type { PendingOperation } from '@/lib/api';

interface PendingOperationsProps {
  operations: PendingOperation[];
  loading?: boolean;
}

export function PendingOperations({
  operations,
  loading = false,
}: PendingOperationsProps) {
  return (
    <div className="p-6 md:p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
          <Clock className="w-5 h-5" />
        </div>

        <div>
          <h2 className="font-display font-bold text-xl">
            Pending operations
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Requires administrative attention
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">
            Updating pending operations...
          </p>
        ) : operations.length === 0 ? (
          <p className="text-sm text-slate-500">
            No pending operations.
          </p>
        ) : (
          operations.map((operation) => (
            <div
              key={operation.key}
              className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-[var(--border-color)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                {operation.requires_attention ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#176B52] dark:text-[#81D3AD]" />
                )}

                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {operation.title}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {operation.count.toLocaleString('en-IN')}{' '}
                    {operation.unit}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}