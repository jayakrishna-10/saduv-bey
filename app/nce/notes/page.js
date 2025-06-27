// app/nce/notes/page.js
import Link from 'next/link';
import { books } from '@/config/chapters';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'NCE Study Notes',
  description: 'Comprehensive study materials for National Certification Examination',
};

export default function NCENotesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Study Notes
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Comprehensive study materials organized by papers and chapters
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {books.map((book, index) => (
              <div
                key={book.id}
                className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20"
              >
                <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${book.color} flex items-center justify-center mb-6`}>
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">{book.title}</h2>
                <p className="text-white/70 mb-6">{book.description}</p>
                
                <div className="space-y-3">
                  {book.chapters.slice(0, 3).map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/nce/notes/${book.slug}/${chapter.slug}`}
                      className="block p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium text-sm">{chapter.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-white/60" />
                            <span className="text-xs text-white/60">{chapter.readingTime}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-white/60" />
                      </div>
                    </Link>
                  ))}
                  
                  {book.chapters.length > 3 && (
                    <Link
                      href={`/nce/notes/${book.slug}`}
                      className="block p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-center"
                    >
                      <span className="text-white/80 text-sm">
                        View all {book.chapters.length} chapters
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
