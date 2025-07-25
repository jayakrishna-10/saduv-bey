// FILE: app/lib/weightage-utils.js

// Cache for weightages to avoid repeated API calls
let weightageCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch chapter weightages from database with caching
 * @returns {Promise<Object>} Weightages organized by paper
 */
export async function fetchChapterWeightages() {
  // Check cache first
  if (weightageCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return weightageCache;
  }

  try {
    const response = await fetch('/api/weightages');
    if (!response.ok) {
      throw new Error('Failed to fetch weightages');
    }
    
    const data = await response.json();
    
    // Update cache
    weightageCache = data.weightages;
    cacheTimestamp = Date.now();
    
    return weightageCache;
  } catch (error) {
    console.error('Error fetching weightages:', error);
    
    // Return fallback weightages if API fails
    return getFallbackWeightages();
  }
}

/**
 * Get weightages for a specific paper
 * @param {string} paper - paper1, paper2, or paper3
 * @returns {Promise<Object>} Chapter weightages for the paper
 */
export async function getPaperWeightages(paper) {
  const allWeightages = await fetchChapterWeightages();
  return allWeightages[paper] || {};
}

/**
 * Get weightage for a specific chapter in a paper
 * @param {string} paper - paper1, paper2, or paper3
 * @param {string} chapter - Chapter name
 * @returns {Promise<number>} Weightage percentage (0-100)
 */
export async function getChapterWeightage(paper, chapter) {
  const paperWeightages = await getPaperWeightages(paper);
  return paperWeightages[chapter] || 0;
}

/**
 * Calculate predicted score for a specific paper
 * @param {Object} chapterStats - Chapter statistics
 * @param {string} paper - paper1, paper2, or paper3
 * @returns {Promise<number>} Predicted score (0-100)
 */
export async function calculatePaperScore(chapterStats, paper) {
  const paperWeightages = await getPaperWeightages(paper);
  
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  Object.entries(paperWeightages).forEach(([chapterName, weightage]) => {
    const chapterData = chapterStats[chapterName];
    const accuracy = chapterData?.accuracy || 0;
    
    totalWeightedScore += (accuracy / 100) * weightage;
    totalWeight += weightage;
  });
  
  // Return percentage score
  return totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;
}

/**
 * Calculate predicted scores for all papers
 * @param {Object} chapterStatsByPaper - Chapter stats organized by paper
 * @returns {Promise<Object>} Scores for all papers and overall
 */
export async function calculateAllPredictedScores(chapterStatsByPaper) {
  if (!chapterStatsByPaper) {
    return {
      paper1: 0,
      paper2: 0,
      paper3: 0,
      overall: 0
    };
  }

  try {
    const [paper1Score, paper2Score, paper3Score] = await Promise.all([
      calculatePaperScore(chapterStatsByPaper.paper1 || {}, 'paper1'),
      calculatePaperScore(chapterStatsByPaper.paper2 || {}, 'paper2'),
      calculatePaperScore(chapterStatsByPaper.paper3 || {}, 'paper3')
    ]);

    const overallScore = (paper1Score + paper2Score + paper3Score) / 3;

    return {
      paper1: paper1Score,
      paper2: paper2Score,
      paper3: paper3Score,
      overall: overallScore
    };
  } catch (error) {
    console.error('Error calculating predicted scores:', error);
    return {
      paper1: 0,
      paper2: 0,
      paper3: 0,
      overall: 0
    };
  }
}

/**
 * Calculate chapter impact scores for weak area detection
 * @param {Object} chapterStatsByPaper - Chapter stats organized by paper
 * @param {string} selectedPaper - Specific paper or 'all'
 * @returns {Promise<Array>} Sorted array of chapters by impact
 */
export async function calculateChapterImpacts(chapterStatsByPaper, selectedPaper = 'all') {
  let allChapters = [];

  try {
    if (selectedPaper === 'all') {
      // Combine all papers
      for (const paper of ['paper1', 'paper2', 'paper3']) {
        const paperWeightages = await getPaperWeightages(paper);
        const chapters = chapterStatsByPaper[paper] || {};
        
        Object.entries(chapters).forEach(([chapterName, stats]) => {
          const weightage = paperWeightages[chapterName] || 0;
          allChapters.push({
            chapter: chapterName,
            paper,
            accuracy: stats.accuracy || 0,
            questions: stats.totalQuestions || 0,
            weightage,
            impact: weightage * (100 - (stats.accuracy || 0)) / 100
          });
        });
      }
    } else {
      // Single paper
      const paperWeightages = await getPaperWeightages(selectedPaper);
      const chapters = chapterStatsByPaper[selectedPaper] || {};
      
      Object.entries(chapters).forEach(([chapterName, stats]) => {
        const weightage = paperWeightages[chapterName] || 0;
        allChapters.push({
          chapter: chapterName,
          paper: selectedPaper,
          accuracy: stats.accuracy || 0,
          questions: stats.totalQuestions || 0,
          weightage,
          impact: weightage * (100 - (stats.accuracy || 0)) / 100
        });
      });
    }

    // Sort by impact (highest first)
    return allChapters.sort((a, b) => b.impact - a.impact);
  } catch (error) {
    console.error('Error calculating chapter impacts:', error);
    return [];
  }
}

/**
 * Fallback weightages if database is unavailable
 * This should match your current CHAPTER_WEIGHTAGES as backup
 */
function getFallbackWeightages() {
  return {
    paper1: {
      "Company Law": 15,
      "Financial Accounting": 25,
      "Economics": 20,
      "Quantitative Methods": 15,
      "Business Law": 10,
      "Taxation": 15
    },
    paper2: {
      "Advanced Financial Accounting": 30,
      "Cost Accounting": 25,
      "Management Accounting": 20,
      "Auditing": 25
    },
    paper3: {
      "Financial Management": 35,
      "Strategic Management": 25,
      "Corporate Governance": 15,
      "Risk Management": 25
    }
  };
}

/**
 * Clear weightage cache (useful for testing or when weightages are updated)
 */
export function clearWeightageCache() {
  weightageCache = null;
  cacheTimestamp = null;
}
