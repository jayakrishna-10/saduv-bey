// app/components/RevisionNotesDisplay.js
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { 
  ChevronDown,
  ChevronRight,
  Brain,
  BookOpen,
  Calculator,
  Eye,
  Target,
  Clock,
  Lightbulb,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
  Layers,
  BarChart3,
  Zap,
  Users,
  Award,
  TrendingUp,
  Search,
  Filter,
  PieChart,
  Settings,
  Bookmark,
  Star,
  Flag
} from 'lucide-react';

export function RevisionNotesDisplay({ revisionData }) {
  const [expandedSections, setExpandedSections] = useState({
    metadata: true,
    objectives: true,
    mindmap: true,
    concepts: true,
    content: true,
    formulas: false,
    exam_strategy: false,
    case_studies: false,
    terminology: false,
    assessment: false
  });

  const [activeContentSection, setActiveContentSection] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!revisionData) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-700 dark:text-gray-300">No revision data available</p>
      </div>
    );
  }

  const SectionHeader = ({ title, icon: Icon, section, count, description }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-6 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 group"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-purple-900/70 transition-colors">
          <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-3">
            <span className="text-xl font-light text-gray-900 dark:text-gray-100">{title}</span>
            {count && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                {count}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      <motion.div
        animate={{ rotate: expandedSections[section] ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
      </motion.div>
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Metadata Section */}
      {revisionData.metadata && (
        <div>
          <SectionHeader 
            title="Chapter Overview" 
            icon={Info} 
            section="metadata"
            description="Essential information and study parameters"
          />
          <AnimatePresence>
            {expandedSections.metadata && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {revisionData.metadata.difficulty_level && (
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-blue-900 dark:text-blue-100">Difficulty</span>
                      </div>
                      <p className="text-blue-800 dark:text-blue-200 text-lg font-light">{revisionData.metadata.difficulty_level}</p>
                    </div>
                  )}
                  
                  {revisionData.metadata.estimated_study_time_hours && (
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-medium text-emerald-900 dark:text-emerald-100">Study Time</span>
                      </div>
                      <p className="text-emerald-800 dark:text-emerald-200 text-lg font-light">{revisionData.metadata.estimated_study_time_hours} hours</p>
                    </div>
                  )}
                  
                  {revisionData.metadata.exam_weightage_percentage && (
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium text-purple-900 dark:text-purple-100">Exam Weight</span>
                      </div>
                      <p className="text-purple-800 dark:text-purple-200 text-lg font-light">{revisionData.metadata.exam_weightage_percentage}%</p>
                    </div>
                  )}
                  
                  {revisionData.metadata.content_complexity_score && (
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        <span className="font-medium text-orange-900 dark:text-orange-100">Complexity</span>
                      </div>
                      <p className="text-orange-800 dark:text-orange-200 text-lg font-light">{revisionData.metadata.content_complexity_score}/10</p>
                    </div>
                  )}
                  
                  {revisionData.metadata.total_pages && (
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">Pages</span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 text-lg font-light">{revisionData.metadata.total_pages}</p>
                    </div>
                  )}
                  
                  {revisionData.metadata.paper_category && (
                    <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200 dark:border-cyan-700">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        <span className="font-medium text-cyan-900 dark:text-cyan-100">Category</span>
                      </div>
                      <p className="text-cyan-800 dark:text-cyan-200 text-lg font-light">{revisionData.metadata.paper_category}</p>
                    </div>
                  )}
                </div>
                
                {revisionData.metadata.prerequisite_chapters && revisionData.metadata.prerequisite_chapters.length > 0 && (
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-3">Prerequisites</h4>
                    <div className="flex flex-wrap gap-2">
                      {revisionData.metadata.prerequisite_chapters.map((prereq, index) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Learning Objectives */}
      {revisionData.learning_objectives && revisionData.learning_objectives.length > 0 && (
        <div>
          <SectionHeader 
            title="Learning Objectives" 
            icon={Target} 
            section="objectives"
            count={revisionData.learning_objectives.length}
            description="What you'll master in this chapter"
          />
          <AnimatePresence>
            {expandedSections.objectives && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="space-y-4">
                  {revisionData.learning_objectives.map((objective, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-indigo-900 dark:text-indigo-100 font-medium mb-2">{objective.objective}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full">
                              {objective.bloom_level}
                            </span>
                            {objective.exam_relevance && (
                              <span className="text-indigo-600 dark:text-indigo-400">{objective.exam_relevance}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Concept Mindmap */}
      {revisionData.concept_mindmap && (
        <div>
          <SectionHeader 
            title="Concept Mindmap" 
            icon={Brain} 
            section="mindmap"
            description="Visual representation of chapter concepts"
          />
          <AnimatePresence>
            {expandedSections.mindmap && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
              >
                {revisionData.concept_mindmap.mermaid_code && (
                  <div className="mb-6">
                    <div className="p-4 bg-gray-900 dark:bg-gray-800 rounded-xl overflow-x-auto">
                      <pre className="text-green-400 dark:text-green-300 text-sm font-mono">
                        {revisionData.concept_mindmap.mermaid_code}
                      </pre>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">
                      Copy this code to visualize in any Mermaid viewer
                    </p>
                  </div>
                )}
                
                {revisionData.concept_mindmap.learning_path && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Recommended Learning Path</h4>
                    <div className="flex flex-wrap gap-2">
                      {revisionData.concept_mindmap.learning_path.map((step, index) => (
                        <div key={index} className="flex items-center">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                            {index + 1}. {step}
                          </span>
                          {index < revisionData.concept_mindmap.learning_path.length - 1 && (
                            <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {revisionData.concept_mindmap.concept_clusters && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Concept Clusters</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {revisionData.concept_mindmap.concept_clusters.map((cluster, index) => (
                        <div key={index} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                          <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">{cluster.cluster_name}</h5>
                          <div className="space-y-2">
                            {cluster.concepts && (
                              <div>
                                <span className="text-sm text-purple-700 dark:text-purple-300">Concepts:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {cluster.concepts.map((concept, i) => (
                                    <span key={i} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded text-xs">
                                      {concept}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {cluster.study_sequence && (
                              <p className="text-sm text-purple-600 dark:text-purple-400">
                                <span className="font-medium">Study sequence:</span> {cluster.study_sequence}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Key Concepts */}
      {revisionData.key_concepts && revisionData.key_concepts.length > 0 && (
        <div>
          <SectionHeader 
            title="Key Concepts" 
            icon={Lightbulb} 
            section="concepts"
            count={revisionData.key_concepts.length}
            description="Essential concepts you must understand"
          />
          <AnimatePresence>
            {expandedSections.concepts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search concepts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {revisionData.key_concepts
                    .filter(concept => 
                      concept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      concept.definition.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((concept, index) => (
                    <motion.div
                      key={concept.concept_id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-emerald-900 dark:text-emerald-100 text-lg">{concept.name}</h4>
                        <div className="flex gap-2">
                          {concept.difficulty_level && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              concept.difficulty_level === 'basic' 
                                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                                : concept.difficulty_level === 'intermediate'
                                ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                                : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                            }`}>
                              {concept.difficulty_level}
                            </span>
                          )}
                          {concept.exam_frequency && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                              {concept.exam_frequency}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-emerald-800 dark:text-emerald-200 mb-4 leading-relaxed">{concept.definition}</p>
                      
                      {concept.importance && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Why it matters:</span>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">{concept.importance}</p>
                        </div>
                      )}
                      
                      {concept.real_world_applications && concept.real_world_applications.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Applications:</span>
                          <ul className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 space-y-1">
                            {concept.real_world_applications.map((app, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                                {app}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {concept.common_misconceptions && concept.common_misconceptions.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-red-700 dark:text-red-300">Common mistakes:</span>
                          <ul className="text-sm text-red-600 dark:text-red-400 mt-1 space-y-1">
                            {concept.common_misconceptions.map((mistake, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                {mistake}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Quick Reference Formulas */}
      {revisionData.formulas_quick_reference && revisionData.formulas_quick_reference.length > 0 && (
        <div>
          <SectionHeader 
            title="Quick Reference Formulas" 
            icon={Calculator} 
            section="formulas"
            count={revisionData.formulas_quick_reference.length}
            description="Essential formulas for quick revision"
          />
          <AnimatePresence>
            {expandedSections.formulas && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {revisionData.formulas_quick_reference.map((formula, index) => (
                    <motion.div
                      key={formula.formula_id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
                    >
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium text-blue-900 dark:text-blue-100">{formula.category}</span>
                        </div>
                        <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            className="text-white text-sm"
                          >
                            {formula.quick_form}
                          </ReactMarkdown>
                        </div>
                      </div>
                      
                      {formula.when_to_use && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">When to use:</span>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{formula.when_to_use}</p>
                        </div>
                      )}
                      
                      {formula.memory_aid && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Memory aid:</span>
                          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">{formula.memory_aid}</p>
                        </div>
                      )}
                      
                      {formula.units_check && (
                        <div>
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">Units check:</span>
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">{formula.units_check}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Content Sections */}
      {revisionData.content_sections && revisionData.content_sections.length > 0 && (
        <div>
          <SectionHeader 
            title="Detailed Content" 
            icon={FileText} 
            section="content"
            count={revisionData.content_sections.length}
            description="Comprehensive chapter content"
          />
          <AnimatePresence>
            {expandedSections.content && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 space-y-6"
              >
                {/* Section Navigation */}
                <div className="flex flex-wrap gap-2 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  {revisionData.content_sections.map((section, index) => (
                    <button
                      key={section.section_id || index}
                      onClick={() => setActiveContentSection(index)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeContentSection === index
                          ? 'bg-purple-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>

                {/* Active Section Content */}
                {revisionData.content_sections[activeContentSection] && (
                  <ContentSectionDisplay 
                    section={revisionData.content_sections[activeContentSection]} 
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Additional sections would continue here... */}
      {/* For brevity, I'm including the main structure. The component would continue with exam_strategy, case_studies, terminology, etc. */}
    </div>
  );
}

// Helper component for displaying content sections
function ContentSectionDisplay({ section }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-2xl font-light text-gray-900 dark:text-gray-100">{section.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            section.exam_importance === 'critical' 
              ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
              : section.exam_importance === 'important'
              ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
              : 'bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300'
          }`}>
            {section.exam_importance}
          </span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{section.summary}</p>
      </div>

      {section.detailed_content && (
        <div className="space-y-6">
          {/* Key Points */}
          {section.detailed_content.key_points && section.detailed_content.key_points.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Key Points
              </h4>
              <div className="space-y-4">
                {section.detailed_content.key_points.map((point, index) => (
                  <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                    <p className="text-green-900 dark:text-green-100 font-medium mb-2">{point.point}</p>
                    {point.explanation && (
                      <p className="text-green-800 dark:text-green-200 text-sm mb-2">{point.explanation}</p>
                    )}
                    {point.memory_aid && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        <span className="font-medium">Memory aid:</span> {point.memory_aid}
                      </div>
                    )}
                    {point.exam_tip && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        <span className="font-medium">Exam tip:</span> {point.exam_tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulas in this section */}
          {section.detailed_content.formulas && section.detailed_content.formulas.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-500" />
                Formulas
              </h4>
              <div className="space-y-6">
                {section.detailed_content.formulas.map((formula, index) => (
                  <div key={formula.formula_id || index} className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3">{formula.name}</h5>
                    
                    {/* Formula equation */}
                    <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg mb-4">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        className="text-white"
                      >
                        {formula.equation_latex || formula.equation_plain}
                      </ReactMarkdown>
                    </div>
                    
                    {/* Variables */}
                    {formula.variables && (
                      <div className="mb-4">
                        <h6 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Variables:</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(formula.variables).map(([symbol, details]) => (
                            <div key={symbol} className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-blue-600">
                              <div className="flex items-start gap-3">
                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{symbol}</span>
                                <div className="flex-1">
                                  <p className="text-blue-800 dark:text-blue-200 text-sm">{details.description}</p>
                                  {details.units_si && (
                                    <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">Units: {details.units_si}</p>
                                  )}
                                  {details.typical_range && (
                                    <p className="text-blue-600 dark:text-blue-400 text-xs">Range: {details.typical_range}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Example calculations */}
                    {formula.example_calculations && formula.example_calculations.length > 0 && (
                      <div>
                        <h6 className="font-medium text-blue-800 dark:text-blue-200 mb-3">Example Calculations:</h6>
                        {formula.example_calculations.map((example, i) => (
                          <div key={i} className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-blue-600">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                example.difficulty === 'basic' 
                                  ? 'bg-green-100 text-green-700'
                                  : example.difficulty === 'intermediate'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {example.difficulty}
                              </span>
                              {example.time_to_solve && (
                                <span className="text-xs text-gray-500">⏱️ {example.time_to_solve}</span>
                              )}
                            </div>
                            
                            <p className="text-blue-900 dark:text-blue-100 font-medium mb-2">{example.problem}</p>
                            
                            {example.given_data && (
                              <div className="mb-3">
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Given:</span>
                                <ul className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                  {Object.entries(example.given_data).map(([key, value]) => (
                                    <li key={key}>• {key} = {value}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="mb-2">
                              <span className="text-sm font-medium text-green-700 dark:text-green-300">Answer:</span>
                              <p className="text-sm text-green-600 dark:text-green-400 mt-1">{example.final_answer}</p>
                            </div>
                            
                            {example.common_mistakes && example.common_mistakes.length > 0 && (
                              <div>
                                <span className="text-sm font-medium text-red-700 dark:text-red-300">Common mistakes:</span>
                                <ul className="text-sm text-red-600 dark:text-red-400 mt-1">
                                  {example.common_mistakes.map((mistake, j) => (
                                    <li key={j}>⚠️ {mistake}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
