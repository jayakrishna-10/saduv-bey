// app/nce/layout.js
import Link from 'next/link';

export const metadata = {
  title: 'NCE',
  description: 'National Certification Examination preparation materials',
}

export default function NCELayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7ff] to-[#ffffff]">
      <header className="fixed top-0 z-50 w-full bg-transparent px-4">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800">saduvbey</span>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
          </div>
        </div>
      </header>
      <div>
        {children}
      </div>
    </div>
  );
}
