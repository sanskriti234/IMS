'use client';

interface SessionSelectorProps {
  currentSession: string;
  onSessionChange: (session: string) => void;
}

export function SessionSelector({ currentSession, onSessionChange }: SessionSelectorProps) {
  return (
    <div className="w-full md:w-64">
      <label htmlFor="session-select" className="block font-semibold mb-2 text-sm">
        Academic session
      </label>
      <select
        id="session-select"
        value={currentSession}
        onChange={(e) => onSessionChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-sm font-semibold focus:outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD] transition-colors"
      >
        <option value="2026-27">2026–27 · Current</option>
        <option value="2025-26">2025–26</option>
      </select>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        Overview updates when you change sessions.
      </p>
    </div>
  );
}