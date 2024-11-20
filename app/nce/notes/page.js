// app/nce/notes/page.js
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Book, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from 'next/dynamic';

// Dynamically import chapter components with no SSR
const Book1Chapter1 = dynamic(() => import('./chapters/b1c1'), { ssr: false });
const Book1Chapter2 = dynamic(() => import('./chapters/b1c2'), { ssr: false });
const Book1Chapter3 = dynamic(() => import('./chapters/b1c3'), { ssr: false });
const Book1Chapter4 = dynamic(() => import('./chapters/b1c4'), { ssr: false });
const Book1Chapter6 = dynamic(() => import('./chapters/b1c6'), { ssr: false });
const Book1Chapter7 = dynamic(() => import('./chapters/b1c7'), { ssr: false });
const Book1Chapter8 = dynamic(() => import('./chapters/b1c8'), { ssr: false });
const Book1Chapter9 = dynamic(() => import('./chapters/b1c9'), { ssr: false });

// Loading component for dynamic imports
const LoadingComponent = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

// Book data with chapters
const books = [
   {
    id: 1,
    title: "General Aspects of Energy Management and Energy Audit",
    description: "Fundamental concepts and principles of energy management",
    color: "from-blue-500 to-indigo-600",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Energy Scenario",
        description: "Overview of energy scenarios, global and Indian context",
        component: Book1Chapter1,
        isReactComponent: true
      },
      {
        id: 2,
        title: "Chapter 2: Basics of Energy and its Various Forms",
        description: "Understanding different forms of energy and their fundamentals",
        component: Book1Chapter2,
        isReactComponent: true
      },
      {
        id: 3,
        title: "Chapter 3: Energy Management and Audit",
        description: "Principles and practices of energy management and auditing",
        component: Book1Chapter3,
        isReactComponent: true
      },
      {
        id: 4,
        title: "Chapter 4: Material and Energy Balance",
        description: "Understanding material and energy flow in systems",
        component: Book1Chapter4,
        isReactComponent: true
      },
      {
        id: 6,
        title: "Chapter 6: Financial Management",
        description: "Financial aspects of energy management projects",
        component: Book1Chapter6,
        isReactComponent: true
      },
      {
        id: 7,
        title: "Chapter 7: Project Management",
        description: "Managing energy efficiency projects effectively",
        component: Book1Chapter7,
        isReactComponent: true
      },
      {
        id: 8,
        title: "Chapter 8: Energy Monitoring and Targeting",
        description: "Systems and methods for energy monitoring",
        component: Book1Chapter8,
        isReactComponent: true
      },
      {
        id: 9,
        title: "Chapter 9: Global Environmental Concerns",
        description: "Environmental impact and sustainability considerations",
        component: Book1Chapter9,
        isReactComponent: true
      }
    ]
  },
  {
    id: 2,
    title: "Energy Efficiency in Thermal Utilities",
    color: "from-orange-500 to-red-600",
    description: "Comprehensive coverage of thermal energy systems",
    chapters: []  // To be implemented
  },
  {
    id: 3,
    title: "Energy Efficiency in Electrical Utilities",
    color: "from-emerald-500 to-cyan-600",
    description: "Detailed study of electrical energy systems",
    chapters: []  // To be implemented
  }
];

export default function NotesPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleBookSelect = (bookId) => {
    setSelectedBook(bookId === selectedBook ? null : bookId);
    setSelectedChapter(null);
  };

  const getCurrentChapter = () => {
    const book = books.find(b => b.id === selectedBook);
    return book?.chapters.find(c => c.id === selectedChapter);
  };

  const chapter = getCurrentChapter();

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
            <div key={book.id} className="h-fit">
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
                    <p className="text-white/80 text-sm">{book.description}</p>
                  </button>
                  
                  <AnimatePresence>
                    {selectedBook === book.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-2 mt-4">
                          {book.chapters.map((chapter) => (
                            <motion.div
                              key={chapter.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Dialog 
                                open={isOpen && selectedChapter === chapter.id} 
                                onOpenChange={(open) => {
                                  setIsOpen(open);
                                  if (!open) setSelectedChapter(null);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <button
                                    className="w-full text-left py-2 px-4 rounded bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors text-white"
                                    onClick={() => {
                                      setSelectedChapter(chapter.id);
                                      setIsOpen(true);
                                    }}
                                  >
                                    {chapter.title}
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="w-[95vw] max-w-7xl h-[90vh] p-0 overflow-hidden flex flex-col bg-white">
                                  <DialogHeader className="px-6 py-4 border-b">
                                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                                      {book.title} - {chapter.title}
                                    </DialogTitle>
                                    <DialogDescription>
                                      {chapter.description}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <ScrollArea className="flex-1 px-6">
                                    <div className="py-6">
                                      {chapter.isReactComponent && chapter.component ? (
                                        <chapter.component />
                                      ) : (
                                        <div className="text-gray-500 italic">
                                          Content coming soon...
                                        </div>
                                      )}
                                    </div>
                                  </ScrollArea>
                                  <button
                                    className="absolute right-4 top-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Close</span>
                                  </button>
                                </DialogContent>
                              </Dialog>
                            </motion.div>
                          ))}
                          {book.chapters.length === 0 && (
                            <div className="text-white/80 text-sm italic py-2 px-4">
                              Chapters coming soon...
                            </div>
                          )}
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
  );
}
