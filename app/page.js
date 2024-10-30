// app/page.js (Main Homepage)
import Link from 'next/link';
import NavBar from './components/NavBar';

export default function Home() {
  const examTypes = [
    {
      title: "NCE",
      description: "National Counselor Examination",
      features: [
        "1000+ practice questions",
        "Comprehensive study guides",
        "Interactive flashcards",
        "Topic-wise short notes"
      ],
      href: "/nce"
    }
    // Add more exam types here as needed
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Saduv Bey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive preparation platform for professional certification exams
          </p>
        </div>

        {/* Exam Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examTypes.map((exam) => (
            <Link 
              key={exam.title} 
              href={exam.href}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold mb-4">{exam.title}</h2>
                <p className="text-gray-600 mb-4">{exam.description}</p>
                <ul className="space-y-2">
                  {exam.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

// app/nce/page.js (NCE Homepage)
import NCEHomepage from '@/components/NCEHomepage';

export default function NCEPage() {
  return <NCEHomepage />;
}

// Keep your existing app/layout.js and globals.css as they are
// They don't need modifications since they're already set up correctly
