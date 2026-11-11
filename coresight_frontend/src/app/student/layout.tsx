
import type { ReactNode } from "react";
import { StudentNavbar } from "@/components/student/StudentNavbar";

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({
  children,
}: StudentLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-main)] font-sans text-[var(--text-main)]">
      <StudentNavbar />

      <main className="w-full flex-1">
        {children}
      </main>

      <footer className="mt-auto border-t border-[var(--border-color)] bg-[var(--card-bg)]">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-[var(--text-main)]/50 sm:flex-row sm:px-6 lg:px-8">
          <p>
            CoreSight Student Portal
          </p>

          <p>
            Academic Management System
          </p>
        </div>
      </footer>
    </div>
  );
}
