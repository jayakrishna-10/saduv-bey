// app/components/ExplanationDisplay.js - Updated with dark mode support
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  BookOpen, 
  Calculator, 
  Eye,
  ChevronDown,
  ChevronRight,
  Clock,
  Target,
  Zap,
  AlertCircle,
  FileText,
  Layers,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';

export function ExplanationDisplay({ 
  explanationData, 
  questionText, 
  options, 
  correctAnswer, 
  userAnswer 
}) {
  const [expandedSections, setExpandedSections] = useState({
    concept: true,
    technical: false,
    visual: false,
    practical: false,
    study: false
  });
  const [votes, setVotes] = useState({ helpful: 0, unhelpful: 0 });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleVote = (isHelpful) => {
    setVotes(prev => ({
      ...prev,
      [isHelpful ? 'helpful' : 'unhelpful']: prev[isHelpful ? 'helpful' : 'unhelpful'] + 1
    }));
  };

  const getOptionStatus = (option) => {
    const isCorrect = option === correctAnswer;
    const isUserAnswer = option === userAnswer;
    
    if (isCorrect) return 'correct';
    if (isUserAnswer && !isCorrect) return 'incorrect';
    return 'neutral';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'correct': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700';
      case 'incorrect': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'correct': return <CheckCircle className="h-5 w-5" />;
      case 'incorrect': return <XCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  const SectionHeader = ({ title, icon: Icon, section, count }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
        {count && (
          <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
            {count}
          </span>
        )}
      </div>
      {expandedSections[section] ? 
        <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" /> : 
        <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
      }
    </button>
  );

  if (!explanationData || !explanationData.explanation) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-2xl">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <p className="text-yellow-800 dark:text-yellow-200">Explanation not available for this question.</p>
        </div>
      </div>
    );
  }

  const explanation = explanationData.explanation;

  return (
    <div className="space-y-6">
      {/* Header with Question Status */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 mt-1">
            {userAnswer ? (
              userAnswer === correctAnswer ? (
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              )
            ) : (
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {explanation.concept?.title || "Question Explanation"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {explanation.concept?.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              {explanation.difficulty_level && (
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span className="capitalize">{explanation.difficulty_level}</span>
                </div>
              )}
              {explanation.time_to_solve && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{explanation.time_to_solve}</span>
                </div>
              )}
              {explanation.frequency && (
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span className="capitalize">{explanation.frequency} frequency</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Answer Summary */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-200 dark:border-indigo-700">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-indigo-900 dark:text-indigo-100 font-medium mb-1">
                Correct Answer: {correctAnswer?.toUpperCase()}
              </p>
              <p className="text-indigo-800 dark:text-indigo-200 text-sm leading-relaxed">
                {explanation.correct_answer?.explanation}
              </p>
              {explanation.correct_answer?.supporting_facts && (
                <ul className="mt-3 text-indigo-800 dark:text-indigo-200 text-sm space-y-1">
                  {explanation.correct_answer.supporting_facts.map((fact, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-indigo-500 dark:text-indigo-400 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                      {fact}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Option Analysis */}
      <div className="space-y-3">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          Option Analysis
        </h4>
        {['a', 'b', 'c', 'd'].map((option) => {
          const status = getOptionStatus(option);
          const optionData = explanation.incorrect_options?.[`option_${option}`];
          
          return (
            <motion.div
              key={option}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border-2 ${getStatusColor(status)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/70 dark:bg-gray-700/70 flex items-center justify-center font-medium">
                    {option.toUpperCase()}
                  </div>
                  {getStatusIcon(status)}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">{options[`option_${option}`]}</p>
                  {status === 'correct' ? (
                    <p className="text-sm opacity-90">
                      ✓ {explanation.correct_answer?.explanation}
                    </p>
                  ) : optionData ? (
                    <div className="text-sm opacity-90">
                      <p className="mb-1">✗ {optionData.why_wrong}</p>
                      {optionData.common_misconception && (
                        <p className="text-xs italic">
                          Common misconception: {optionData.common_misconception}
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expandable Sections */}
      <div className="space-y-4">
        {/* Technical Details */}
        {explanation.technical_details && (
          <div>
            <SectionHeader 
              title="Technical Details" 
              icon={Calculator} 
              section="technical"
              count={explanation.technical_details.formulas?.length || 0}
            />
            <AnimatePresence>
              {expandedSections.technical && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                >
                  {explanation.technical_details.formulas?.map((formula, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 p-4 rounded-xl font-mono text-sm mb-2">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {formula.formula}
                        </ReactMarkdown>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{formula.description}</p>
                      {formula.variables && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          {Object.entries(formula.variables).map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="font-mono w-8">{key}:</span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {explanation.technical_details.specifications && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Specifications</h5>
                      {explanation.technical_details.specifications.typical_values && (
                        <div className="space-y-2">
                          {Object.entries(explanation.technical_details.specifications.typical_values).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-blue-800 dark:text-blue-200 capitalize">{key.replace(/_/g, ' ')}</span>
                              <span className="text-blue-700 dark:text-blue-300 font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {explanation.technical_details.specifications.standards && (
                        <div className="mt-3">
                          <h6 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-2">Standards:</h6>
                          <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                            {explanation.technical_details.specifications.standards.map((standard, index) => (
                              <li key={index}>• {standard}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {explanation.technical_details.process_description && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Process Description</h5>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {explanation.technical_details.process_description}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Visual Aids */}
        {explanation.visual_aids && (
          <div>
            <SectionHeader 
              title="Visual Aids" 
              icon={Eye} 
              section="visual"
              count={(explanation.visual_aids.tables?.length || 0) + (explanation.visual_aids.diagrams?.length || 0)}
            />
            <AnimatePresence>
              {expandedSections.visual && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                >
                  {explanation.visual_aids.tables?.map((table, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{table.title}</h5>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                              {table.headers.map((header, i) => (
                                <th key={i} className="border border-gray-300 dark:border-gray-600 p-2 text-left font-medium text-gray-900 dark:text-gray-100">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.rows.map((row, i) => (
                              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                {row.map((cell, j) => (
                                  <td key={j} className="border border-gray-300 dark:border-gray-600 p-2 text-gray-700 dark:text-gray-300">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                  
                  {explanation.visual_aids.diagrams?.map((diagram, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{diagram.title}</h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{diagram.description}</p>
                      {diagram.ascii_art && (
                        <div className="bg-gray-900 dark:bg-gray-800 text-green-400 dark:text-green-300 p-4 rounded-xl font-mono text-sm overflow-x-auto">
                          <pre>{diagram.ascii_art}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Practical Applications */}
        {explanation.practical_applications && (
          <div>
            <SectionHeader 
              title="Practical Applications" 
              icon={Layers} 
              section="practical"
              count={explanation.practical_applications.length}
            />
            <AnimatePresence>
              {expandedSections.practical && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                >
                  {explanation.practical_applications.map((app, index) => (
                    <div key={index} className="mb-4 last:mb-0 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-700">
                      <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">{app.industry}</h5>
                      <p className="text-green-800 dark:text-green-200 text-sm mb-2">{app.use_case}</p>
                      <p className="text-green-700 dark:text-green-300 text-sm italic">{app.example}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Study Tips */}
        {explanation.study_tips && (
          <div>
            <SectionHeader 
              title="Study Tips" 
              icon={BookOpen} 
              section="study"
            />
            <AnimatePresence>
              {expandedSections.study && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                >
                  {explanation.memory_aids && (
                    <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-700">
                      <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Memory Aids</h5>
                      {explanation.memory_aids.mnemonics && (
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-2">
                          <strong>Mnemonic:</strong> {explanation.memory_aids.mnemonics}
                        </p>
                      )}
                      {explanation.memory_aids.analogies && (
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-2">
                          <strong>Analogy:</strong> {explanation.memory_aids.analogies}
                        </p>
                      )}
                      {explanation.memory_aids.key_phrases && (
                        <div className="text-yellow-800 dark:text-yellow-200 text-sm">
                          <strong>Key Phrases:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {explanation.memory_aids.key_phrases.map((phrase, i) => (
                              <li key={i}>{phrase}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {explanation.study_tips.focus_areas && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Focus Areas</h5>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {explanation.study_tips.focus_areas.map((area, i) => (
                            <li key={i}>{area}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {explanation.study_tips.common_mistakes && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Common Mistakes</h5>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {explanation.study_tips.common_mistakes.map((mistake, i) => (
                            <li key={i}>{mistake}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {explanation.study_tips.exam_strategy && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Exam Strategy</h5>
                      <p className="text-blue-800 dark:text-blue-200 text-sm">{explanation.study_tips.exam_strategy}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Related Topics */}
      {explanation.related_topics && explanation.related_topics.length > 0 && (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Related Topics</h4>
          <div className="space-y-3">
            {explanation.related_topics.map((topic, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <BookOpen className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{topic.topic}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{topic.relationship}</p>
                  {topic.reference_chapters && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      See: {topic.reference_chapters.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voting */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Was this explanation helpful?</h4>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleVote(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-900/70 text-green-700 dark:text-green-300 rounded-xl transition-colors"
          >
            <ThumbsUp className="h-4 w-4" />
            Helpful ({votes.helpful})
          </button>
          <button
            onClick={() => handleVote(false)}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-700 dark:text-red-300 rounded-xl transition-colors"
          >
            <ThumbsDown className="h-4 w-4" />
            Not Helpful ({votes.unhelpful})
          </button>
        </div>
      </div>
    </div>
  );
}
