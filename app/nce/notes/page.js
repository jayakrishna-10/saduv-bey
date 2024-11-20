// app/nce/notes/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Clock, 
  Search, 
  Tag, 
  ChevronDown, 
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock4
} from 'lucide-react';
import { books, getAllTopics, searchChapters } from '@/config/chapters';

export default function NotesPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('all');

  // Get all unique topics
  const allTopics = getAllTopics();

  // Effect for handling search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        setIsSearching(true);
        const results = searchChapters(searchTerm);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Filter books and chapters based on selected topic
  const filteredBooks = books.map(book => ({
    ...book,
    chapters: book.chapters.filter(chapter =>
      selectedTopic === 'all' || chapter.topics.includes(selectedTopic)
    )
  })).filter(book => book.chapters.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7ff] to-[#ffffff]">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800">saduvbey</span>
            </Link>
            <Link
              href="/nce"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              NCE Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Chapter Summaries
            </h1>
            <p className="text-gray-600">
              Comprehensive study materials organized by topics and chapters
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-8">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search chapters, topics, or keywords..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Topic Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedTopic('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                  ${selectedTopic === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                All Topics
              </button>
              {allTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                    ${selectedTopic === topic
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchTerm && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">
                Search Results {!isSearching && `(${searchResults.length})`}
              </h2>
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((chapter) => (
                    <Link
                      key={`${chapter.bookSlug}-${chapter.slug}`}
                      href={`/nce/notes/${chapter.bookSlug}/${chapter.slug}`}
                    >
                      <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="text-sm text-blue-600 mb-1">{chapter.bookTitle}</div>
                        <h3 className="font-medium mb-2">{chapter.title}</h3>
                        <p className="text-sm text-gray-600">{chapter.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  No chapters found matching your search.
                </div>
              )}
            </div>
          )}

          {/* Books and Chapters */}
          {!searchTerm && (
            <div className="space-y-6">
              {filteredBooks.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`bg-gradient-to-br ${book.color} rounded-xl shadow-lg overflow-hidden`}
                >
                  <button
                    onClick={() => setSelectedBook(selectedBook === book.id ? null : book.id)}
                    className="w-full text-left p-6"
                  >
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <Book className="h-6 w-6" />
                        <h2 className="text-xl font-semibold">{book.title}</h2>
                      </div>
                      {selectedBook === book.id ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                    <p className="text-white/80 mt-2">{book.description}</p>
                  </button>

                  <AnimatePresence>
                    {selectedBook === book.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-4 space-y-3">
                          {book.chapters.map((chapter) => (
                            <ChapterCard 
                              key={chapter.id}
                              chapter={chapter}
                              bookSlug={book.slug}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChapterCard({ chapter, bookSlug }) {
  const statusIndicator = {
    available: {
      icon: CheckCircle,
      className: 'text-green-500',
      label: 'Available'
    },
    'coming-soon': {
      icon: Clock4,
      className: 'text-yellow-500',
      label: 'Coming Soon'
    },
    unavailable: {
      icon: AlertCircle,
      className: 'text-red-500',
      label: 'Unavailable'
    }
  };

  const Status = statusIndicator[chapter.status || 'unavailable'].icon;
  const statusClass = statusIndicator[chapter.status || 'unavailable'].className;
  const statusLabel = statusIndicator[chapter.status || 'unavailable'].label;

  const CardWrapper = chapter.status === 'available' 
    ? Link 
    : 'div';

  const cardProps = chapter.status === 'available' 
    ? { href: `/nce/notes/${bookSlug}/${chapter.slug}` }
    : {};

  return (
    <CardWrapper {...cardProps}>
      <div className={`bg-white/10 rounded-xl p-4 transition-colors
        ${chapter.status === 'available' ? 'hover:bg-white/20 cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-center justify-between text-white mb-2">
          <h3 className="font-medium">{chapter.title}</h3>
          <div className="flex items-center gap-2">
            <Status className={`h-4 w-4 ${statusClass}`} />
            <span className="text-sm">{statusLabel}</span>
          </div>
        </div>
        <p className="text-white/80 text-sm mb-3">
          {chapter.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/60">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{chapter.readingTime}</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {chapter.topics.map((topic, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-white text-xs"
              >
                <Tag className="h-3 w-3" />
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
