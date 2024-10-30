// app/components/NavBar.js
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Quiz', href: '/nce/quiz' },
    { name: 'Flashcards', href: '/nce/flashcards' },
    { name: 'Study Guides', href: '/nce/study-guides' },
    { name: 'Short Notes', href: '/nce/short-notes' },
  ];

  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-bold text-gray-900">
              Saduv Bey
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <span className="text-sm font-medium text-gray-600">NCE</span>
          </div>
          <div className="hidden md:flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
