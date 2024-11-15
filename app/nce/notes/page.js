// File: app/nce/notes/page.js
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Book, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// Book data with chapters
const books = [
  {
    id: 1,
    title: "General Aspects of Energy Management and Energy Audit",
    color: "from-blue-500 to-indigo-600",
    chapters: Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      title: `Chapter ${i + 1}`,
      content: `# Chapter ${i + 1}\n\nDefault content for chapter ${i + 1}`
    }))
  },
  {
    id: 2,
    title: "Energy Efficiency in Thermal Utilities",
    color: "from-orange-500 to-red-600",
    chapters: Array.from({ length: 11 }, (_, i) => ({
      id: i + 1,
      title: `Chapter ${i + 1}`,
      content: `# Chapter ${i + 1}\n\nDefault content for chapter ${i + 1}`
    }))
  },
  {
    id: 3,
    title: "Energy Efficiency in Electrical Utilities",
    color: "from-emerald-500 to-cyan-600",
    chapters: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Chapter ${i + 1}`,
      content: `# Chapter ${i + 1}\n\nDefault content for chapter ${i + 1}`
    }))
  }
]

export default function NotesPage() {
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleBookSelect = (bookId) => {
    setSelectedBook(bookId === selectedBook ? null : bookId)
    setSelectedChapter(null)
  }

  const getChapterContent = () => {
    const book = books.find(b => b.id === selectedBook)
    if (book) {
      const chapter = book.chapters.find(c => c.id === selectedChapter)
      return chapter ? chapter.content : ''
    }
    return ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7ff] to-[#ffffff]">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-transparent px-4">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
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
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Chapter Summaries
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="h-fit"> {/* Added h-fit to contain height */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`bg-gradient-to-br ${book.color} rounded-lg shadow-lg overflow-hidden`}
              >
                <div className="p-6">
                  <button
                    onClick={() => handleBookSelect(book.id)}
                    className="w-full text-left"
                  >
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Book className="mr-2 h-5 w-5" />
                      {book.title}
                    </h2>
                  </button>
                  
                  <AnimatePresence>
                    {selectedBook === book.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-2">
                          {book.chapters.map((chapter) => (
                            <motion.div
                              key={chapter.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Dialog open={isOpen && selectedChapter === chapter.id} onOpenChange={(open) => {
                                setIsOpen(open)
                                if (!open) setSelectedChapter(null)
                              }}>
                                <DialogTrigger asChild>
                                  <button
                                    className="w-full text-left py-2 px-4 rounded bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors text-white"
                                    onClick={() => setSelectedChapter(chapter.id)}
                                  >
                                    {chapter.title}
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col bg-white dark:bg-gray-800">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                                      {book.title} - {chapter.title}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <ScrollArea className="flex-grow mt-4">
                                    <div className="p-4">
                                      <ReactMarkdown>{getChapterContent()}</ReactMarkdown>
                                    </div>
                                  </ScrollArea>
                                  <button
                                    className="absolute right-4 top-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Close</span>
                                  </button>
                                </DialogContent>
                              </Dialog>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
