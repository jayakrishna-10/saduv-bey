// app/components/FormulaDisplay.js
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { 
  Calculator, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Clock,
  Target,
  BookOpen
} from 'lucide-react';

export function FormulaDisplay({ formula, index, isExpanded = false }) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [copied, setCopied] = useState(false);

  const copyFormula = async () => {
    try {
      await navigator.clipboard.writeText(formula.equation_latex || formula.equation_plain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy formula:', err);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'basic':
        return 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
    >
      {/* Formula Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
              <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {formula.name || `Formula ${index + 1}`}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                {formula.category && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                    {formula.category}
                  </span>
                )}
                {formula.difficulty && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(formula.difficulty)}`}>
                    {formula.difficulty}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                copyFormula();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy formula"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </motion.button>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </motion.div>
          </div>
        </div>
      </button>

      {/* Formula Equation */}
      <div className="px-6 pb-4">
        <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-xl">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            className="text-white [&_.katex]:text-white [&_.katex-display]:my-2"
          >
            {formula.equation_latex || formula.equation_plain || formula.quick_form}
          </ReactMarkdown>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 space-y-6">
              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formula.when_to_use && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-green-900 dark:text-green-100 text-sm">When to Use</span>
                    </div>
                    <p className="text-green-800 dark:text-green-200 text-sm">{formula.when_to_use}</p>
                  </div>
                )}

                {formula.memory_aid && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="font-medium text-purple-900 dark:text-purple-100 text-sm">Memory Aid</span>
                    </div>
                    <p className="text-purple-800 dark:text-purple-200 text-sm">{formula.memory_aid}</p>
                  </div>
                )}

                {formula.time_to_solve && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span className="font-medium text-orange-900 dark:text-orange-100 text-sm">Typical Time</span>
                    </div>
                    <p className="text-orange-800 dark:text-orange-200 text-sm">{formula.time_to_solve}</p>
                  </div>
                )}
              </div>

              {/* Variables */}
              {formula.variables && Object.keys(formula.variables).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Variables
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formula.variables).map(([symbol, details]) => (
                      <div key={symbol} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                        <div className="flex items-start gap-3">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-lg">{symbol}</span>
                          <div className="flex-1">
                            <p className="text-blue-900 dark:text-blue-100 font-medium mb-1">
                              {typeof details === 'string' ? details : details.description}
                            </p>
                            {typeof details === 'object' && (
                              <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                                {details.units_si && (
                                  <p><span className="font-medium">Units:</span> {details.units_si}</p>
                                )}
                                {details.typical_range && (
                                  <p><span className="font-medium">Range:</span> {details.typical_range}</p>
                                )}
                                {details.measurement_method && (
                                  <p><span className="font-medium">Measured by:</span> {details.measurement_method}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Derivation */}
              {formula.derivation && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Derivation</h4>
                  <div className="space-y-4">
                    {formula.derivation.from_principles && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Based on:</h5>
                        <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                          {formula.derivation.from_principles.map((principle, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                              {principle}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {formula.derivation.assumptions && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                        <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Assumptions:</h5>
                        <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
                          {formula.derivation.assumptions.map((assumption, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {assumption}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {formula.derivation.limitations && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700">
                        <h5 className="font-medium text-red-900 dark:text-red-100 mb-2">Limitations:</h5>
                        <ul className="text-red-800 dark:text-red-200 text-sm space-y-1">
                          {formula.derivation.limitations.map((limitation, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Example Calculations */}
              {formula.example_calculations && formula.example_calculations.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Example Calculations</h4>
                  <div className="space-y-6">
                    {formula.example_calculations.map((example, i) => (
                      <div key={i} className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-center gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(example.difficulty)}`}>
                            {example.difficulty || 'Example'}
                          </span>
                          {example.time_to_solve && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">⏱️ {example.time_to_solve}</span>
                          )}
                        </div>
                        
                        <h5 className="font-medium text-indigo-900 dark:text-indigo-100 mb-3">Problem:</h5>
                        <p className="text-indigo-800 dark:text-indigo-200 mb-4">{example.problem}</p>
                        
                        {example.given_data && (
                          <div className="mb-4">
                            <h6 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Given:</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {Object.entries(example.given_data).map(([key, value]) => (
                                <div key={key} className="text-sm text-indigo-600 dark:text-indigo-400">
                                  <span className="font-mono">{key}</span> = {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {example.solution_steps && (
                          <div className="mb-4">
                            <h6 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Solution:</h6>
                            <div className="space-y-3">
                              {example.solution_steps.map((step, j) => (
                                <div key={j} className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-indigo-200 dark:border-indigo-600">
                                  <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                      {step.step_number || j + 1}
                                    </span>
                                    <div className="flex-1">
                                      <p className="text-indigo-900 dark:text-indigo-100 text-sm font-medium mb-1">
                                        {step.description}
                                      </p>
                                      {step.calculation && (
                                        <p className="text-indigo-700 dark:text-indigo-300 text-sm font-mono">
                                          {step.calculation}
                                        </p>
                                      )}
                                      {step.result && (
                                        <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-1">
                                          Result: {step.result}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700">
                          <h6 className="font-medium text-green-900 dark:text-green-100 mb-1">Final Answer:</h6>
                          <p className="text-green-800 dark:text-green-200 font-medium">
                            {example.final_answer}
                          </p>
                        </div>
                        
                        {example.common_mistakes && example.common_mistakes.length > 0 && (
                          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 rounded-lg border border-red-200 dark:border-red-700">
                            <h6 className="font-medium text-red-900 dark:text-red-100 mb-2">Common Mistakes:</h6>
                            <ul className="text-red-800 dark:text-red-200 text-sm space-y-1">
                              {example.common_mistakes.map((mistake, k) => (
                                <li key={k} className="flex items-start gap-2">
                                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  {mistake}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Formulas */}
              {formula.related_formulas && formula.related_formulas.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Related Formulas</h4>
                  <div className="flex flex-wrap gap-2">
                    {formula.related_formulas.map((relatedId, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {relatedId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
