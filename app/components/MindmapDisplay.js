// app/components/MindmapDisplay.js
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Copy, 
  CheckCircle, 
  Download, 
  Maximize2, 
  ChevronRight,
  BookOpen,
  Target,
  Lightbulb,
  ArrowRight,
  X
} from 'lucide-react';

export function MindmapDisplay({ mindmapData, title = "Concept Mindmap" }) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeCluster, setActiveCluster] = useState(null);
  const mermaidRef = useRef(null);

  const copyMermaidCode = async () => {
    try {
      await navigator.clipboard.writeText(mindmapData.mermaid_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy mindmap code:', err);
    }
  };

  const downloadMermaid = () => {
    const element = document.createElement('a');
    const file = new Blob([mindmapData.mermaid_code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'mindmap.mmd';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!mindmapData) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No mindmap data available</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
              <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-light text-gray-900 dark:text-gray-100">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {mindmapData.description || "Visual representation of chapter concepts"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={copyMermaidCode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy Mermaid code"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </motion.button>
            
            <motion.button
              onClick={downloadMermaid}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Download Mermaid file"
            >
              <Download className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </motion.button>
            
            <motion.button
              onClick={() => setIsFullscreen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="View fullscreen"
            >
              <Maximize2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Mermaid Code Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 overflow-x-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-green-400 text-sm font-medium">Mermaid Mindmap Code</span>
            <span className="text-gray-400 text-xs">Copy to visualize in any Mermaid viewer</span>
          </div>
          <pre
            ref={mermaidRef}
            className="text-green-300 text-sm font-mono whitespace-pre-wrap leading-relaxed"
          >
            {mindmapData.mermaid_code}
          </pre>
        </motion.div>

        {/* Learning Path */}
        {mindmapData.learning_path && mindmapData.learning_path.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Recommended Learning Path</h4>
            </div>
            
            <div className="space-y-3">
              {mindmapData.learning_path.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 p-3 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-blue-600">
                    <p className="text-blue-900 dark:text-blue-100 font-medium">{step}</p>
                  </div>
                  {index < mindmapData.learning_path.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-blue-400" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Concept Clusters */}
        {mindmapData.concept_clusters && mindmapData.concept_clusters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Concept Clusters</h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {mindmapData.concept_clusters.length} learning groups
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mindmapData.concept_clusters.map((cluster, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                    activeCluster === index
                      ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-600'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                  }`}
                  onClick={() => setActiveCluster(activeCluster === index ? null : index)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="font-medium text-purple-900 dark:text-purple-100">
                      {cluster.cluster_name}
                    </h5>
                    <motion.div
                      animate={{ rotate: activeCluster === index ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-4 w-4 text-purple-500" />
                    </motion.div>
                  </div>
                  
                  <AnimatePresence>
                    {activeCluster === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        {cluster.concepts && (
                          <div>
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 block">
                              Key Concepts:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {cluster.concepts.map((concept, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full text-xs"
                                >
                                  {concept}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {cluster.difficulty_progression && (
                          <div>
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 block">
                              Difficulty Progression:
                            </span>
                            <div className="flex items-center gap-2">
                              {cluster.difficulty_progression.map((level, i) => (
                                <React.Fragment key={i}>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    i === 0 
                                      ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                                      : i === 1
                                      ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                                      : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                                  }`}>
                                    {level}
                                  </span>
                                  {i < cluster.difficulty_progression.length - 1 && (
                                    <ArrowRight className="h-3 w-3 text-gray-400" />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {cluster.study_sequence && (
                          <div>
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1 block">
                              Study Sequence:
                            </span>
                            <p className="text-purple-600 dark:text-purple-400 text-sm">
                              {cluster.study_sequence}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Critical Paths */}
        {mindmapData.critical_paths && mindmapData.critical_paths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Critical Learning Paths</h4>
            </div>
            
            <div className="space-y-3">
              {mindmapData.critical_paths.map((path, index) => (
                <div
                  key={index}
                  className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-yellow-200 dark:border-yellow-600"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <p className="text-yellow-900 dark:text-yellow-100 font-medium">{path}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{title}</h3>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6">
                  <pre className="text-green-300 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                    {mindmapData.mermaid_code}
                  </pre>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    onClick={copyMermaidCode}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                  
                  <button
                    onClick={downloadMermaid}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
                
                <div className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
                  Copy the code above and paste it into any Mermaid viewer to visualize the mindmap
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
