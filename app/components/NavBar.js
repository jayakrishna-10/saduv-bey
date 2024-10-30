// app/components/NavBar.js
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  const isNCESection = pathname.startsWith('/nce');

  return (
    <nav className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-bold text-gray-900">
              Saduv Bey
            </Link>
            {isNCESection && (
              <>
                <div className="h-6 w-px bg-gray-200"></div>
                <span className="text-sm font-medium text-gray-600">NCE</span>
              </>
            )}
          </div>
          
          <div className="flex space-x-4">
            {isNCESection ? (
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Home
              </Link>
            ) : (
              <Link
                href="/nce"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
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
