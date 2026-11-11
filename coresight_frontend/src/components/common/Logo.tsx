import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-9 h-9 rounded-xl bg-[#176B52] dark:bg-[#81D3AD] flex items-center justify-center text-white dark:text-[#101B19] font-bold text-lg shadow-md transition-transform group-hover:scale-105">
        C
      </div>
      <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        Core<span className="text-[#176B52] dark:text-[#81D3AD]">Sight</span>
      </span>
    </Link>
  );
}