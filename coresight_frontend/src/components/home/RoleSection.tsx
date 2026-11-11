// const roles = [
//   { title: "Administrator", desc: "Full institutional control, department hierarchies, faculty oversight, and master operations." },
//   { title: "Faculty", desc: "Course management, grade assessments, attendance logging, and student progress monitoring." },
//   { title: "Mentor", desc: "Dedicated guidance tracking, mentorship check-ins, and student milestone reviews." },
//   { title: "Student", desc: "Personalized academic dashboard, timetable viewing, attendance records, and grade reports." }
// ];

// export function RoleSection() {
//   return (
//     <section id="roles" className="py-24">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
//           <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
//             Tailored Role-Based Workspaces
//           </h2>
//           <p className="text-slate-600 dark:text-slate-300 font-sans">
//             Every user gets a customized interface optimized for their specific academic responsibilities.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {roles.map((role, idx) => (
//             <div key={idx} className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)]">
//               <span className="inline-block px-3 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD] text-xs font-semibold mb-4">
//                 Role {idx + 1}
//               </span>
//               <h3 className="font-display text-lg font-bold mb-2">{role.title}</h3>
//               <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{role.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }




import Link from "next/link";

const roles = [
  {
    title: "Administrator",
    desc: "Full institutional control, department hierarchies, faculty oversight, and master operations.",
  },
  {
    title: "Faculty",
    desc: "Course management, grade assessments, attendance logging, and student progress monitoring.",
    demoLink: "/faculty/teaching/dashboard",
    buttonLabel: "Faculty Demo",
  },
  {
    title: "Mentor",
    desc: "Dedicated guidance tracking, mentorship check-ins, and student milestone reviews.",
    demoLink: "/faculty/mentor/dashboard",
    buttonLabel: "Mentor Demo",
  },
  {
    title: "Student",
    desc: "Personalized academic dashboard, timetable viewing, attendance records, and grade reports.",
    demoLink: "/student/dashboard",
    buttonLabel: "Student Demo",
  },
];

export function RoleSection() {
  return (
    <section id="roles" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Tailored Role-Based Workspaces
          </h2>

          <p className="font-sans text-slate-600 dark:text-slate-300">
            Every user gets a customized interface optimized for their
            specific academic responsibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((role, idx) => (
            <div
              key={role.title}
              className="flex flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="mb-4 inline-block w-fit rounded-md bg-emerald-100 px-3 py-1 text-xs font-semibold text-[#176B52] dark:bg-emerald-950 dark:text-[#81D3AD]">
                Role {idx + 1}
              </span>

              <h3 className="mb-2 font-display text-lg font-bold">
                {role.title}
              </h3>

              <p className="flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {role.desc}
              </p>

              {role.demoLink && (
                <Link
                  href={role.demoLink}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--primary-hover)] hover:shadow-md dark:text-[#101B19]"
                >
                  {role.buttonLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
