// app/components/NavBar.js
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NavBar() {
  const pathname = usePathname();
  
  // Function to determine if we're in the NCE section
  const isNCESection = pathname.startsWith('/nce');

  return (
    <nav className="border-b">
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
          
          {/* Navigation links */}
          <div className="flex space-x-4">
            {isNCESection ? (
              // NCE section navigation
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Home
              </Link>
            ) : (
              // Home page navigation (if needed)
              <div className="flex gap-4">
                <Link
                  href="/nce"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  NCE Exam
                </Link>
                {/* Add more exam links here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
