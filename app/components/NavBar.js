// app/components/NavBar.js - Fixed version with proper z-index
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  const isNCESection = pathname.startsWith('/nce');

  return (
    <nav className="fixed top-0 z-[60] w-full backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white hover:text-purple-300 transition-colors">
            saduvbey
          </Link>
          
          <div className="flex items-center gap-4">
            {isNCESection ? (
              <>
                <span className="text-sm text-white/60">NCE Preparation</span>
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  ← Home
                </Link>
              </>
            ) : (
              <Link
                href="/nce"
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                NCE Exam
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
