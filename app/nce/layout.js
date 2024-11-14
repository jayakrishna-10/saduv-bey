// app/nce/layout.js
import Link from 'next/link';

export const metadata = {
  title: 'saduvbey | NCE',
  description: 'National Certification Examination preparation materials',
}

export default function NCELayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 z-50 w-full bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">saduvbey | NCE</span>
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
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}
