import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

const pendingTasks = [
  { title: "Department Curriculum Approvals", count: "3 pending", urgent: true },
  { title: "Faculty Workload Assignments", count: "2 departments remaining", urgent: false },
  { title: "Student Enrolment Verifications", count: "14 submissions", urgent: false },
];

export function PendingOperations() {
  return (
    <div className="p-6 md:p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl">Pending operations</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Requires administrative attention</p>
        </div>
      </div>

      <div className="space-y-4">
        {pendingTasks.map((task, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              {task.urgent ? (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#176B52] dark:text-[#81D3AD]" />
              )}
              <div>
                <p className="text-sm font-semibold">{task.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{task.count}</p>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-[#176B52] hover:bg-[#125440] text-white text-xs font-medium transition-colors">
              Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}