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
import { Target, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import { getChartOptions } from '@/lib/chart-config';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function ChapterAccuracyBar({ onChapterClick }) {
  const [chapterData, setChapterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredChapter, setHoveredChapter] = useState(null);

  useEffect(() => {
    fetchChapterAccuracy();
  }, []);

  const fetchChapterAccuracy = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/learning-analytics');
      const data = await response.json();
      
      if (response.ok && data.chapterStats) {
        processChapterData(data.chapterStats);
      }
    } catch (error) {
      console.error('Error fetching chapter accuracy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processChapterData = (stats) => {
    // Sort chapters by accuracy (descending)
    const sortedChapters = Object.entries(stats)
      .sort(([, a], [, b]) => b.accuracy - a.accuracy)
      .slice(0, 10); // Top 10 chapters

    const labels = sortedChapters.map(([chapter]) => {
      // Truncate long chapter names
      return chapter.length > 30 ? chapter.substring(0, 27) + '...' : chapter;
    });

    const accuracyData = sortedChapters.map(([, data]) => data.accuracy);
    
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

    setChapterData({
      labels,
      datasets: [{
        label: 'Accuracy %',
        data: accuracyData,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 30,
      }],
      fullData: sortedChapters
    });
  };

  const chartOptions = getChartOptions('bar', {
    title: 'Chapter Accuracy Rankings',
    indexAxis: 'y', // Horizontal bars
    xAxisLabel: 'Accuracy (%)',
    enableLegend: false,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements.length > 0 && chapterData) {
        const index = elements[0].index;
        const [chapter, data] = chapterData.fullData[index];
        onChapterClick({ chapter, ...data });
      }
    },
    onHover: (event, elements) => {
      if (elements.length > 0) {
        setHoveredChapter(elements[0].index);
      } else {
        setHoveredChapter(null);
      }
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Chapter Accuracy Rankings
        </h3>
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
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

      {chapterData && chapterData.fullData.length > 0 ? (
        <>
          <div className="h-[400px] cursor-pointer">
            <Bar data={chapterData} options={chartOptions} />
          </div>
          
          <div className="mt-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            <AlertCircle className="h-4 w-4 mr-1" />
            Click on any bar to view detailed chapter statistics
          </div>
          
          {/* Mobile-friendly list view */}
          <div className="mt-6 md:hidden space-y-2">
            {chapterData.fullData.slice(0, 5).map(([chapter, data], index) => (
              <button
                key={chapter}
                onClick={() => onChapterClick({ chapter, ...data })}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded ${
                    data.accuracy >= 80 ? 'bg-green-500' :
                    data.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                      {chapter}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {data.totalQuestions} questions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-semibold ${
                    data.accuracy >= 80 ? 'text-green-600 dark:text-green-400' :
                    data.accuracy >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {data.accuracy}%
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="h-[400px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <Target className="h-12 w-12 mb-3 opacity-50" />
          <p>No chapter data available yet</p>
          <p className="text-sm mt-1">Complete some quizzes to see your performance</p>
        </div>
      )}
    </div>
  );
}
