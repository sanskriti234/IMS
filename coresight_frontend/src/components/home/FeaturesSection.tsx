import { BookOpen, Users, CheckSquare, Award } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: "Academic Structure",
    description: "Manage departments, academic sessions, batches, and sections hierarchically with precise structural control."
  },
  {
    icon: Users,
    title: "Student Management",
    description: "Comprehensive workspaces for student lifecycle tracking, performance analytics, and profile management."
  },
  {
    icon: CheckSquare,
    title: "Smart Attendance",
    description: "Real-time session tracking, automated attendance logs, and instant reporting for faculty and administration."
  },
  {
    icon: Award,
    title: "Mentorship & Guidance",
    description: "Structured faculty-student mentorship assignments to monitor academic growth and holistic development."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-100/50 dark:bg-[#13221f]/50 border-y border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Built for Modern Academic Excellence
          </h2>
          <p className="text-slate-600 dark:text-slate-300 font-sans">
            Designed specifically to replace legacy paperwork with fast, structured, and intelligent digital workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#176B52]/10 dark:bg-[#81D3AD]/10 text-[#176B52] dark:text-[#81D3AD] flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}