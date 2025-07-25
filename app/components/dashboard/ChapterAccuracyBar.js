// FILE: app/components/dashboard/ChapterAccuracyBar.js
'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Target, TrendingUp, AlertCircle, ChevronRight, BookOpen, Loader2 } from 'lucide-react';
import { getChartOptions } from '@/lib/chart-config';
import { getPaperWeightages } from '@/lib/weightage-utils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function ChapterAccuracyBar({ chapterStats, onChapterClick }) {
  const [selectedPaper, setSelectedPaper] = useState('paper1');
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paperWeightages, setPaperWeightages] = useState({});

  useEffect(() => {
    loadWeightagesAndProcessData();
  }, [chapterStats, selectedPaper]);

  const loadWeightagesAndProcessData = async () => {
    if (!chapterStats) {
      setChartData(null);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch weightages for the selected paper
      const weightages = await getPaperWeightages(selectedPaper);
      setPaperWeightages(weightages);
      
      // Process chart data with the fetched weightages
      processChapterData(weightages);
    } catch (error) {
      console.error('Error loading weightages:', error);
      // Use empty weightages as fallback
      processChapterData({});
    } finally {
      setIsLoading(false);
    }
  };

  const processChapterData = (weightages) => {
    if (!chapterStats || !chapterStats[selectedPaper]) {
      setChartData(null);
      return;
    }

    // Get all chapters for the selected paper from weightages
    const chapterNames = Object.keys(weightages);
    
    // If no weightages available, fall back to chapters from stats
    const availableChapters = chapterNames.length > 0 
      ? chapterNames 
      : Object.keys(chapterStats[selectedPaper] || {});
    
    // Get stats for each chapter
    const chapterDataArray = availableChapters.map(chapterName => {
      const stats = chapterStats[selectedPaper][chapterName] || {
        accuracy: 0,
        totalQuestions: 0,
        correctAnswers: 0
      };
      
      return {
        chapter: chapterName,
        accuracy: stats.accuracy || 0,
        totalQuestions: stats.totalQuestions || 0,
        correctAnswers: stats.correctAnswers || 0,
        weightage: weightages[chapterName] || 0
      };
    });

    // Sort by accuracy (highest first)
    chapterDataArray.sort((a, b) => b.accuracy - a.accuracy);

    const labels = chapterDataArray.map(item => {
      // Truncate long chapter names for display
      const name = item.chapter.length > 40 ? item.chapter.substring(0, 37) + '...' : item.chapter;
      return name;
    });

    const accuracyData = chapterDataArray.map(item => item.accuracy);
    
    // Color based on accuracy
    const backgroundColors = accuracyData.map(accuracy => {
      if (accuracy >= 80) return 'rgba(34, 197, 94, 0.8)'; // green
      if (accuracy >= 60) return 'rgba(251, 191, 36, 0.8)'; // yellow
      return 'rgba(239, 68, 68, 0.8)'; // red
    });

    const borderColors = accuracyData.map(accuracy => {
      if (accuracy >= 80) return 'rgb(34, 197, 94)';
      if (accuracy >= 60) return 'rgb(251, 191, 36)';
      return 'rgb(239, 68, 68)';
    });

    setChartData({
      labels,
      datasets: [{
        label: 'Accuracy %',
        data: accuracyData,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 25,
      }],
      fullData: chapterDataArray
    });
  };

  const chartOptions = getChartOptions('bar', {
    indexAxis: 'y', // Horizontal bars
    xAxisLabel: 'Accuracy (%)',
    enableLegend: false,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      y: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          font: {
            size: 11
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && chartData) {
        const index = elements[0].index;
        const chapterData = chartData.fullData[index];
        onChapterClick({ 
          chapter: chapterData.chapter,
          paper: selectedPaper,
          ...chapterData
        });
      }
    }
  });

  const papers = [
    { id: 'paper1', name: 'Paper 1', color: 'from-blue-500 to-indigo-600' },
    { id: 'paper2', name: 'Paper 2', color: 'from-orange-500 to-red-600' },
    { id: 'paper3', name: 'Paper 3', color: 'from-emerald-500 to-cyan-600' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 h-full">
      <div className="flex flex-col h-full">
        {/* Header with Paper Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Chapter Accuracy Rankings
            </h3>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>≥80%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>60-79%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>&lt;60%</span>
              </div>
            </div>
          </div>

          {/* Paper Selector */}
          <div className="flex gap-2">
            {papers.map(paper => (
              <button
                key={paper.id}
                onClick={() => setSelectedPaper(paper.id)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedPaper === paper.id
                    ? `bg-gradient-to-r ${paper.color} text-white shadow-lg`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {paper.name}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 min-h-0">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : chartData && chartData.fullData.length > 0 ? (
            <>
              <div className="h-[500px] relative">
                <Bar data={chartData} options={chartOptions} />
              </div>
              
              <div className="mt-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <AlertCircle className="h-4 w-4 mr-1" />
                Click on any bar to view detailed chapter statistics
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <Target className="h-12 w-12 mb-3 opacity-50" />
              <p>No data available for {papers.find(p => p.id === selectedPaper)?.name}</p>
              <p className="text-sm mt-1">Complete some quizzes to see your performance</p>
            </div>
          )}
        </div>

        {/* Chapter Count Summary */}
        {chartData && chartData.fullData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Total Chapters: {chartData.fullData.length}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-green-600 dark:text-green-400">
                  Strong: {chartData.fullData.filter(c => c.accuracy >= 80).length}
                </span>
                <span className="text-yellow-600 dark:text-yellow-400">
                  Moderate: {chartData.fullData.filter(c => c.accuracy >= 60 && c.accuracy < 80).length}
                </span>
                <span className="text-red-600 dark:text-red-400">
                  Weak: {chartData.fullData.filter(c => c.accuracy < 60).length}
                </span>
              </div>
            </div>

            {/* Weightages Info */}
            {Object.keys(paperWeightages).length > 0 && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                Chapter weightages sourced from NCE database
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
