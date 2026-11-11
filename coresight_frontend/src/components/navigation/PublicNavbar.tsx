import Link from 'next/link';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-main)]/80 border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          <Link href="/" className="hover:text-[#176B52] dark:hover:text-[#81D3AD] transition-colors">Home</Link>
          <Link href="/#features" className="hover:text-[#176B52] dark:hover:text-[#81D3AD] transition-colors">Features</Link>
          <Link href="/#roles" className="hover:text-[#176B52] dark:hover:text-[#81D3AD] transition-colors">Roles</Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-[#176B52] hover:bg-[#125440] text-white font-medium text-sm transition-all shadow-md"
          >
            Institutional Login
          </Link>
        </div>
      </div>
    </header>
  );
}