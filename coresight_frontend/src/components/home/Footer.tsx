'use client';

import { Logo } from '../common/Logo';
import { useEffect, useState } from 'react';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="site-footer w-full border-t border-[var(--border-color)] bg-[var(--card-bg)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-3 px-5 py-8 sm:flex-row sm:items-center sm:px-8 lg:px-12">
        <Logo />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
          © {year || 2026} CoreSight SIS. Connected academic management, thoughtfully designed.
        </p>
      </div>
    </footer>
  );
}