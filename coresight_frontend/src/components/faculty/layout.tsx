
import type { ReactNode } from "react";
import { FacultyNavbar } from "../../components/faculty/FacultyNavbar";

export default function FacultyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <FacultyNavbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
