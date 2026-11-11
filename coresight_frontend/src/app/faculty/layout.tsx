
import type { ReactNode } from "react";
import { FacultyNavbar } from "@/components/faculty/FacultyNavbar";

export default function FacultyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] font-sans">
      <FacultyNavbar />

      <main className="flex-grow w-full">
        {children}
      </main>
    </div>
  );
}
