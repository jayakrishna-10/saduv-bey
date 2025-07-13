// app/lib/revision-utils.js
// Utility functions for handling revision notes data

export const normalizeRevisionData = (revisionNotes) => {
  if (!revisionNotes || !revisionNotes.notes) return null;
  
  // Ensure notes is parsed if it's a string
  const notes = typeof revisionNotes.notes === 'string' 
    ? JSON.parse(revisionNotes.notes) 
    : revisionNotes.notes;
    
  return {
    ...revisionNotes,
    notes
  };
};

export const extractKeyMetrics = (revisionData) => {
  if (!revisionData || !revisionData.notes) return {};
  
  const notes = revisionData.notes;
  
  return {
    studyTime: notes.metadata?.estimated_study_time_hours || 0,
    difficulty: notes.metadata?.difficulty_level || 'Unknown',
    examWeight: notes.metadata?.exam_weightage_percentage || 0,
    conceptCount: notes.key_concepts?.length || 0,
    formulaCount: notes.formulas_quick_reference?.length || 0,
    sectionCount: notes.content_sections?.length || 0,
    complexityScore: notes.metadata?.content_complexity_score || 0
  };
};

export const searchRevisionContent = (revisionData, searchTerm) => {
  if (!revisionData || !searchTerm) return revisionData;
  
  const term = searchTerm.toLowerCase();
  const notes = revisionData.notes;
  
  // Search in various fields
  const searchResults = {
    concepts: notes.key_concepts?.filter(concept => 
      concept.name.toLowerCase().includes(term) ||
      concept.definition.toLowerCase().includes(term)
    ) || [],
    
    formulas: notes.formulas_quick_reference?.filter(formula =>
      formula.category?.toLowerCase().includes(term) ||
      formula.when_to_use?.toLowerCase().includes(term)
    ) || [],
    
    sections: notes.content_sections?.filter(section =>
      section.title.toLowerCase().includes(term) ||
      section.summary?.toLowerCase().includes(term)
    ) || [],
    
    terminology: notes.terminology_glossary?.filter(term_entry =>
      term_entry.term.toLowerCase().includes(term) ||
      term_entry.definition.toLowerCase().includes(term)
    ) || []
  };
  
  return {
    ...revisionData,
    searchResults,
    hasResults: Object.values(searchResults).some(arr => arr.length > 0)
  };
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'basic':
      return {
        bg: 'bg-green-100 dark:bg-green-900/50',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-700'
      };
    case 'intermediate':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/50',
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-200 dark:border-yellow-700'
      };
    case 'advanced':
      return {
        bg: 'bg-red-100 dark:bg-red-900/50',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-200 dark:border-red-700'
      };
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-700/50',
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-200 dark:border-gray-600'
      };
  }
};

export const getImportanceColor = (importance) => {
  switch (importance?.toLowerCase()) {
    case 'critical':
      return {
        bg: 'bg-red-100 dark:bg-red-900/50',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-200 dark:border-red-700'
      };
    case 'important':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/50',
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-200 dark:border-yellow-700'
      };
    case 'supplementary':
      return {
        bg: 'bg-gray-100 dark:bg-gray-700/50',
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-200 dark:border-gray-600'
      };
    default:
      return {
        bg: 'bg-blue-100 dark:bg-blue-900/50',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-700'
      };
  }
};

export const formatStudyTime = (hours) => {
  if (!hours) return 'N/A';
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  if (hours === 1) return '1 hour';
  return `${hours} hours`;
};

export const calculateProgress = (revisionData, userProgress = {}) => {
  if (!revisionData || !revisionData.notes) return { completed: 0, total: 100 };
  
  const notes = revisionData.notes;
  let totalItems = 0;
  let completedItems = 0;
  
  // Count key concepts
  if (notes.key_concepts) {
    totalItems += notes.key_concepts.length;
    completedItems += userProgress.concepts || 0;
  }
  
  // Count formulas
  if (notes.formulas_quick_reference) {
    totalItems += notes.formulas_quick_reference.length;
    completedItems += userProgress.formulas || 0;
  }
  
  // Count content sections
  if (notes.content_sections) {
    totalItems += notes.content_sections.length;
    completedItems += userProgress.sections || 0;
  }
  
  const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  return {
    completed: completedItems,
    total: totalItems,
    percentage
  };
};

export const generateStudyPlan = (revisionData) => {
  if (!revisionData || !revisionData.notes) return [];
  
  const notes = revisionData.notes;
  const plan = [];
  
  // Phase 1: Overview and learning objectives
  if (notes.learning_objectives) {
    plan.push({
      phase: 1,
      title: 'Chapter Overview',
      duration: '30 minutes',
      tasks: [
        'Review learning objectives',
        'Study concept mindmap',
        'Understand chapter structure'
      ],
      items: notes.learning_objectives
    });
  }
  
  // Phase 2: Key concepts
  if (notes.key_concepts) {
    plan.push({
      phase: 2,
      title: 'Key Concepts',
      duration: `${Math.round(notes.key_concepts.length * 0.15)} hours`,
      tasks: [
        'Learn definitions',
        'Understand applications',
        'Note common mistakes'
      ],
      items: notes.key_concepts
    });
  }
  
  // Phase 3: Formulas and calculations
  if (notes.formulas_quick_reference) {
    plan.push({
      phase: 3,
      title: 'Formulas & Calculations',
      duration: `${Math.round(notes.formulas_quick_reference.length * 0.25)} hours`,
      tasks: [
        'Learn formula applications',
        'Practice example problems',
        'Memorize key equations'
      ],
      items: notes.formulas_quick_reference
    });
  }
  
  // Phase 4: Detailed content
  if (notes.content_sections) {
    plan.push({
      phase: 4,
      title: 'Detailed Study',
      duration: `${Math.round(notes.content_sections.length * 0.5)} hours`,
      tasks: [
        'Study each section thoroughly',
        'Review procedures and standards',
        'Analyze case studies'
      ],
      items: notes.content_sections
    });
  }
  
  // Phase 5: Exam preparation
  if (notes.exam_strategy) {
    plan.push({
      phase: 5,
      title: 'Exam Strategy',
      duration: '45 minutes',
      tasks: [
        'Review exam patterns',
        'Practice time management',
        'Learn common traps'
      ],
      items: notes.exam_strategy.question_patterns || []
    });
  }
  
  return plan;
};

export const extractFormulaSummary = (revisionData) => {
  if (!revisionData || !revisionData.notes) return [];
  
  const formulas = [];
  
  // Extract from quick reference
  if (revisionData.notes.formulas_quick_reference) {
    formulas.push(...revisionData.notes.formulas_quick_reference.map(f => ({
      ...f,
      source: 'quick_reference'
    })));
  }
  
  // Extract from content sections
  if (revisionData.notes.content_sections) {
    revisionData.notes.content_sections.forEach(section => {
      if (section.detailed_content?.formulas) {
        formulas.push(...section.detailed_content.formulas.map(f => ({
          ...f,
          source: 'content_section',
          section: section.title
        })));
      }
    });
  }
  
  return formulas;
};

export const validateRevisionData = (data) => {
  const errors = [];
  
  if (!data) {
    errors.push('No revision data provided');
    return { isValid: false, errors };
  }
  
  if (!data.notes) {
    errors.push('No notes data found');
    return { isValid: false, errors };
  }
  
  const notes = data.notes;
  
  // Check required sections
  if (!notes.metadata) {
    errors.push('Missing metadata section');
  }
  
  if (!notes.key_concepts || notes.key_concepts.length === 0) {
    errors.push('No key concepts found');
  }
  
  if (!notes.content_sections || notes.content_sections.length === 0) {
    errors.push('No content sections found');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
};

// Export default object with all utilities
export default {
  normalizeRevisionData,
  extractKeyMetrics,
  searchRevisionContent,
  getDifficultyColor,
  getImportanceColor,
  formatStudyTime,
  calculateProgress,
  generateStudyPlan,
  extractFormulaSummary,
  validateRevisionData
};
