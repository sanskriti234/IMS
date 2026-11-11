import { PublicNavbar } from '@/components/navigation/PublicNavbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { RoleSection } from '@/components/home/RoleSection';
import { Footer } from '@/components/home/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] font-sans">
      <PublicNavbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <RoleSection />
      </main>
      <Footer />
    </div>
  );
}