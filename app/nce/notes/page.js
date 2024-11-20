// app/nce/notes/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Book, Clock, Search, Tag, ChevronDown, ChevronRight } from 'lucide-react';
import { books } from '@/app/config/chapters';

export default function NotesPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get all unique topics across all books
  const allTopics = [...new Set(books.flatMap(book => 
    book.chapters.flatMap(chapter => chapter.topics)
  ))];

  // Filter chapters based on search term
  const filteredBooks = books.map(book => ({
    ...book,
    chapters: book.chapters.filter(chapter =>
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.topics.some(topic => 
        topic.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }));

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
          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Chapter Summaries
          </h1>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search chapters, topics, or keywords..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Books and Chapters */}
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

                {selectedBook === book.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-4 space-y-3">
                      {book.chapters.length > 0 ? (
                        book.chapters.map((chapter) => (
                          <Link
                            key={chapter.id}
                            href={`/nce/notes/${book.slug}/${chapter.slug}`}
                            className="block"
                          >
                            <div className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors">
                              <div className="flex items-center justify-between text-white mb-2">
                                <h3 className="font-medium">{chapter.title}</h3>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4" />
                                  {chapter.readingTime}
                                </div>
                              </div>
                              <p className="text-white/80 text-sm mb-3">
                                {chapter.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
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
                          </Link>
                        ))
                      ) : (
                        <div className="text-white/80 text-center py-4">
                          No chapters found matching your search.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
