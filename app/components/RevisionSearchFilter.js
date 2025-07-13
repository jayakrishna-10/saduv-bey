// app/components/RevisionSearchFilter.js
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  Target, 
  BookOpen, 
  Calculator,
  ChevronDown,
  SlidersHorizontal,
  Tag
} from 'lucide-react';

export function RevisionSearchFilter({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  setFilters, 
  availableFilters = {} 
}) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      difficulty: 'all',
      examImportance: 'all',
      studyTime: 'all',
      contentType: 'all',
      category: 'all'
    });
    setSearchTerm('');
  };

  const activeFiltersCount = Object.values(filters).filter(val => val !== 'all').length;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search revision notes, concepts, formulas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 text-lg placeholder-gray-500 dark:placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </button>
        )}
      </div>

      {/* Quick Filters and Advanced Toggle */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('difficulty', 'basic')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              filters.difficulty === 'basic'
                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600'
                : 'bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
            }`}
          >
            Basic
          </button>
          
          <button
            onClick={() => handleFilterChange('examImportance', 'critical')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              filters.examImportance === 'critical'
                ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600'
                : 'bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
            }`}
          >
            Critical
          </button>
          
          <button
            onClick={() => handleFilterChange('contentType', 'formulas')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              filters.contentType === 'formulas'
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600'
                : 'bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
            }`}
          >
            <Calculator className="h-4 w-4 mr-1" />
            Formulas
          </button>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Advanced
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs">
              {activeFiltersCount}
            </span>
          )}
          <motion.div
            animate={{ rotate: showAdvancedFilters ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </button>

        {/* Clear Filters */}
        {(activeFiltersCount > 0 || searchTerm) && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Target className="h-4 w-4 inline mr-2" />
                  Difficulty Level
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Levels</option>
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Exam Importance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <BookOpen className="h-4 w-4 inline mr-2" />
                  Exam Importance
                </label>
                <select
                  value={filters.examImportance}
                  onChange={(e) => handleFilterChange('examImportance', e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Importance</option>
                  <option value="critical">Critical</option>
                  <option value="important">Important</option>
                  <option value="supplementary">Supplementary</option>
                </select>
              </div>

              {/* Study Time Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Study Time
                </label>
                <select
                  value={filters.studyTime}
                  onChange={(e) => handleFilterChange('studyTime', e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                >
                  <option value="all">Any Duration</option>
                  <option value="short">Short (< 2 hours)</option>
                  <option value="medium">Medium (2-5 hours)</option>
                  <option value="long">Long (> 5 hours)</option>
                </select>
              </div>

              {/* Content Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Filter className="h-4 w-4 inline mr-2" />
                  Content Type
                </label>
                <select
                  value={filters.contentType}
                  onChange={(e) => handleFilterChange('contentType', e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Content</option>
                  <option value="theory">Theory</option>
                  <option value="formulas">Formulas</option>
                  <option value="calculations">Calculations</option>
                  <option value="procedures">Procedures</option>
                  <option value="case_studies">Case Studies</option>
                  <option value="standards">Standards</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Tag className="h-4 w-4 inline mr-2" />
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Categories</option>
                  <option value="energy_management">Energy Management</option>
                  <option value="thermal_utilities">Thermal Utilities</option>
                  <option value="electrical_utilities">Electrical Utilities</option>
                  <option value="auditing">Energy Auditing</option>
                  <option value="efficiency">Energy Efficiency</option>
                </select>
              </div>

              {/* Paper-specific filters could be added here */}
              {availableFilters.papers && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <BookOpen className="h-4 w-4 inline mr-2" />
                    Paper
                  </label>
                  <select
                    value={filters.paper || 'all'}
                    onChange={(e) => handleFilterChange('paper', e.target.value)}
                    className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Papers</option>
                    {availableFilters.papers.map(paper => (
                      <option key={paper.value} value={paper.value}>{paper.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Filter Summary */}
            {activeFiltersCount > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Filter className="h-4 w-4" />
                  <span>Active filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters)
                      .filter(([_, value]) => value !== 'all')
                      .map(([key, value]) => (
                      <span
                        key={key}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
